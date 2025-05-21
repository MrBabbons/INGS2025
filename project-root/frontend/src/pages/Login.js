import React from "react";

const Login = () => {
  return (
    <div className="container text-center mt-5">
      <h1>🔐 Accedi</h1>
      <form className="mt-4">
        <input type="email" className="form-control mb-3" placeholder="Email" />
        <input type="password" className="form-control mb-3" placeholder="Password" />
        <button className="btn btn-primary btn-lg">Accedi</button>
      </form>
    </div>
  );
};

export default Login;