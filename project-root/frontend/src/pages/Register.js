import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

export default function Register() {
  const [nome, setNome]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [ruolo, setRuolo]     = useState("docente");
  const [error, setError]     = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, password, ruolo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert(data.message);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit}>
        <div className="mb-3">
          <label>Nome</label>
          <input 
            className="form-control" 
            value={nome}
            onChange={e => setNome(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input 
            type="email"
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input 
            type="password"
            className="form-control"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>Ruolo</label>
          <select 
            className="form-select" 
            value={ruolo}
            onChange={e => setRuolo(e.target.value)}
          >
            <option value="docente">Docente</option>
            <option value="amministratore">Amministratore</option>
          </select>
        </div>
        <button className="btn btn-primary">Registrati</button>
      </form>
    </div>
  );
}
