// src/pages/DocenteDashboard.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";

export default function DocenteDashboard() {
  const [insList, setInsList] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_BASE_URL}/docente/insegnamenti`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setInsList);
  }, []);

  return (
    <div className="container mt-5">
      <h1>👨‍🏫 Pannello Docente</h1>
      <ul className="list-group">
        {insList.map((i) => (
          <li
            key={i.id}
            className="list-group-item d-flex justify-content-between"
          >
            {i.nome} ({i.corsoNome})
            <Link
              to={`/insegnamenti/${i.id}/argomenti`}
              className="btn btn-sm btn-outline-primary"
            >
              Gestisci Argomenti
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
