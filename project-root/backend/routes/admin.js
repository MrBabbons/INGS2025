const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middleware/auth");

module.exports = (db) => {
  // overview counts
  router.get("/overview", isAdmin, async (req, res) => {
    const [[{ c }]] = await db.query("SELECT COUNT(*) AS c FROM CorsoDiLaurea");
    const [[{ i }]] = await db.query("SELECT COUNT(*) AS i FROM Insegnamento");
    const [[{ a }]] = await db.query("SELECT COUNT(*) AS a FROM Argomento");
    res.json({ corsi: c, insegnamenti: i, argomenti: a });
  });

  // lista corsi
  router.get("/corsi", isAdmin, async (req, res) => {
    const [rows] = await db.query("SELECT id,nome FROM CorsoDiLaurea ORDER BY id DESC");
    res.json(rows);
  });

  // lista insegnamenti
  router.get("/insegnamenti", isAdmin, async (req, res) => {
    const [rows] = await db.query(`
      SELECT I.id,I.nome,C.nome AS corso
      FROM Insegnamento I
      LEFT JOIN CorsoDiLaurea C ON C.id=I.corso_id
      ORDER BY I.id DESC`);
    res.json(rows);
  });

  // lista argomenti
  router.get("/argomenti", isAdmin, async (req, res) => {
    const [rows] = await db.query("SELECT id,descrizione FROM Argomento ORDER BY id DESC");
    res.json(rows);
  });

  return router;
};
