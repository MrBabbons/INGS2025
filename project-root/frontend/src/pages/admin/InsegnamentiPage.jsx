// src/pages/admin/InsegnamentiPage.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../../config";

export default function InsegnamentiPage() {
  const [insegnamenti, setInsegnamenti]     = useState([]);
  const [corsi, setCorsi]                   = useState([]);
  const [form, setForm]                     = useState({ nome: "", corso_id: "" });
  const [duplicateError, setDuplicateError] = useState("");

  const token   = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // 1) Carica insegnamenti e corsi
  const loadData = async () => {
    try {
      const [ins, cors] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/insegnamenti`, { headers }).then(r => r.json()),
        fetch(`${API_BASE_URL}/admin/corsi`, { headers }).then(r => r.json()),
      ]);
      setInsegnamenti(ins);
      setCorsi(cors);
      setForm(f => ({
        ...f,
        corso_id: cors[0]?.id || ""
      }));
    } catch (err) {
      console.error("Errore nel caricamento dati:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 2) Controllo duplicati in tempo reale
  useEffect(() => {
    const nomeTrim = form.nome.trim().toLowerCase();
    const corsoId  = String(form.corso_id);

    if (!nomeTrim || !corsoId) {
      setDuplicateError("");
      return;
    }

    // controllo solo dentro lo stesso corso
    const exists = insegnamenti.some(i =>
      i.nome.trim().toLowerCase() === nomeTrim &&
      String(i.corso_id) === corsoId
    );

    setDuplicateError(
      exists
        ? "Esiste già un insegnamento con questo nome per il corso selezionato."
        : ""
    );
  }, [form.nome, form.corso_id, insegnamenti]);

  // 3) Aggiungi insegnamento
  const addInsegn = async () => {
    if (!form.nome.trim() || !form.corso_id || duplicateError) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/insegnamenti`, {
        method: "POST",
        headers,
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm(f => ({ ...f, nome: "" }));
        await loadData();
      } else {
        console.error("Errore creazione insegnamento:", res.statusText);
      }
    } catch (err) {
      console.error("Errore di rete nel POST:", err);
    }
  };

  // 4) Elimina insegnamento
  const deleteInsegn = async id => {
    if (!window.confirm("Eliminare questo insegnamento?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/insegnamenti/${id}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        setInsegnamenti(prev => prev.filter(i => i.id !== id));
      } else {
        console.error("Errore eliminazione:", res.statusText);
      }
    } catch (err) {
      console.error("Errore di rete nel DELETE:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Gestione Insegnamenti</h2>

      <div className="row g-2 align-items-end mb-3">
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Nome insegnamento"
            value={form.nome}
            onChange={e => setForm({ ...form, nome: e.target.value })}
          />
          {duplicateError && (
            <div className="text-danger small mt-1">{duplicateError}</div>
          )}
        </div>

        <div className="col">
          <select
            className="form-select"
            value={form.corso_id}
            onChange={e => setForm({ ...form, corso_id: e.target.value })}
          >
            {corsi.map(c => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="col-auto">
          <button
            className="btn btn-primary"
            onClick={addInsegn}
            disabled={!form.nome.trim() || !form.corso_id || !!duplicateError}
          >
            Aggiungi
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Corso</th>
              <th>Docenti</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {insegnamenti.map(i => (
              <tr key={i.id}>
                <td>{i.nome}</td>
                <td>{i.corso}</td>
                <td>
                  <Link
                    to={`/admin/insegnamenti/${i.id}/docenti`}
                    className="btn btn-sm btn-outline-primary"
                  >
                    Assegna Docenti
                  </Link>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteInsegn(i.id)}
                  >
                    Elimina
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
