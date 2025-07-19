// src/pages/admin/InsegnamentoDocentiPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config";

export default function InsegnamentoDocentiPage() {
  const { id } = useParams();       // id dell'insegnamento
  const navigate = useNavigate();

  const [docenti, setDocenti]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/admin/insegnamenti/${id}/docenti`, { headers })
      .then((r) => r.json())
      .then(setDocenti)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const toggle = (docId) => {
    setDocenti((prev) =>
      prev.map((d) =>
        d.id === docId ? { ...d, assigned: !d.assigned } : d
      )
    );
  };

  const save = async () => {
    const lista = docenti.filter((d) => d.assigned).map((d) => d.id);
    await fetch(`${API_BASE_URL}/admin/insegnamenti/${id}/docenti`, {
      method: "POST",
      headers,
      body: JSON.stringify({ docenti: lista }),
    });
    alert("Assegnamenti aggiornati");
    navigate("/admin/insegnamenti");
  };

  if (loading) return <p>Caricamento…</p>;

  return (
    <div className="container mt-4">
      <h2>Assegna Docenti – Insegnamento #{id}</h2>
      {docenti.map((d) => (
        <div key={d.id} className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id={`doc-${d.id}`}
            checked={d.assigned}
            onChange={() => toggle(d.id)}
          />
          <label className="form-check-label" htmlFor={`doc-${d.id}`}>
            {d.nome}
          </label>
        </div>
      ))}
      <button className="btn btn-primary mt-3" onClick={save}>
        Salva
      </button>
    </div>
  );
}
