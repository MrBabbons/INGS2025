import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config";

export default function ArgomentiObbligatoriPage() {
  const { corsoId } = useParams();
  const navigate = useNavigate();

  const [allArg, setAllArg] = useState([]);
  const [selArg, setSelArg] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resAll, resReq] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/argomenti`, { headers }),
          fetch(
            `${API_BASE_URL}/admin/corsi/${corsoId}/argomenti-obbligatori`,
            { headers }
          ),
        ]);
        if (!resAll.ok) throw new Error("Errore caricamento argomenti");
        if (!resReq.ok) throw new Error("Errore caricamento obbligatori");

        const all = await resAll.json();
        const req = await resReq.json();

        setAllArg(all);
        setSelArg(new Set(req.map((a) => a.id)));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [corsoId]);

  const toggle = (aid) => {
    setSelArg((prev) => {
      const s = new Set(prev);
      s.has(aid) ? s.delete(aid) : s.add(aid);
      return s;
    });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/admin/corsi/${corsoId}/argomenti-obbligatori/bulk`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ argomenti: Array.from(selArg) }),
        }
      );
      if (!res.ok) throw new Error("Errore salvataggio");
      alert("Argomenti obbligatori aggiornati");
      navigate("/admin");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Caricamento…</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Argomenti Obbligatori – Corso {corsoId}</h2>
      <div className="row">
        {allArg.map((a) => (
          <div key={a.id} className="col-md-4">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`arg-${a.id}`}
                checked={selArg.has(a.id)}
                onChange={() => toggle(a.id)}
              />
              <label className="form-check-label" htmlFor={`arg-${a.id}`}>
                {a.descrizione}
              </label>
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3" onClick={handleSave}>
        Salva
      </button>
    </div>
  );
}
