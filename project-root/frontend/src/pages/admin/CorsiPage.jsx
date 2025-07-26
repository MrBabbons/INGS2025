import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../../config";

export default function CorsiPage() {
  const [corsi, setCorsi] = useState([]);
  const [nome, setNome] = useState("");
  const [dupError, setDupError] = useState("");

  const token   = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // 1) Carica corsi
  useEffect(() => {
    fetch(`${API_BASE_URL}/admin/corsi`, { headers })
      .then(r => r.json())
      .then(setCorsi)
      .catch(err => console.error("Errore fetch corsi:", err));
  }, []);

  // 2) Controllo duplicati in tempo reale
  useEffect(() => {
    const nomeTrim = nome.trim().toLowerCase();
    if (!nomeTrim) {
      setDupError("");
      return;
    }

    const exists = corsi.some(c => c.nome.trim().toLowerCase() === nomeTrim);
    setDupError(
      exists ? "Esiste già un corso con questo nome." : ""
    );
  }, [nome, corsi]);

  // 3) Aggiungi corso
  const addCorso = async () => {
    const nomeTrim = nome.trim();
    if (!nomeTrim || dupError) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/corsi`, {
        method: "POST",
        headers,
        body: JSON.stringify({ nome: nomeTrim }),
      });
      if (res.ok) {
        const newC = await res.json();
        setCorsi(prev => [newC, ...prev]);
        setNome("");
      } else {
        console.error("Errore creazione corso:", res.statusText);
      }
    } catch (err) {
      console.error("Errore di rete nel POST:", err);
    }
  };

  // 4) Elimina corso
  const deleteCorso = async (id) => {
    if (!window.confirm("Eliminare questo corso?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/corsi/${id}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        setCorsi(prev => prev.filter(c => c.id !== id));
      } else {
        console.error("Errore eliminazione corso:", res.statusText);
      }
    } catch (err) {
      console.error("Errore di rete nel DELETE:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Gestione Corsi di Laurea</h2>

      <div className="mb-3">
        <div className="input-group">
          <input
            className="form-control"
            placeholder="Nuovo corso"
            value={nome}
            onChange={e => setNome(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={addCorso}
            disabled={!nome.trim() || !!dupError}
          >
            Aggiungi
          </button>
        </div>
        {dupError && (
          <div className="text-danger small mt-1">{dupError}</div>
        )}
      </div>

      <ul className="list-group">
        {corsi.map(c => (
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
