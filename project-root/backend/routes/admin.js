// backend/routes/admin.js

const express = require("express");
const { isAdmin } = require("../middleware/auth");

module.exports = (db) => {
  const router = express.Router();
  router.use(isAdmin);

  // ─── Overview ────────────────────────────────────────────────────
  router.get("/overview", async (req, res, next) => {
    try {
      const [[{ corsi }]]        = await db.query("SELECT COUNT(*) AS corsi FROM CorsoDiLaurea");
      const [[{ insegnamenti }]] = await db.query("SELECT COUNT(*) AS insegnamenti FROM Insegnamento");
      const [[{ argomenti }]]    = await db.query("SELECT COUNT(*) AS argomenti FROM Argomento");
      res.json({ corsi, insegnamenti, argomenti });
    } catch (err) {
      next(err);
    }
  });

  // ─── CORSI DI LAUREA (con presidente) ───────────────────────────
  router.get("/corsi", async (req, res, next) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          c.id, c.nome, c.presidente_id, u.nome AS presidenteNome
        FROM CorsoDiLaurea c
        LEFT JOIN Utente u ON c.presidente_id = u.id
        ORDER BY c.id DESC
      `);
      res.json(rows);
    } catch (err) {
      next(err);
    }
  });

  router.post("/corsi", async (req, res, next) => {
    try {
      const { nome } = req.body;
      const [ins] = await db.query("INSERT INTO CorsoDiLaurea(nome) VALUES(?)", [nome]);
      res.status(201).json({ id: ins.insertId, nome, presidente_id: null, presidenteNome: null });
    } catch (err) {
      next(err);
    }
  });

  router.delete("/corsi/:id", async (req, res, next) => {
    try {
      await db.query("DELETE FROM CorsoDiLaurea WHERE id=?", [req.params.id]);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });

  // ─── Designa Presidente ──────────────────────────────────────────
  router.get("/corsi/:id/docenti-president", async (req, res, next) => {
    try {
      const corsoId = req.params.id;
      const [docenti] = await db.query(
        `SELECT DISTINCT u.id, u.nome
         FROM Utente u
         JOIN DocenteInsegnamento di ON u.id = di.docente_id
         JOIN Insegnamento i ON i.id = di.insegnamento_id
         WHERE i.corso_id = ?`,
        [corsoId]
      );
      const [[{ presidente_id }]] = await db.query(
        "SELECT presidente_id FROM CorsoDiLaurea WHERE id = ?",
        [corsoId]
      );
      res.json({ docenti, presidente_id });
    } catch (err) {
      next(err);
    }
  });

  router.post("/corsi/:id/president", async (req, res, next) => {
    try {
      const corsoId = req.params.id;
      const { presidenteId } = req.body;
      await db.query(
        "UPDATE CorsoDiLaurea SET presidente_id = ? WHERE id = ?",
        [presidenteId || null, corsoId]
      );
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });

  // ─── INSEGNAMENTI CRUD ────────────────────────────────────────────
  router.get("/insegnamenti", async (req, res, next) => {
    try {
      const [rows] = await db.query(`
        SELECT i.id, i.nome, c.nome AS corso
        FROM Insegnamento i
        JOIN CorsoDiLaurea c ON i.corso_id = c.id
        ORDER BY i.id DESC
      `);
      res.json(rows);
    } catch (err) {
      next(err);
    }
  });

  router.post("/insegnamenti", async (req, res, next) => {
    try {
      const { nome, corso_id } = req.body;
      const [ins] = await db.query(
        "INSERT INTO Insegnamento(nome,corso_id) VALUES(?,?)",
        [nome, corso_id]
      );
      res.status(201).json({ id: ins.insertId, nome, corso_id });
    } catch (err) {
      next(err);
    }
  });

  router.delete("/insegnamenti/:id", async (req, res, next) => {
    try {
      await db.query("DELETE FROM Insegnamento WHERE id=?", [req.params.id]);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });

  // ─── ARGOMENTI CRUD (globali) ────────────────────────────────────
  router.get("/argomenti", async (req, res, next) => {
    try {
      const [rows] = await db.query("SELECT id, descrizione FROM Argomento ORDER BY id DESC");
      res.json(rows);
    } catch (err) {
      next(err);
    }
  });

  router.post("/argomenti", async (req, res, next) => {
    try {
      const { descrizione } = req.body;
      const [ins] = await db.query(
        "INSERT INTO Argomento(descrizione) VALUES(?)",
        [descrizione]
      );
      res.status(201).json({ id: ins.insertId, descrizione });
    } catch (err) {
      next(err);
    }
  });

  router.delete("/argomenti/:id", async (req, res, next) => {
    try {
      await db.query("DELETE FROM Argomento WHERE id=?", [req.params.id]);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  });

  // ─── ASSOCIAZIONE DOCENTI - INSEGNAMENTI ──────────────────────────
  // GET lista docenti + flag assigned
  router.get("/insegnamenti/:id/docenti", async (req, res, next) => {
    try {
      const insId = req.params.id;
      const [allDocs] = await db.query(
        "SELECT id, nome FROM Utente WHERE ruolo='docente' ORDER BY nome"
      );
      const [linked] = await db.query(
        "SELECT docente_id FROM DocenteInsegnamento WHERE insegnamento_id=?",
        [insId]
      );
      const linkedSet = new Set(linked.map((r) => r.docente_id));
      const docenti = allDocs.map((d) => ({
        id: d.id,
        nome: d.nome,
        assigned: linkedSet.has(d.id),
      }));
      res.json(docenti);
    } catch (err) {
      next(err);
    }
  });

  // POST sovrascrive assegnamenti docenti - insegnamento
  router.post("/insegnamenti/:id/docenti", async (req, res, next) => {
    try {
      const insId = req.params.id;
      const { docenti } = req.body; // array di id docente
      await db.query(
        "DELETE FROM DocenteInsegnamento WHERE insegnamento_id=?",
        [insId]
      );
      if (docenti.length) {
        const vals = docenti.map((did) => [did, insId]);
        await db.query(
          "INSERT INTO DocenteInsegnamento(docente_id,insegnamento_id) VALUES ?",
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
