const express = require("express");
const router = express.Router();
const { isDocente } = require("../middleware/auth");

module.exports = (db) => {
  router.get("/insegnamenti", isDocente, async (req, res) => {
    const docId = req.user.id;
    const [rows] = await db.query(`
      SELECT I.id,I.nome,I.corso_id
      FROM Insegnamento I
      JOIN DocenteInsegnamento DI ON DI.insegnamento_id=I.id
      WHERE DI.docente_id=?`, [docId]);
    res.json(rows);
  });

  return router; 
};
