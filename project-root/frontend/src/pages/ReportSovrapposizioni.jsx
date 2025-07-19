import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../config";

export default function ReportSovrapposizioni() {
  const { corsoId } = useParams();
  const [data, setData] = useState([]);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch(`${API_BASE_URL}/report/sovrapposizioni/${corsoId}`, { headers })
      .then(r => r.json())
      .then(setData);
  }, [corsoId]);

  return (
    <div className="container mt-5">
      <h2>Sovrapposizioni – Corso {corsoId}</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Ins A</th>
            <th>Ins B</th>
            <th>Condivisi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r,i) => (
            <tr key={i}>
              <td>{r.ins1}</td>
              <td>{r.ins2}</td>
              <td>{r.shared}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
);
}
