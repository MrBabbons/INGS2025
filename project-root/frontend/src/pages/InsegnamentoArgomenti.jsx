// src/pages/InsegnamentoArgomenti.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

export default function InsegnamentoArgomenti() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [allArg, setAllArg] = useState([]);
  const [selArg, setSelArg] = useState(new Set());

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/argomenti`, { headers }).then((r) => r.json()),
      fetch(`${API_BASE_URL}/insegnamenti/${id}/argomenti`, { headers }).then((r) =>
        r.json()
      ),
    ]).then(([args, linked]) => {
      setAllArg(args);
      setSelArg(new Set(linked));
    });
  }, [id]);

  const toggle = (aid) => {
    setSelArg((prev) => {
      const s = new Set(prev);
      s.has(aid) ? s.delete(aid) : s.add(aid);
      return s;
    });
  };

  const save = async () => {
    await fetch(`${API_BASE_URL}/insegnamenti/${id}/argomenti`, {
      method: "POST",
      headers,
      body: JSON.stringify({ argomenti: Array.from(selArg) }),
    });
    alert("Argomenti aggiornati");
    navigate("/docente");
  };

  return (
    <div className="container mt-5">
      <h2>Gestisci Argomenti – Insegnamento {id}</h2>
      <div className="row">
        {allArg.map((a) => (
          <div key={a.id} className="col-md-4">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
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
      <button className="btn btn-primary mt-3" onClick={save}>
        Salva selezione
      </button>
    </div>
  );
}
