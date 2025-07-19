// backend/routes/report.js

const express = require("express");
const { verifyToken } = require("../middleware/auth");

module.exports = (db) => {
  const router = express.Router();
  router.use(verifyToken);

  // Sovrapposizioni
  router.get("/sovrapposizioni/:corsoId", async (req, res, next) => {
    try {
      const cid = req.params.corsoId;
      const [rows] = await db.query(`
        SELECT 
          c.nome AS corso,
          i1.nome AS ins1,
          i2.nome AS ins2,
          COUNT(*) AS shared
        FROM InsegnamentoArgomento ia1
        JOIN InsegnamentoArgomento ia2
          ON ia1.argomento_id = ia2.argomento_id
          AND ia1.insegnamento_id < ia2.insegnamento_id
        JOIN Insegnamento i1 ON ia1.insegnamento_id = i1.id
        JOIN Insegnamento i2 ON ia2.insegnamento_id = i2.id
        JOIN CorsoDiLaurea c ON i1.corso_id = c.id
        WHERE i1.corso_id = ? AND i2.corso_id = ?
        GROUP BY ia1.insegnamento_id, ia2.insegnamento_id
      `, [cid, cid]);
      res.json(rows);
    } catch (err) {
      next(err);
    }
  });

  // Copertura
  router.get("/copertura/:corsoId", async (req, res, next) => {
    try {
      const cid = req.params.corsoId;
      const [[{ minimo }]] = await db.query(`
        SELECT COUNT(*) AS minimo 
        FROM ArgomentoObbligatorio 
        WHERE corso_id = ?
      `, [cid]);

      const [[{ effettivo }]] = await db.query(`
        SELECT COUNT(DISTINCT ia.argomento_id) AS effettivo
        FROM InsegnamentoArgomento ia
        JOIN Insegnamento i ON i.id = ia.insegnamento_id
        WHERE i.corso_id = ?
      `, [cid]);

      res.json({ minimo, effettivo });
    } catch (err) {
      next(err);
    }
  });

  // Lista Minima
  router.get("/minimal/:corsoId", async (req, res, next) => {
    try {
      const cid = req.params.corsoId;
      const [rows] = await db.query(`
        SELECT 
          m.insegnamento_id,
          i.nome        AS insegnamento,
          m.argomento_id,
          a.descrizione
        FROM (
          SELECT 
            ia.argomento_id,
            MIN(ia.insegnamento_id) AS insegnamento_id
          FROM InsegnamentoArgomento ia
          JOIN Insegnamento i 
            ON ia.insegnamento_id = i.id
          WHERE i.corso_id = ?
          GROUP BY ia.argomento_id
        ) AS m
        JOIN Insegnamento i 
          ON i.id = m.insegnamento_id
        JOIN Argomento a 
          ON a.id = m.argomento_id
      `, [cid]);
      res.json(rows);
    } catch (err) {
      next(err);
    }
  });

  return router;
};
