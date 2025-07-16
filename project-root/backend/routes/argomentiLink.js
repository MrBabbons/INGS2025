const express = require("express");
const router = express.Router();
const { isDocente } = require("../middleware/auth");

module.exports = (db) => {
  // GET argomenti collegati a un insegnamento
  router.get("/insegnamenti/:id/argomenti", isDocente, async (req, res) => {
    const [rows] = await db.query(
      "SELECT argomento_id FROM InsegnamentoArgomento WHERE insegnamento_id=?",
      [req.params.id]
    );
    res.json(rows);
  });

  // POST aggiorna lista argomenti
  router.post("/insegnamenti/:id/argomenti", isDocente, async (req, res) => {
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
  });

  return router;
};
