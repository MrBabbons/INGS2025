import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container text-center mt-5">
      {/* Hero Section */}
      <div className="bg-primary text-white p-5 rounded">
        <h1 className="fw-bold">Benvenuto nel Sistema di Armonizzazione Percorsi 📚</h1>
        <p className="lead">Gestisci insegnamenti, docenti e argomenti con semplicità.</p>
      </div>

      {/* Pulsanti di accesso e registrazione */}
      <div className="mt-4">
        <Link to="/login" className="btn btn-primary btn-lg mx-2">Accedi</Link>
        <Link to="/register" className="btn btn-outline-primary btn-lg mx-2">Registrati</Link>
      </div>

      {/* Sezioni informative */}
      <div className="mt-5">
        <h2>🔹 Come funziona?</h2>
        <p>La piattaforma permette di organizzare corsi, docenti e materiali didattici.</p>
      </div>
    </div>
  );
};

export default Home;