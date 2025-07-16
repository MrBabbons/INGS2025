import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ corsi: 0, insegnamenti: 0, argomenti: 0 });
  const [corsi, setCorsi] = useState([]);
  const [insegnamenti, setInsegnamenti] = useState([]);
  const [argomenti, setArgomenti] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    Promise.all([
      fetch(`${API_BASE_URL}/admin/overview`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_BASE_URL}/admin/corsi`,     { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_BASE_URL}/admin/insegnamenti`,{ headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API_BASE_URL}/admin/argomenti`,  { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([ov, c, i, a]) => {
      setCounts(ov);
      setCorsi(c);
      setInsegnamenti(i.slice(0,5));
      setArgomenti(a.slice(0,5));
    });
  }, []);

  return (
    <div className="container mt-5">
      <h1>👤 Pannello Amministratore</h1>

      <div className="row mt-4">
        {[
          { label: "Corsi di Laurea", count: counts.corsi, link: "/admin/corsi" },
          { label: "Insegnamenti",    count: counts.insegnamenti, link: "/admin/insegnamenti" },
          { label: "Argomenti",       count: counts.argomenti, link: "/admin/argomenti" },
        ].map(card => (
          <div key={card.label} className="col-md-4">
            <div className="card text-center mb-4">
              <div className="card-body">
                <h5>{card.label}</h5>
                <p className="display-4">{card.count}</p>
                <Link to={card.link} className="btn btn-primary btn-sm">
                  Gestisci
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-md-4">
          <h5>Ultimi Corsi</h5>
          <ul className="list-group">
            {corsi.slice(0,5).map(c => (
              <li key={c.id} className="list-group-item d-flex justify-content-between">
                {c.nome}
                <Link to={`/admin/corsi/${c.id}`} className="btn btn-outline-primary btn-sm">Dettagli</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-4">
          <h5>Ultimi Insegnamenti</h5>
          <ul className="list-group">
            {insegnamenti.map(i => (
              <li key={i.id} className="list-group-item">
                {i.nome}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-4">
          <h5>Ultimi Argomenti</h5>
          <ul className="list-group">
            {argomenti.map(a => (
              <li key={a.id} className="list-group-item">
                {a.descrizione}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
