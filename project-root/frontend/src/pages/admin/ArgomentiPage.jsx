// src/pages/admin/ArgomentiPage.jsx

import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../config";

export default function ArgomentiPage() {
  const [argomenti, setArgomenti] = useState([]);
  const [descr, setDescr] = useState("");

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/admin/argomenti`, { headers })
      .then((r) => r.json())
      .then(setArgomenti);
  }, []);

  // add() con controllo di unicità
  const add = async () => {
    const value = descr.trim();
    if (!value) return;

    const exists = argomenti.some(
      (a) => a.descrizione.toLowerCase() === value.toLowerCase()
    );
    if (exists) {
      alert("Attenzione: questo argomento è già presente.");
      return;
    }

    const res = await fetch(`${API_BASE_URL}/admin/argomenti`, {
      method: "POST",
      headers,
      body: JSON.stringify({ descrizione: value }),
    });

    if (res.ok) {
      const newA = await res.json();
      setArgomenti((prev) => [newA, ...prev]);
      setDescr("");
    } else {
      console.error("Errore aggiunta argomento");
    }
  };

  const del = async (id) => {
    if (!window.confirm("Eliminare questo argomento?")) return;
    await fetch(`${API_BASE_URL}/admin/argomenti/${id}`, {
      method: "DELETE",
      headers,
    });
    setArgomenti((prev) => prev.filter((a) => a.id !== id));
  };

  // disabilito il bottone se vuoto o duplicato
  const isDuplicate = argomenti.some(
    (a) => a.descrizione.toLowerCase() === descr.trim().toLowerCase()
  );

  return (
    <div className="container mt-4">
      <h2>Gestione Argomenti</h2>

      <div className="input-group mb-1">
        <input
          className="form-control"
          placeholder="Nuova descrizione"
          value={descr}
          onChange={(e) => setDescr(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={add}
          disabled={!descr.trim() || isDuplicate}
        >
          Aggiungi
        </button>
      </div>

      {isDuplicate && descr.trim() && (
        <div className="text-danger mb-3">
          Questo argomento è già presente.
        </div>
      )}

      <ul className="list-group">
        {argomenti.map((a) => (
          <li
            key={a.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {a.descrizione}
            <button
              className="btn btn-sm btn-danger"
              onClick={() => del(a.id)}
            >
              Elimina
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
