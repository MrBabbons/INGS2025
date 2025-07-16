require("dotenv").config({ path: "../.env" });
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

// Middleware JWT - verifica ruoli
const { verifyToken } = require("./middleware/auth");

const app = express();
app.use(express.json());
app.use(cors());

const dbConfig = {
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

async function startServer() {
  // Connessione al database
  const db = await mysql.createConnection(dbConfig);
  console.log("✅ Connessione al database riuscita!");

  // Rotte pubbliche (register, login)
  app.use("/api", require("./routes/auth")(db));

  // Tutte le rotte successive richiedono JWT
  app.use("/api", verifyToken);

  // Rotte Amministratore
  app.use("/api/admin", require("./routes/admin")(db));

  // Rotte Docente
  app.use("/api/docente", require("./routes/docente")(db));

  // Rotte per associazione argomenti - insegnamenti
  app.use("/api", require("./routes/argomentiLink")(db));

  // Rotte Report (sovrapposizioni & copertura)
  app.use("/api/report", require("./routes/report")(db));

  // Avvio server
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server avviato su http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("❌ Errore durante l'avvio del server:", err);
  process.exit(1);
});
