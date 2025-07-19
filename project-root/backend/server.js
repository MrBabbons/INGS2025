// backend/server.js

require("dotenv").config();
const express = require("express");
const mysql   = require("mysql2/promise");
const cors    = require("cors");
const morgan  = require("morgan");

async function startServer() {
  const db = mysql.createPool({
    host:               process.env.DB_HOST,
    user:               process.env.DB_USER,
    password:           process.env.DB_PASSWORD,
    database:           process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0,
  });
  console.log("✅ Database pool creato");

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  // Health-check
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));

  // Rotte pubbliche (auth)
  app.use("/api", require("./routes/auth")(db));

  // Middleware di protezione JWT
  const { verifyToken } = require("./middleware/auth");
  app.use("/api", verifyToken);

  // Rotte Amministratore
  app.use("/api/admin", require("./routes/admin")(db));

  // Rotte Docente
  app.use("/api/docente", require("./routes/docente")(db));

  // Rotte associazione argomenti ↔ insegnamenti
  app.use("/api", require("./routes/argomentiLink")(db));

  // Rotte report
  app.use("/api/report", require("./routes/report")(db));

  // Error handler globale
  app.use((err, req, res, next) => {
    console.error(err);
    res
      .status(err.status || 500)
      .json({ error: err.message || "Internal Server Error" });
  });

  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () =>
    console.log(`🚀 Server avviato su http://localhost:${PORT}`)
  );
}

startServer().catch((err) => {
  console.error("❌ Errore avvio server:", err);
  process.exit(1);
});
