import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from '../config';


const Register = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ruolo, setRuolo] = useState("docente"); // Valore predefinito
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, password, ruolo }),
    });

    if (response.ok) {
      alert("Registrazione avvenuta con successo!");
      navigate("/"); // Redirect alla Home
    } else {
      alert("Errore nella registrazione. Riprova.");
    }
  };

  return (
    <div className="container text-center mt-5">
      <h1>📝 Registrazione</h1>
      <form className="mt-4" onSubmit={handleSubmit}>
        <input type="text" className="form-control mb-3" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <input type="email" className="form-control mb-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" className="form-control mb-3" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        
        {/* Selettore Ruolo */}
        <select className="form-control mb-3" value={ruolo} onChange={(e) => setRuolo(e.target.value)} required>
          <option value="docente">Docente</option>
          <option value="amministratore">Amministratore</option>
        </select>

        <button className="btn btn-outline-primary btn-lg" type="submit">Registrati</button>
      </form>
    </div>
  );
};

export default Register;