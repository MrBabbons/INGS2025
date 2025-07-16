import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import DocenteDashboard from "./pages/DocenteDashboard";
import InsegnamentoArgomenti from "./pages/InsegnamentoArgomenti";
import ReportSovrapposizioni from "./pages/ReportSovrapposizioni";
import ReportCopertura from "./pages/ReportCopertura";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRole="amministratore">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/docente"
          element={
            <PrivateRoute requiredRole="docente">
              <DocenteDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/insegnamenti/:id/argomenti"
          element={
            <PrivateRoute requiredRole="docente">
              <InsegnamentoArgomenti />
            </PrivateRoute>
          }
        />

        <Route
          path="/report/sovrapposizioni/:corsoId"
          element={
            <PrivateRoute>
              <ReportSovrapposizioni />
            </PrivateRoute>
          }
        />

        <Route
          path="/report/copertura/:corsoId"
          element={
            <PrivateRoute>
              <ReportCopertura />
            </PrivateRoute>
          }
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
