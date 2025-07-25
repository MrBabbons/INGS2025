// backend/routes/docente.js

const express = require("express");
const { isDocente } = require("../middleware/auth");

module.exports = (db) => {
  const router = express.Router();
  router.use(isDocente);

  // ─── I miei insegnamenti ───────────────────────────────────────
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

  // ─── I corsi dove sono presidente ───────────────────────────────
  router.get("/presidente/corsi", async (req, res, next) => {
    try {
      const docId = req.user.id;
      const [rows] = await db.query(
        "SELECT id, nome FROM CorsoDiLaurea WHERE presidente_id = ?",
        [docId]
      );
      res.json(rows);
    } catch (err) {
      next(err);
    }
  });

  // ─── Tutti gli insegnamenti + argomenti (presidente) ───────────
  router.get("/presidente/:corsoId/insegnamenti", async (req, res) => {
    try {
      const docId = req.user.id;
      const { corsoId } = req.params;

      // Controllo autorizzazione
      const [[course]] = await db.query(
        "SELECT presidente_id FROM CorsoDiLaurea WHERE id = ?",
        [corsoId]
      );
      if (!course || course.presidente_id !== docId) {
        return res.status(403).json({ error: "Non autorizzato" });
      }

      // Prendo insegnamenti
      const [insRows] = await db.query(
        `SELECT id, nome, anno, semestre
         FROM Insegnamento
         WHERE corso_id = ?
         ORDER BY id`,
        [corsoId]
      );

      // Carico argomenti per ciascun insegnamento
      const insegnamenti = await Promise.all(
        insRows.map(async (ins) => {
          const [args] = await db.query(
            `SELECT a.id, a.descrizione
             FROM Argomento a
             JOIN InsegnamentoArgomento ia
               ON ia.argomento_id = a.id
             WHERE ia.insegnamento_id = ?`,
            [ins.id]
          );
          return { ...ins, argomenti: args };
        })
      );

      return res.json(insegnamenti);
    } catch (err) {
      console.error(
        "Errore in GET /presidente/:corsoId/insegnamenti",
        err
      );
      return res.status(500).json({ error: err.message });
    }
  });

  // ─── Salva anno + semestre per un insegnamento (presidente) ────
  router.post(
    "/presidente/insegnamenti/:insId/anno-semestre",
    async (req, res, next) => {
      try {
        const docId = req.user.id;
        const { insId } = req.params;
        const { anno, semestre } = req.body;

        // Controllo presidente
        const [[row]] = await db.query(
          `SELECT c.presidente_id
           FROM Insegnamento i
           JOIN CorsoDiLaurea c ON i.corso_id = c.id
           WHERE i.id = ?`,
          [insId]
        );
        if (!row || row.presidente_id !== docId)
          return res.status(403).json({ error: "Non autorizzato" });

        await db.query(
          "UPDATE Insegnamento SET anno = ?, semestre = ? WHERE id = ?",
          [anno, semestre, insId]
        );
        res.sendStatus(204);
      } catch (err) {
        next(err);
      }
    }
  );

  // ─── Genera lista minimizzata (presidente) ─────────────────────
  router.get("/presidente/:corsoId/minimizzato", async (req, res, next) => {
    try {
      const docId = req.user.id;
      const { corsoId } = req.params;

      // Controllo autorizzazione
      const [[course]] = await db.query(
        "SELECT presidente_id FROM CorsoDiLaurea WHERE id = ?",
        [corsoId]
      );
      if (!course || course.presidente_id !== docId)
        return res.status(403).json({ error: "Non autorizzato" });

      // Prendo insegnamenti validi
      const [insRows] = await db.query(
        `SELECT id, nome, anno, semestre
         FROM Insegnamento
         WHERE corso_id = ? AND anno IS NOT NULL AND semestre IS NOT NULL
         ORDER BY anno DESC, semestre DESC`,
        [corsoId]
      );

      // Costruisce minimap
      const topicMap = new Map();
      for (const ins of insRows) {
        const [args] = await db.query(
          `SELECT a.descrizione
           FROM Argomento a
           JOIN InsegnamentoArgomento ia
             ON ia.argomento_id = a.id
           WHERE ia.insegnamento_id = ?`,
          [ins.id]
        );
        for (const { descrizione } of args) {
          if (!topicMap.has(descrizione)) {
            topicMap.set(descrizione, {
              insegnamento: ins.nome,
              anno: ins.anno,
              semestre: ins.semestre,
            });
          }
        }
      }

      // Raggruppa e trasforma in array
      const resultMap = new Map();
      for (const [descrizione, { insegnamento, anno, semestre }] of topicMap) {
        if (!resultMap.has(insegnamento)) {
          resultMap.set(insegnamento, { anno, semestre, argomenti: [] });
        }
        resultMap.get(insegnamento).argomenti.push(descrizione);
      }

      const result = Array.from(resultMap.entries())
        .map(([insegnamento, { anno, semestre, argomenti }]) => ({
          insegnamento,
          anno,
          semestre,
          argomenti,
        }))
        .sort((a, b) => a.anno - b.anno || a.semestre - b.semestre);

      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  return router;
};
