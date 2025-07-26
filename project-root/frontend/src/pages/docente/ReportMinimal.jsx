// src/pages/admin/ReportMinimal.jsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../../config";

export default function ReportMinimal() {
  const { corsoId } = useParams();
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const token   = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1) prendo tutti gli insegnamenti + argomenti
        // 2) prendo gli argomenti obbligatori per il corso
        const [resIns, resObb] = await Promise.all([
          fetch(
            `${API_BASE_URL}/docente/presidente/${corsoId}/insegnamenti`,
            { headers }
          ),
          fetch(
            `${API_BASE_URL}/admin/corsi/${corsoId}/argomenti-obbligatori`,
            { headers }
          ),
        ]);

        if (!resIns.ok) throw new Error("Errore caricamento insegnamenti");
        if (!resObb.ok) throw new Error("Errore caricamento obbligatori");

        const insegn      = await resIns.json();
        const obbligatori = await resObb.json();

        // costruisco un Set di id argomenti obbligatori
        const obblSet = new Set(obbligatori.map((a) => a.id));

        // filtro via i soli argomenti NON obbligatori
        const filtered = insegn.map((ins) => ({
          ...ins,
          argomenti: (ins.argomenti || []).filter(
            (a) => !obblSet.has(a.id)
          ),
        }));

        setData(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [corsoId]);

  if (loading) return <p>Caricamento…</p>;
  if (error)   return <p style={{ color: "red" }}>Errore: {error}</p>;

  return (
    <div className="container mt-5">
      <h2>Report minimizzato corso {corsoId}</h2>
      {data.map((ins) => (
        <div key={ins.id} className="mb-3">
          <strong>{ins.nome}</strong>
          {ins.argomenti.length > 0 ? (
            ins.argomenti.map((a) => (
              <span key={a.id} className="badge bg-secondary ms-2">
                {a.descrizione}
              </span>
            ))
          ) : (
            <span className="text-muted ms-2">Nessun argomento</span>
          )}
        </div>
      ))}
    </div>
  );
}
