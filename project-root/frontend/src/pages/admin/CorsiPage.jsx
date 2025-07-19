// src/pages/admin/CorsiPage.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../../config";

export default function CorsiPage() {
  const [corsi, setCorsi] = useState([]);
  const [nome, setNome] = useState("");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => {
    fetch(`${API_BASE_URL}/admin/corsi`, { headers })
      .then((r) => r.json())
      .then(setCorsi);
  }, []);

  const addCorso = async () => {
    if (!nome.trim()) return;
    const res = await fetch(`${API_BASE_URL}/admin/corsi`, {
      method: "POST",
      headers,
      body: JSON.stringify({ nome }),
    });
    if (res.ok) {
      const newC = await res.json();
      setCorsi((p) => [newC, ...p]);
      setNome("");
    }
  };

  const deleteCorso = async (id) => {
    if (!window.confirm("Eliminare questo corso?")) return;
    await fetch(`${API_BASE_URL}/admin/corsi/${id}`, {
      method: "DELETE",
      headers,
    });
    setCorsi((p) => p.filter((c) => c.id !== id));
  };

  return (
    <div className="container mt-4">
      <h2>Gestione Corsi di Laurea</h2>

      <div className="input-group mb-3">
        <input
          className="form-control"
          placeholder="Nuovo corso"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addCorso}>
          Aggiungi
        </button>
      </div>

      <ul className="list-group">
        {corsi.map((c) => (
          <li
            key={c.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{c.nome}</strong>
              {c.presidenteNome && (
                <span className="badge bg-success ms-3">
                  Presidente: {c.presidenteNome}
                </span>
              )}
            </div>
            <div>
              <Link
                to={`/admin/corsi/${c.id}/docenti-president`}
                className="btn btn-sm btn-outline-primary me-2"
              >
                Designa Presidente
              </Link>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => deleteCorso(c.id)}
              >
                Elimina
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
