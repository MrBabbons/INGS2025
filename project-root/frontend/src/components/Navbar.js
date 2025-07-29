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
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{ backgroundColor: "#337AB7" }}
    >
      <div className="container">
        <Link className="navbar-brand text-white" to="/">ArmonizzaPercorsi</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {!token && (
              <>
                <li className="nav-item"><Link className="nav-link text-white" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="nav-link text-white" to="/register">Register</Link></li>
              </>
            )}
            {token && ruolo === "amministratore" && (
              <li className="nav-item"><Link className="nav-link text-white" to="/admin">Admin</Link></li>
            )}
            {token && ruolo === "docente" && (
              <li className="nav-item"><Link className="nav-link text-white" to="/docente">Docente</Link></li>
            )}
            {token && (
              <li className="nav-item">
                <button className="btn btn-outline-light btn-sm" onClick={logout}>
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
