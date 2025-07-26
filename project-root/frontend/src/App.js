// src/App.js

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";

import CorsiPage from "./pages/admin/CorsiPage";
import CoursePresidentAdmin from "./pages/admin/CoursePresidentPage";
import InsegnamentiPage from "./pages/admin/InsegnamentiPage";
import ArgomentiPage from "./pages/admin/ArgomentiPage";
import InsegnamentoDocentiPage from "./pages/admin/InsegnamentoDocentiPage";

import InsegnamentoArgomenti from "./pages/InsegnamentoArgomenti";

import ReportSovrapposizioni from "./pages/ReportSovrapposizioni";
import ReportCopertura from "./pages/ReportCopertura";

// pagine docente
import DocenteDashboard from "./pages/DocenteDashboard";
import CoursePresidentPage from "./pages/docente/CoursePresidentPage";
import ReportMinimal from "./pages/docente/ReportMinimal";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Pubbliche */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRole="amministratore">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/corsi"
          element={
            <PrivateRoute requiredRole="amministratore">
              <CorsiPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/corsi/:corsoId/docenti-president"
          element={
            <PrivateRoute requiredRole="amministratore">
              <CoursePresidentAdmin />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/insegnamenti"
          element={
            <PrivateRoute requiredRole="amministratore">
              <InsegnamentiPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/argomenti"
          element={
            <PrivateRoute requiredRole="amministratore">
              <ArgomentiPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/insegnamenti/:id/docenti"
          element={
            <PrivateRoute requiredRole="amministratore">
              <InsegnamentoDocentiPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/docente/presidente/:corsoId/periodi-argomenti"
          element={
            <PrivateRoute requiredRole="docente">
              <CoursePresidentPage />
            </PrivateRoute>
          }
        />

        {/* Dashboard docente */}
        <Route
          path="/docente"
          element={
            <PrivateRoute requiredRole="docente">
              <DocenteDashboard />
            </PrivateRoute>
          }
        />

        {/* Presidente di corso */}
        <Route
          path="/docente/corsi/:corsoId/presidente"
          element={
            <PrivateRoute requiredRole="docente">
              <CoursePresidentPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/docente/corsi/:corsoId/presidente/minimizzato"
          element={
            <PrivateRoute requiredRole="docente">
              <ReportMinimal />
            </PrivateRoute>
          }
        />

        {/* Gestione argomenti per insegnamento */}
        <Route
          path="/docente/insegnamenti/:id/argomenti"
          element={
            <PrivateRoute requiredRole="docente">
              <InsegnamentoArgomenti />
            </PrivateRoute>
          }
        />

        {/* Report pubblici protetti */}
        <Route
          path="/report/minimal/:corsoId"
          element={
            <PrivateRoute>
              <ReportMinimal />
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
