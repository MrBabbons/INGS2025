require("dotenv").config({ path: "../.env" });
const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

async function connectDB() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("✅ Connessione al database riuscita!");
    return connection;
  } catch (err) {
    console.error("❌ Errore di connessione al database:", err);
    process.exit(1);
  }
}

async function startServer() {
  const db = await connectDB();

  // Registrazione Utente
  app.post("/register", async (req, res) => {
    const { nome, email, password, ruolo } = req.body;

    try {
      const [results] = await db.query("SELECT * FROM Utente WHERE email = ?", [email]);
      if (results.length > 0) return res.status(400).json({ error: "L'email è già registrata." });

      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query(
        "INSERT INTO Utente (nome, email, password_hash, ruolo) VALUES (?, ?, ?, ?)",
        [nome, email, hashedPassword, ruolo]
      );

      res.status(201).json({ message: "Registrazione avvenuta con successo!" });
    } catch (err) {
      console.error("Errore nella registrazione:", err);
      res.status(500).json({ error: "Errore durante la registrazione." });
    }
  });

  // Login Utente
  app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
      const [results] = await db.query("SELECT * FROM Utente WHERE email = ?", [email]);

      if (!results || results.length === 0) return res.status(400).json({ error: "Email non trovata." });

      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) return res.status(400).json({ error: "Password errata." });

      const token = jwt.sign({ id: user.id, ruolo: user.ruolo }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.json({ message: "Accesso riuscito!", token });
    } catch (err) {
      console.error("Errore nel login:", err);
      res.status(500).json({ error: "Errore durante il login." });
    }
  });

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server avviato su http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("❌ Errore durante l'avvio del server:", err);
});