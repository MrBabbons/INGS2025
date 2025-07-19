// backend/routes/auth.js

const express = require("express");
const bcrypt  = require("bcrypt");
const jwt     = require("jsonwebtoken");

module.exports = (db) => {
  const router = express.Router();

  // POST /api/register
  router.post("/register", async (req, res, next) => {
    try {
      const { nome, email, password, ruolo } = req.body;
      const [exists] = await db.query(
        "SELECT 1 FROM Utente WHERE email=?", [email]
      );
      if (exists.length) {
        return res.status(400).json({ error: "Email già registrata" });
      }
      const hash = await bcrypt.hash(password, 10);
      await db.query(
        "INSERT INTO Utente(nome,email,password_hash,ruolo) VALUES(?,?,?,?)",
        [nome, email, hash, ruolo]
      );
      res.status(201).json({ message: "Registrazione avvenuta con successo!" });
    } catch (err) {
      next(err);
    }
  });

  // POST /api/login
  router.post("/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const [rows] = await db.query(
        "SELECT * FROM Utente WHERE email=?", [email]
      );
      if (!rows.length) {
        return res.status(400).json({ error: "Email non trovata" });
      }
      const user = rows[0];
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.status(400).json({ error: "Password errata" });
      }
      const token = jwt.sign(
        { id: user.id, nome: user.nome, email: user.email, ruolo: user.ruolo },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ message: "Accesso riuscito!", token });
    } catch (err) {
      next(err);
    }
  });

  // GET /api/me
  const { verifyToken } = require("../middleware/auth");
  router.get("/me", verifyToken, (req, res) => {
    res.json(req.user);
  });

  return router;
};
