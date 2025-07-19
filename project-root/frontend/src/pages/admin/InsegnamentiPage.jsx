// src/pages/admin/InsegnamentiPage.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../../config";

export default function InsegnamentiPage() {
  const [insegnamenti, setInsegnamenti] = useState([]);
  const [corsi, setCorsi]               = useState([]);
  const [form, setForm]                 = useState({ nome: "", corso_id: "" });
  const token  = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/admin/insegnamenti`, { headers }).then((r) => r.json()),
      fetch(`${API_BASE_URL}/admin/corsi`, { headers }).then((r) => r.json()),
    ]).then(([ins, cors]) => {
      setInsegnamenti(ins);
      setCorsi(cors);
      setForm((f) => ({ ...f, corso_id: cors[0]?.id || "" }));
    });
  }, []);

  const addInsegn = async () => {
    if (!form.nome || !form.corso_id) return;
    const res = await fetch(`${API_BASE_URL}/admin/insegnamenti`, {
      method: "POST",
      headers,
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const newI = await res.json();
      newI.corso = cors.find((c) => c.id === newI.corso_id)?.nome;
      setInsegnamenti((p) => [newI, ...p]);
      setForm((f) => ({ ...f, nome: "" }));
    }
  };

  const deleteInsegn = async (id) => {
    if (!window.confirm("Eliminare questo insegnamento?")) return;
    await fetch(`${API_BASE_URL}/admin/insegnamenti/${id}`, {
      method: "DELETE",
      headers,
    });
    setInsegnamenti((p) => p.filter((i) => i.id !== id));
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
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
        </div>
        <div className="col">
          <select
            className="form-select"
            value={form.corso_id}
            onChange={(e) => setForm({ ...form, corso_id: e.target.value })}
          >
            {corsi.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="col-auto">
          <button className="btn btn-primary" onClick={addInsegn}>
            Aggiungi
          </button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Corso</th>
            <th>Argomenti Obbl.</th>
            <th>Docenti</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {insegnamenti.map((i) => (
            <tr key={i.id}>
              <td>{i.nome}</td>
              <td>{i.corso}</td>
              <td>
                <Link
                  to={`/admin/insegnamenti/${i.id}/argomenti-obbligatori`}
                  className="btn btn-sm btn-outline-secondary mx-1"
                >
                  Obbligatori
                </Link>
              </td>
              <td>
                <Link
                  to={`/admin/insegnamenti/${i.id}/docenti`}
                  className="btn btn-sm btn-outline-primary mx-1"
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
  );
}
