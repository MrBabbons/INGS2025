import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../config";

export default function ReportCopertura() {
  const { corsoId } = useParams();
  const [minReq, setMinReq] = useState(0);
  const [eff, setEff]       = useState(0);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch(`${API_BASE_URL}/report/copertura/${corsoId}`, { headers })
      .then(r => r.json())
      .then(d => {
        setMinReq(d.minimo);
        setEff(d.effettivo);
      });
  }, [corsoId]);

  return (
    <div className="container mt-5">
      <h2>Copertura – Corso {corsoId}</h2>
      <p>Minimo richiesto: {minReq}</p>
      <p>Effettivo: {eff}</p>
      {eff < minReq ? (
        <div className="alert alert-warning">Insufficiente</div>
      ) : (
        <div className="alert alert-success">OK</div>
      )}
    </div>
);
}
