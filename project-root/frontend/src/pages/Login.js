import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.ruolo === "amministratore") navigate("/admin");
      else navigate("/docente");
    } else {
      alert("Credenziali errate. Riprova.");
    }
  };

  return (
    <div className="container text-center mt-5">
      <h1>🔐 Accedi</h1>
      <form className="mt-4" onSubmit={handleSubmit}>
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
        <button className="btn btn-primary btn-lg" type="submit">
          Accedi
        </button>
      </form>
    </div>
  );
};

export default Login;
