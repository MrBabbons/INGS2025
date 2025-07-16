const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Token mancante" });

  const token = header.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ error: "Token non valido" });
    req.user = payload;      // { id, ruolo }
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user.ruolo !== "amministratore")
    return res.status(403).json({ error: "Accesso negato" });
  next();
}

function isDocente(req, res, next) {
  if (req.user.ruolo !== "docente")
    return res.status(403).json({ error: "Accesso negato" });
  next();
}

module.exports = { verifyToken, isAdmin, isDocente };
