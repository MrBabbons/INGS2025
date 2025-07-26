// src/pages/docente/CoursePresidentPage.jsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../../config";

export default function CoursePresidentPage() {
  const { corsoId } = useParams();

  const [insegnamenti, setInsegnamenti] = useState([]);
  const [periodi, setPeriodi]           = useState({});
  const [skipList, setSkipList]         = useState(() => {
    const saved = localStorage.getItem("adminSkipList") || "[]";
    return JSON.parse(saved);
  });
  const [finalTopics, setFinalTopics] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [minimizing, setMinimizing]   = useState(false);

  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // 1) Carica insegnamenti + argomenti
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
            year: ins.anno    || 1,
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

  // 2) Cambio periodi per ciascun insegnamento
  const handlePeriodChange = (insId, field, value) => {
    setPeriodi(prev => ({
      ...prev,
      [insId]: { ...prev[insId], [field]: value },
    }));
  };

  // 3) Toggle skip (da localStorage)
  const toggleSkip = insId => {
    setSkipList(prev => {
      const next = prev.includes(insId)
        ? prev.filter(i => i !== insId)
        : [...prev, insId];
      localStorage.setItem("adminSkipList", JSON.stringify(next));
      return next;
    });
  };

  // 4) Minimizzazione + raccolta automatica dei skip
  const handleMinimize = () => {
    setMinimizing(true);

    try {
      // 4a) argomenti dagli insegnamenti skippati, conservando year/semester
      const skipTopics = insegnamenti.flatMap(ins => {
        if (!skipList.includes(ins.id)) return [];
        const { year, semester } = periodi[ins.id];
        return (ins.argomenti || []).map(arg => ({
          nome: arg.descrizione,
          insegnamentoName: ins.nome,
          year,
          semester,
          skipped: true,
        }));
      });

      // 4b) candidati alla minimizzazione
      const candidates = insegnamenti.flatMap(ins => {
        if (skipList.includes(ins.id)) return [];
        const { year, semester } = periodi[ins.id];
        const periodIndex = year * 2 + (semester - 1);
        return (ins.argomenti || []).map(arg => ({
          nome: arg.descrizione,
          insegnamentoName: ins.nome,
          year,
          semester,
          periodIndex,
        }));
      });

      // 4c) deduplica tenendo il periodIndex minore
      const best = new Map();
      candidates.forEach(t => {
        const key = t.nome;
        if (!best.has(key) || t.periodIndex < best.get(key).periodIndex) {
          best.set(key, t);
        }
      });
      const minimizedTopics = Array.from(best.values());

      // 4d) unisco skipTopics + minimizedTopics
      setFinalTopics([...skipTopics, ...minimizedTopics]);
    } catch {
      setError("Errore durante la minimizzazione");
    } finally {
      setMinimizing(false);
    }
  };

  // 5) Raggruppa per anno → semestre → insegnamento
  const grouped = finalTopics.reduce((acc, t) => {
    const { year, semester, insegnamentoName, nome, skipped } = t;
    if (!acc[year]) acc[year] = {};
    if (!acc[year][semester]) acc[year][semester] = {};
    if (!acc[year][semester][insegnamentoName]) {
      acc[year][semester][insegnamentoName] = [];
    }
    acc[year][semester][insegnamentoName].push({ nome, skipped });
    return acc;
  }, {});

  if (loading) return <p>Caricamento…</p>;
  if (error)   return <p className="text-danger">Errore: {error}</p>;

  return (
    <div className="container mt-5">
      <h2>Periodo e Argomenti – Corso {corsoId}</h2>

      {/* Sezione insegnamenti (unchanged) */}
      {insegnamenti.map(ins => {
        const isSkipped = skipList.includes(ins.id);
        return (
          <div key={ins.id} className="card mb-4">
            <div className="card-body d-flex align-items-center">
              <h5 className="me-auto">
                {ins.nome}{" "}
                {isSkipped && (
                  <span className="badge bg-warning">Obbligatorio</span>
                )}
              </h5>
              <select
                className="form-select w-auto me-2"
                value={periodi[ins.id].year}
                onChange={e =>
                  handlePeriodChange(ins.id, "year", +e.target.value)
                }
              >
                {[1,2,3,4,5].map(y => (
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
                {[1,2].map(s => (
                  <option key={s} value={s}>{s}° sem.</option>
                ))}
              </select>
              <button
                className={
                  isSkipped
                    ? "btn btn-sm btn-outline-success"
                    : "btn btn-sm btn-outline-secondary"
                }
                onClick={() => toggleSkip(ins.id)}
              >
                {isSkipped ? "Non Obbligatorio" : "Obbligatorio"}
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

      {/* Nuova tabella "piano di studi" */}
      {finalTopics.length > 0 && (
        <>
          <h3>Argomenti Definitivi</h3>
          <div className="table-responsive">
            {Object.keys(grouped)
              .sort((a,b) => a - b)
              .map(year => (
                <div key={year} className="mb-5">
                  <h4>{year}° Anno</h4>
                  {Object.keys(grouped[year])
                    .sort((a,b) => a - b)
                    .map(semester => (
                      <div key={semester} className="mb-4">
                        <h5>{semester}° Semestre</h5>
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Insegnamento</th>
                              <th>Argomenti</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(
                              grouped[year][semester]
                            ).map(([insName, topics]) => (
                              <tr
                                key={insName}
                                className={
                                  topics.some(t => t.skipped)
                                    ? "table-warning"
                                    : ""
                                }
                              >
                                <td>{insName}</td>
                                <td>
                                  {topics
                                    .map(t => t.nome)
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
          </div>
        </>
      )}
    </div>
  );
}
