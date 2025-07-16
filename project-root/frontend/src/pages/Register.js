
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

const Register = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ruolo, setRuolo] = useState("docente");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, password, ruolo }),
    });

    const payload = await response.json().catch(() => ({}));

    if (response.ok) {
      // Se il server restituisce un messaggio custom
      alert(payload.message || "Registrazione avvenuta con successo!");
      navigate("/login");
    } else {
      // Console dettaglio dell’errore
      console.error("Register error:", payload);
      // errore restituito dal server
      alert(
        payload.error ||
        JSON.stringify(payload) ||
        "Errore nella registrazione. Riprova."
      );
    }
  };

  return (
    <div className="container text-center mt-5">
      <h1>📝 Registrazione</h1>
      <form className="mt-4" onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          className="form-control mb-3"
          value={ruolo}
          onChange={(e) => setRuolo(e.target.value)}
          required
        >
          <option value="docente">Docente</option>
          <option value="amministratore">Amministratore</option>
        </select>
        <button className="btn btn-outline-primary btn-lg" type="submit">
          Registrati
        </button>
      </form>
    </div>
  );
};

export default Register;
