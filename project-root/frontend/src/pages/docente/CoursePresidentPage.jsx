// src/pages/docente/CoursePresidentPage.jsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../../config";

export default function CoursePresidentPage() {
  const { corsoId } = useParams();
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const [insegnamenti, setInsegnamenti] = useState([]);
  const [periodi, setPeriodi]           = useState({});
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  const [finalTopics, setFinalTopics] = useState([]);
  const [minimizing, setMinimizing]   = useState(false);
  const [minError, setMinError]       = useState(null);

  // Helper per fetch JSON con controllo
  const fetchJson = async (url, opts) => {
    const res  = await fetch(url, opts);
    const ct   = res.headers.get("content-type") || "";
    const text = await res.text();
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
    if (!ct.includes("application/json")) {
      throw new Error("Risposta non JSON: " + text.substring(0, 300));
    }
    return JSON.parse(text);
  };

  // Carica insegnamenti + argomenti in un unico colpo
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchJson(
          `${API_BASE_URL}/docente/presidente/${corsoId}/insegnamenti`,
          { headers }
        );
        setInsegnamenti(data);

        // inizializza periodi per ogni insegnamento
        const init = {};
        data.forEach((ins) => {
          init[ins.id] = { year: ins.anno || 1, semester: ins.semestre || 1 };
        });
        setPeriodi(init);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [corsoId]);

  // Aggiorna anno/semestre in stato
  const handlePeriodChange = (insId, field, value) => {
    setPeriodi((prev) => ({
      ...prev,
      [insId]: { ...prev[insId], [field]: value },
    }));
  };

  // Minimizza i topic duplicati secondo il periodo più vicino
  const handleMinimize = () => {
    setMinError(null);
    setMinimizing(true);

    try {
      // Costruisci array piatto di tutti gli argomenti con periodIndex
      const allTopics = insegnamenti.flatMap((ins) => {
        const { year, semester } = periodi[ins.id];
        const idx = year * 2 + (semester - 1);
        return (ins.argomenti || []).map((arg) => ({
          nome: arg.descrizione,
          insegnamentoName: ins.nome,
          year,
          semester,
          periodIndex: idx,
        }));
      });

      // Deduplica tenendo l’entry con periodIndex minore
      const best = new Map();
      allTopics.forEach((t) => {
        const key = t.nome;
        if (!best.has(key) || t.periodIndex < best.get(key).periodIndex) {
          best.set(key, t);
        }
      });

      setFinalTopics(Array.from(best.values()));
    } catch (err) {
      setMinError(err.message);
    } finally {
      setMinimizing(false);
    }
  };

  // Raggruppa finalTopics per anno → semestre → insegnamento
  const groupedData = finalTopics.reduce((acc, t) => {
    if (!acc[t.year]) acc[t.year] = {};
    if (!acc[t.year][t.semester]) acc[t.year][t.semester] = {};
    if (!acc[t.year][t.semester][t.insegnamentoName]) {
      acc[t.year][t.semester][t.insegnamentoName] = [];
    }
    acc[t.year][t.semester][t.insegnamentoName].push(t.nome);
    return acc;
  }, {});

  if (loading) return <p>Caricamento…</p>;
  if (error)   return <p style={{ color: "red" }}>Errore: {error}</p>;

  return (
    <div className="container mt-5">
      <h2>Periodo e Argomenti – Corso {corsoId}</h2>

      {insegnamenti.map((ins) => (
        <div key={ins.id} className="card mb-4">
          <div className="card-body">
            <div className="d-flex align-items-center mb-2">
              <h5 className="me-auto">{ins.nome}</h5>

              <select
                className="form-select w-auto me-2"
                value={periodi[ins.id].year}
                onChange={(e) =>
                  handlePeriodChange(ins.id, "year", +e.target.value)
                }
              >
                {[1, 2, 3, 4, 5].map((y) => (
                  <option key={y} value={y}>
                    {y}° anno
                  </option>
                ))}
              </select>

              <select
                className="form-select w-auto"
                value={periodi[ins.id].semester}
                onChange={(e) =>
                  handlePeriodChange(ins.id, "semester", +e.target.value)
                }
              >
                {[1, 2].map((s) => (
                  <option key={s} value={s}>
                    {s}° semestre
                  </option>
                ))}
              </select>
            </div>

            <ul className="list-group">
              {(ins.argomenti || []).map((arg) => (
                <li key={arg.id} className="list-group-item py-1">
                  {arg.descrizione}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      <button
        className="btn btn-primary mb-4"
        onClick={handleMinimize}
        disabled={minimizing}
      >
        {minimizing ? "Elaborazione…" : "Minimizza Argomenti"}
      </button>
      {minError && <p style={{ color: "red" }}>Errore: {minError}</p>}

      {finalTopics.length > 0 && (
        <>
          <h3>Argomenti Definitivi</h3>

          {Object.entries(groupedData).map(([year, sems]) => (
            <div key={year} className="mb-5">
              <h4>{year}° Anno</h4>

              {Object.entries(sems).map(([semester, courses]) => (
                <div key={semester} className="mb-4">
                  <h5>{semester}° Semestre</h5>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Insegnamento</th>
                        <th>Argomenti Minimizzati</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(courses).map(([courseName, topics]) => (
                        <tr key={courseName}>
                          <td>{courseName}</td>
                          <td>{topics.join(", ")}</td>
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
