import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../config";

export default function ReportMinimal() {
  const { corsoId } = useParams();
  const [data, setData] = useState([]);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch(`${API_BASE_URL}/report/minimal/${corsoId}`, { headers })
      .then(r => r.json())
      .then(setData);
  }, [corsoId]);

  const grouped = data.reduce((acc, row) => {
    if (!acc[row.insegnamento]) acc[row.insegnamento] = [];
    acc[row.insegnamento].push(row.descrizione);
    return acc;
  }, {});

  return (
    <div className="container mt-5">
      <h2>Lista Minima – Corso {corsoId}</h2>
      {Object.entries(grouped).map(([ins,args]) => (
        <div key={ins} className="mb-4">
          <h5>{ins}</h5>
          <ul className="list-group">
            {args.map((d,i) => (
              <li key={i} className="list-group-item">{d}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
);
}
