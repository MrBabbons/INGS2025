import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let ruolo = null;

  if (token) {
    try {
      ruolo = JSON.parse(atob(token.split(".")[1])).ruolo;
    } catch {
      ruolo = null;
    }
  }

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          📖 Armonizzazione Percorsi
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!token && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Registrati
                  </Link>
                </li>
              </>
            )}

            {token && ruolo === "amministratore" && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  Dashboard Admin
                </Link>
              </li>
            )}

            {token && ruolo === "docente" && (
              <li className="nav-item">
                <Link className="nav-link" to="/docente">
                  Dashboard Docente
                </Link>
              </li>
            )}

            {token && (
              <li className="nav-item">
                <button
                  onClick={logout}
                  className="btn btn-outline-light nav-link"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
