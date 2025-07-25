import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../../config";

export default function ReportMinimal() {
  const { corsoId } = useParams();
  const [data, setData]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(
      `${API_BASE_URL}/docente/presidente/${corsoId}/insegnamenti`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || res.status);
        setData(json);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [corsoId]);

  if (loading) return <p>Caricamento…</p>;
  if (error) return <p style={{ color: "red" }}>Errore: {error}</p>;

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
