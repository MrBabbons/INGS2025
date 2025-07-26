// src/pages/AdminDashboard.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ corsi: 0, insegnamenti: 0, argomenti: 0 });

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/admin/overview`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setCounts)
      .catch(console.error);
  }, []);

  return (
    <div className="container mt-5">
      <h1>Pannello Amministratore</h1>

      <div className="row mt-4">
        {[
          { label: "Corsi di Laurea", count: counts.corsi, link: "/admin/corsi" },
          { label: "Insegnamenti", count: counts.insegnamenti, link: "/admin/insegnamenti" },
          { label: "Argomenti", count: counts.argomenti, link: "/admin/argomenti" },
        ].map((c) => (
          <div key={c.label} className="col-md-4">
            <div className="card text-center mb-4">
              <div className="card-body">
                <h5>{c.label}</h5>
                <p className="display-4">{c.count}</p>
                <Link to={c.link} className="btn btn-primary btn-sm">
                  Gestisci
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
