import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

const InsegnamentoArgomenti = () => {
  const { id } = useParams();         // insegnamento_id
  const [allArgs, setAllArgs] = useState([]);
  const [selArgs, setSelArgs] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    Promise.all([
      fetch(`${API_BASE_URL}/argomenti`,    { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_BASE_URL}/insegnamenti/${id}/argomenti`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([args, linked]) => {
      setAllArgs(args);
      setSelArgs(new Set(linked.map(a => a.argomento_id)));
    });
  }, [id]);

  const toggle = (argId) => {
    const s = new Set(selArgs);
    s.has(argId) ? s.delete(argId) : s.add(argId);
    setSelArgs(s);
  };

  const handleSave = () => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/insegnamenti/${id}/argomenti`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ argomenti: Array.from(selArgs) })
    }).then(() => {
      alert("Argomenti aggiornati");
      navigate("/docente");
    });
  };

  return (
    <div className="container mt-5">
      <h2>📑 Seleziona Argomenti</h2>
      <div className="row">
        {allArgs.map(a => (
          <div key={a.id} className="col-md-4">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`arg-${a.id}`}
                checked={selArgs.has(a.id)}
                onChange={() => toggle(a.id)}
              />
              <label className="form-check-label" htmlFor={`arg-${a.id}`}>
                {a.descrizione}
              </label>
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-4" onClick={handleSave}>Salva</button>
    </div>
  );
};

export default InsegnamentoArgomenti;
