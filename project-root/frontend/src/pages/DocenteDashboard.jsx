import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";

const DocenteDashboard = () => {
  const [insegnamenti, setInsegnamenti] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/docente/insegnamenti`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setInsegnamenti);
  }, []);

  return (
    <div className="container mt-5">
      <h1>👨‍🏫 Pannello Docente</h1>
      <p>Insegnamenti di cui sei referente:</p>
      <ul className="list-group">
        {insegnamenti.map(i => (
          <li key={i.id} className="list-group-item d-flex justify-content-between align-items-center">
            {i.nome}
            <div>
              <Link to={`/insegnamenti/${i.id}/argomenti`} className="btn btn-sm btn-outline-primary mx-1">
                Gestisci Argomenti
              </Link>
              <Link to={`/report/sovrapposizioni/${i.corso_id}`} className="btn btn-sm btn-outline-secondary mx-1">
                Report Sovrapp.
              </Link>
              <Link to={`/report/copertura/${i.corso_id}`} className="btn btn-sm btn-outline-secondary mx-1">
                Report Copertura
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocenteDashboard;
