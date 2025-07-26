import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";

export default function DocenteDashboard() {
  const [insList, setInsList] = useState([]);
  const [presCourses, setPresCourses] = useState([]);
  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    // I miei insegnamenti
    fetch(`${API_BASE_URL}/docente/insegnamenti`, { headers })
      .then((r) => r.json())
      .then(setInsList)
      .catch(console.error);

    // Corsi dove sono presidente
    fetch(`${API_BASE_URL}/docente/presidente/corsi`, { headers })
      .then((r) => r.json())
      .then(setPresCourses)
      .catch(console.error);
  }, []);

  return (
    <div className="container mt-5">
      <h1>Pannello Docente</h1>

      {presCourses.length > 0 && (
        <div className="mt-4">
          <h2>Presidente di Corso</h2>
          <ul className="list-group mb-4">
            {presCourses.map((c) => (
              <li
                key={c.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {c.nome}
                <Link
                  to={`/docente/corsi/${c.id}/presidente`}
                  className="btn btn-sm btn-outline-primary"
                >
                  Gestisci Corso
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2>I tuoi insegnamenti</h2>
      <ul className="list-group">
        {insList.map((i) => (
          <li
            key={i.id}
            className="list-group-item d-flex justify-content-between"
          >
            {i.nome} ({i.corsoNome})
            <Link
              to={`/docente/insegnamenti/${i.id}/argomenti`}
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
