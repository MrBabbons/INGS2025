import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API_BASE_URL from "../config";

const PrivateRoute = ({ children, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setRole(data.ruolo);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Caricamento...</p>;
  if (!role) return <Navigate to="/login" />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" />;
  return children;
};

export default PrivateRoute;
