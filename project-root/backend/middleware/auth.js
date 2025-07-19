// backend/middleware/auth.js

const jwt = require("jsonwebtoken");

// Verifica JWT in Authorization: Bearer <token>
function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token mancante" });
  }
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, nome, email, ruolo }
    next();
  } catch {
    res.status(401).json({ error: "Token non valido" });
  }
}

// Controlla ruolo amministratore
function isAdmin(req, res, next) {
  if (req.user.ruolo !== "amministratore") {
    return res.status(403).json({ error: "Accesso negato" });
  }
  next();
}

// Controlla ruolo docente
function isDocente(req, res, next) {
  if (req.user.ruolo !== "docente") {
    return res.status(403).json({ error: "Accesso negato" });
  }
  next();
}

module.exports = { verifyToken, isAdmin, isDocente };
