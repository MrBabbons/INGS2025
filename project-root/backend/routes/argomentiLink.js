// backend/routes/argomentiLink.js

const express = require("express");
const { verifyToken, isDocente } = require("../middleware/auth");

module.exports = (db) => {
  const router = express.Router();

  // 1) Lista globale argomenti (admin + docenti)
  router.get("/argomenti", verifyToken, async (req, res, next) => {
    try {
      const [rows] = await db.query(
        "SELECT id, descrizione FROM Argomento ORDER BY descrizione"
      );
      res.json(rows);
    } catch (err) {
      next(err);
    }
  });

  // 2) GET argomenti già selezionati per un insegnamento
  router.get("/insegnamenti/:id/argomenti", isDocente, async (req, res, next) => {
    try {
      const [rows] = await db.query(
        "SELECT argomento_id FROM InsegnamentoArgomento WHERE insegnamento_id=?",
        [req.params.id]
      );
      res.json(rows.map(r => r.argomento_id));
    } catch (err) {
      next(err);
    }
  });

  // 3) POST salva elenco argomenti per un insegnamento
  router.post("/insegnamenti/:id/argomenti", isDocente, async (req, res, next) => {
    try {
      const insId = req.params.id;
      const { argomenti } = req.body; // array di id
      await db.query("DELETE FROM InsegnamentoArgomento WHERE insegnamento_id=?", [insId]);
      if (argomenti.length) {
        const vals = argomenti.map(a => [insId, a]);
        await db.query(
          "INSERT INTO InsegnamentoArgomento(insegnamento_id,argomento_id) VALUES ?",
          [vals]
        );
      }
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });

  return router;
};
