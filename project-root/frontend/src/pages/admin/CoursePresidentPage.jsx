// src/pages/admin/CoursePresidentPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config";

export default function CoursePresidentPage() {
  const { corsoId } = useParams();
  const navigate = useNavigate();

  const [docenti, setDocenti] = useState([]);
  const [selPres, setSelPres] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => {
    fetch(`${API_BASE_URL}/admin/corsi/${corsoId}/docenti-president`, { headers })
      .then((r) => r.json())
      .then(({ docenti, presidente_id }) => {
        setDocenti(docenti);
        setSelPres(presidente_id);
      })
      .finally(() => setLoading(false));
  }, [corsoId]);

  const save = async () => {
    await fetch(`${API_BASE_URL}/admin/corsi/${corsoId}/president`, {
      method: "POST",
      headers,
      body: JSON.stringify({ presidenteId: selPres }),
    });
    alert("Presidente aggiornato");
    navigate("/admin/corsi");
  };

  if (loading) return <p>Caricamento…</p>;

  return (
    <div className="container mt-4">
      <h2>Designa Presidente – Corso {corsoId}</h2>
      <select
        className="form-select mb-3"
        value={selPres || ""}
        onChange={(e) => setSelPres(e.target.value || null)}
      >
        <option value="">-- Nessun Presidente --</option>
        {docenti.map((d) => (
          <option key={d.id} value={d.id}>
            {d.nome}
          </option>
        ))}
      </select>
      <button className="btn btn-primary" onClick={save}>
        Salva
      </button>
    </div>
  );
}
