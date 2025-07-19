import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const ruolo = localStorage.getItem("ruolo");

  if (!token) {
    return <Navigate to="/login" />;
  }
  if (requiredRole && ruolo !== requiredRole) {
    return <Navigate to="/" />;
  }
  return children;
}
