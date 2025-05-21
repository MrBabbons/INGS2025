import React from "react";

const Register = () => {
  return (
    <div className="container text-center mt-5">
      <h1>📝 Registrazione</h1>
      <form className="mt-4">
        <input type="text" className="form-control mb-3" placeholder="Nome" />
        <input type="email" className="form-control mb-3" placeholder="Email" />
        <input type="password" className="form-control mb-3" placeholder="Password" />
        <button className="btn btn-outline-primary btn-lg">Registrati</button>
      </form>
    </div>
  );
};

export default Register;