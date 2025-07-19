import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const ruolo = localStorage.getItem("ruolo");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">ArmonizzaPercorsi</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {!token && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
              </>
            )}
            {token && ruolo === "amministratore" && (
              <li className="nav-item"><Link className="nav-link" to="/admin">Admin</Link></li>
            )}
            {token && ruolo === "docente" && (
              <li className="nav-item"><Link className="nav-link" to="/docente">Docente</Link></li>
            )}
            {token && (
              <li className="nav-item">
                <button className="btn btn-outline-secondary btn-sm" onClick={logout}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
