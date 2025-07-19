// backend/routes/docente.js

const express = require("express");
const { isDocente } = require("../middleware/auth");

module.exports = (db) => {
  const router = express.Router();
  router.use(isDocente);

  // GET /api/docente/insegnamenti
  router.get("/insegnamenti", async (req, res, next) => {
    try {
      const docId = req.user.id;
      const [rows] = await db.query(`
        SELECT i.id, i.nome, c.id AS corso_id, c.nome AS corsoNome
        FROM Insegnamento i
        JOIN CorsoDiLaurea c 
          ON i.corso_id = c.id
        JOIN DocenteInsegnamento di 
          ON di.insegnamento_id = i.id
        WHERE di.docente_id = ?
      `, [docId]);
      res.json(rows);
    } catch (err) {
      next(err);
    }
  });

  return router;
};
