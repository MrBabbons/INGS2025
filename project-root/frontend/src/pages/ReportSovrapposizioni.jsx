import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../config";

const ReportSovrapposizioni = () => {
  const { corsoId } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/report/sovrapposizioni/${corsoId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setData);
  }, [corsoId]);

  return (
    <div className="container mt-5">
      <h2>📊 Sovrapposizioni – Corso {corsoId}</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Insegnamento A</th>
            <th>Insegnamento B</th>
            <th># Argomenti Comuni</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r,i) => (
            <tr key={i}>
              <td>{r.nomeA}</td>
              <td>{r.nomeB}</td>
              <td>{r.commonCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportSovrapposizioni;
