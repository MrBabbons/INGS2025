import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const token = localStorage.getItem("token");
  let ruolo = null;

  if (token) {
    try {
      ruolo = JSON.parse(atob(token.split(".")[1])).ruolo;
    } catch {
      ruolo = null;
    }
  }

  return (
    <div className="container text-center mt-5">
      {token && ruolo ? (
        <>
          <h1 className="fw-bold">Sei già loggato come {ruolo}</h1>
          <Link
            to={ruolo === "amministratore" ? "/admin" : "/docente"}
            className="btn btn-success btn-lg mt-4"
          >
            Vai al Dashboard
          </Link>
        </>
      ) : (
        <>
          <div className="bg-primary text-white p-5 rounded">
            <h1 className="fw-bold">
              Benvenuto nel Sistema di Armonizzazione Percorsi 📚
            </h1>
            <p className="lead">
              Gestisci insegnamenti, docenti e argomenti con semplicità.
            </p>
          </div>
          <div className="mt-4">
            <Link to="/login" className="btn btn-primary btn-lg mx-2">
              Accedi
            </Link>
            <Link to="/register" className="btn btn-outline-primary btn-lg mx-2">
              Registrati
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
