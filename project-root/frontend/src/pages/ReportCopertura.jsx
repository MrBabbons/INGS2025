import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../config";

const ReportCopertura = () => {
  const { corsoId } = useParams();
  const [minReq, setMinReq] = useState(0);
  const [actual, setActual] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/report/copertura/${corsoId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        setMinReq(data.minimo);
        setActual(data.effettivo);
      });
  }, [corsoId]);

  return (
    <div className="container mt-5">
      <h2>✅ Copertura Argomenti – Corso {corsoId}</h2>
      <p>Minimo richiesto: {minReq}</p>
      <p>Argomenti totali caricati: {actual}</p>
      {actual < minReq ? (
        <div className="alert alert-warning">Copertura insufficiente!</div>
      ) : (
        <div className="alert alert-success">Copertura soddisfacente.</div>
      )}
    </div>
  );
};

export default ReportCopertura;
