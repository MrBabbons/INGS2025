const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

// middleware
const { verifyToken } = require("../middleware/auth");

module.exports = (db) => {
  const router = require("express").Router();
  // Registrazione
  router.post("/register", async (req, res) => {
    const { nome, email, password, ruolo } = req.body;
    const [exists] = await db.query("SELECT 1 FROM Utente WHERE email=?", [email]);
    if (exists.length) return res.status(400).json({ error: "Email già registrata" });

    const hash = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO Utente(nome,email,password_hash,ruolo)VALUES(?,?,?,?)",
      [nome, email, hash, ruolo]
    );
    res.status(201).json({ message: "Registrazione avvenuta con successo!" });
  });

  // Login
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const [rows] = await db.query("SELECT * FROM Utente WHERE email=?", [email]);
    if (!rows.length) return res.status(400).json({ error: "Email non trovata" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ error: "Password errata" });

    const token = jwt.sign({ id: user.id, ruolo: user.ruolo }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Accesso riuscito!", token });
  });

  router.get("/me", verifyToken, (req, res) => {
    res.json({
      id:    req.user.id,
      nome:  req.user.nome,
      email: req.user.email,
      ruolo: req.user.ruolo
    });
  });

  return router;
};
