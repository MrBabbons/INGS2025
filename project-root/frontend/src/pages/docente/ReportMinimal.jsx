import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../../config";

function normalizeKey(str) {
  return str.trim().toLowerCase();
}

export default function ReportMinimal() {
  const { corsoId } = useParams();
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/docente/presidente/${corsoId}/insegnamenti`,
          { headers }
        );
        if (!res.ok) throw new Error("Errore caricamento insegnamenti");
        const raw = await res.json();

        // 1) Dedup degli argomenti interni a ogni insegnamento
        const cleaned = raw.map(ins => {
          const seen = new Set();
          const args = (ins.argomenti || []).filter(arg => {
            const key = normalizeKey(arg.descrizione);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
          return { ...ins, argomenti: args };
        });

        // 2) Ordina per anno/semestre e, se pari, obbligatori prima
        const sorted = cleaned.slice().sort((a, b) => {
          if (a.anno !== b.anno) return a.anno - b.anno;
          if (a.semestre !== b.semestre) return a.semestre - b.semestre;
          return (b.obbligatorio === true) - (a.obbligatorio === true);
        });

        // 3) Single-pass: minimizza e raggruppa
        const seenTopics = new Set();
        const temp = {};

        sorted.forEach(ins => {
          // se obbligatorio, prendi tutti gli argomenti
          const toShow = ins.obbligatorio
            ? ins.argomenti
            : ins.argomenti.filter(arg => 
                !seenTopics.has(normalizeKey(arg.descrizione))
              );

          // aggiorna il set globale
          ins.argomenti.forEach(arg =>
            seenTopics.add(normalizeKey(arg.descrizione))
          );

          // raggruppa per anno - semestre
          temp[ins.anno] = temp[ins.anno] || {};
          temp[ins.anno][ins.semestre] = temp[ins.anno][ins.semestre] || [];
          temp[ins.anno][ins.semestre].push({ ins, topics: toShow });
        });

        if (active) setGrouped(temp);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchData();
    return () => { active = false; };
  }, [corsoId]);

  if (loading) return <p>Caricamento…</p>;
  if (error)   return <p className="text-danger">Errore: {error}</p>;

  return (
    <div className="container mt-5">
      <h2>Argomenti Definitivi</h2>
      {Object.keys(grouped)
        .sort((a, b) => a - b)
        .map(anno =>
          Object.keys(grouped[anno])
            .sort((a, b) => a - b)
            .map(sem => (
              <div key={`${anno}-${sem}`} className="mb-5">
                <h3>{anno}° Anno – {sem}° Semestre</h3>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Insegnamento</th>
                      <th>Argomenti</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grouped[anno][sem].map(({ ins, topics }) => (
                      <tr key={ins.id}>
                        <td>
                          {ins.nome}{ins.obbligatorio && " (obbligatorio)"}
                        </td>
                        <td>
                          {topics.length > 0
                            ? topics.map(a => a.descrizione).join(", ")
                            : <span className="text-muted">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
        )}
    </div>
  );
}
