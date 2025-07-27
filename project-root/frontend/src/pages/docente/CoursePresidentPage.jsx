import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../../config";

function normalizeKey(str) {
  return str.trim().toLowerCase();
}

export default function CoursePresidentPage() {
  const { corsoId } = useParams();

  const [insegnamenti, setInsegnamenti] = useState([]);
  const [periodi, setPeriodi]           = useState({});
  const [skipList, setSkipList]         = useState(() => {
    const saved = localStorage.getItem("adminSkipList") || "[]";
    return JSON.parse(saved);
  });
  const [grouped, setGrouped]   = useState({});
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [minimizing, setMinimizing] = useState(false);

  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // 1) Carica insegnamenti e inizializza periodi
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE_URL}/docente/presidente/${corsoId}/insegnamenti`,
          { headers }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setInsegnamenti(data);

        const init = {};
        data.forEach(ins => {
          init[ins.id] = {
            year: ins.anno || 1,
            semester: ins.semestre || 1,
          };
        });
        setPeriodi(init);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [corsoId]);

  // 2) Aggiorna anno/semestre di un insegnamento
  const handlePeriodChange = (insId, field, value) => {
    setPeriodi(prev => ({
      ...prev,
      [insId]: { ...prev[insId], [field]: value },
    }));
  };

  // 3) Toggle “obbligatorio” (skipList)
  const toggleSkip = insId => {
    setSkipList(prev => {
      const next = prev.includes(insId)
        ? prev.filter(i => i !== insId)
        : [...prev, insId];
      localStorage.setItem("adminSkipList", JSON.stringify(next));
      return next;
    });
  };

  // 4) Minimizzazione + raggruppamento inline
  const handleMinimize = () => {
    setMinimizing(true);
    setError(null);

    try {
      // a) Dedup degli argomenti per insegnamento
      const cleaned = insegnamenti.map(ins => {
        const seen = new Set();
        const args = (ins.argomenti || []).filter(arg => {
          const k = normalizeKey(arg.descrizione);
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        });
        return { ...ins, argomenti: args };
      });

      // b) Aggiungi anno/semestre scelti
      const enriched = cleaned.map(ins => ({
        ...ins,
        year: periodi[ins.id].year,
        semester: periodi[ins.id].semester,
      }));

      // c) Ordina per anno, semestre e se pari obbligatorio prima
      enriched.sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        if (a.semester !== b.semester) return a.semester - b.semester;
        const aOb = skipList.includes(a.id);
        const bOb = skipList.includes(b.id);
        return (bOb === true) - (aOb === true);
      });

      // d) Single-pass: minimizza e raggruppa
      const seenTopics = new Set();
      const temp = {};

      enriched.forEach(ins => {
        const isMandatory = skipList.includes(ins.id);
        const toShow = isMandatory
          ? ins.argomenti
          : ins.argomenti.filter(arg =>
              !seenTopics.has(normalizeKey(arg.descrizione))
            );

        ins.argomenti.forEach(arg =>
          seenTopics.add(normalizeKey(arg.descrizione))
        );

        temp[ins.year] = temp[ins.year] || {};
        temp[ins.year][ins.semester] = temp[ins.year][ins.semester] || [];
        temp[ins.year][ins.semester].push({
          name: ins.nome,
          topics: toShow.map(a => ({
            descrizione: a.descrizione,
            skipped: isMandatory
          }))
        });
      });

      setGrouped(temp);
    } catch (err) {
      setError(err.message || "Errore durante la minimizzazione");
    } finally {
      setMinimizing(false);
    }
  };

  if (loading) return <p>Caricamento…</p>;
  if (error)   return <p className="text-danger">Errore: {error}</p>;

  return (
    <div className="container mt-5">
      <h2>Periodo e Argomenti – Corso {corsoId}</h2>

      {/* Sezione insegnamenti e controlli */}
      {insegnamenti.map(ins => {
        const isOb = skipList.includes(ins.id);
        return (
          <div key={ins.id} className="card mb-4">
            <div className="card-body d-flex align-items-center">
              <h5 className="me-auto">
                {ins.nome}{" "}
                {isOb && <span className="badge bg-warning">Obbligatorio</span>}
              </h5>

              <select
                className="form-select w-auto me-2"
                value={periodi[ins.id].year}
                onChange={e =>
                  handlePeriodChange(ins.id, "year", +e.target.value)
                }
              >
                {[1, 2, 3, 4, 5].map(y => (
                  <option key={y} value={y}>{y}° anno</option>
                ))}
              </select>

              <select
                className="form-select w-auto me-2"
                value={periodi[ins.id].semester}
                onChange={e =>
                  handlePeriodChange(ins.id, "semester", +e.target.value)
                }
              >
                {[1, 2].map(s => (
                  <option key={s} value={s}>{s}° sem.</option>
                ))}
              </select>

              <button
                className={
                  isOb
                    ? "btn btn-sm btn-outline-success"
                    : "btn btn-sm btn-outline-secondary"
                }
                onClick={() => toggleSkip(ins.id)}
              >
                {isOb ? "Non Obbligatorio" : "Obbligatorio"}
              </button>
            </div>

            <ul className="list-group">
              {(ins.argomenti || []).map(arg => (
                <li key={arg.id} className="list-group-item py-1">
                  {arg.descrizione}
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      <button
        className="btn btn-primary mb-4"
        onClick={handleMinimize}
        disabled={minimizing}
      >
        {minimizing ? "Elaborazione…" : "Minimizza Argomenti"}
      </button>

      {/* Tabella finale */}
      {Object.keys(grouped).length > 0 && (
        <>
          <h3>Argomenti Definitivi</h3>
          {Object.keys(grouped)
            .sort((a, b) => a - b)
            .map(year => (
              <div key={year} className="mb-4">
                <h4>{year}° Anno</h4>
                {Object.keys(grouped[year])
                  .sort((a, b) => a - b)
                  .map(sem => (
                    <div key={sem} className="mb-3">
                      <h5>{sem}° Semestre</h5>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Insegnamento</th>
                            <th>Argomenti</th>
                          </tr>
                        </thead>
                        <tbody>
                          {grouped[year][sem].map(row => (
                            <tr
                              key={row.name}
                              className={
                                row.topics.some(t => t.skipped)
                                  ? "table-warning"
                                  : ""
                              }
                            >
                              <td>{row.name}</td>
                              <td>
                                {row.topics
                                  .map(t => t.descrizione)
                                  .join(", ")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
              </div>
            ))}
        </>
      )}
    </div>
  );
}
