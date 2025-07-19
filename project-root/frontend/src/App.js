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
import CoursePresidentPage from "./pages/admin/CoursePresidentPage";
import InsegnamentiPage from "./pages/admin/InsegnamentiPage";
import ArgomentiPage from "./pages/admin/ArgomentiPage";
import InsegnamentoDocentiPage from "./pages/admin/InsegnamentoDocentiPage";

import DocenteDashboard from "./pages/DocenteDashboard";
import InsegnamentoArgomenti from "./pages/InsegnamentoArgomenti";

import ReportSovrapposizioni from "./pages/ReportSovrapposizioni";
import ReportCopertura from "./pages/ReportCopertura";
import ReportMinimal from "./pages/ReportMinimal";

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
              <CoursePresidentPage />
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

        {/* Docente */}
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

        {/* Report */}
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
