const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

module.exports = (db) => {
  // sovrapposizioni
  router.get("/sovrapposizioni/:corsoId", verifyToken, async (req, res) => {
    const cid = req.params.corsoId;
    const [pairs] = await db.query(`
      SELECT A.nome AS nomeA, B.nome AS nomeB, COUNT(*) AS commonCount
      FROM InsegnamentoArgomento IA1
      JOIN InsegnamentoArgomento IA2
        ON IA1.argomento_id=IA2.argomento_id
        AND IA1.insegnamento_id<IA2.insegnamento_id
      JOIN Insegnamento A ON A.id=IA1.insegnamento_id
      JOIN Insegnamento B ON B.id=IA2.insegnamento_id
      WHERE A.corso_id=? AND B.corso_id=?
      GROUP BY IA1.insegnamento_id,IA2.insegnamento_id
    `, [cid, cid]);
    res.json(pairs);
  });

  // copertura
  router.get("/copertura/:corsoId", verifyToken, async (req, res) => {
    const cid = req.params.corsoId;
    const [[{ minimo }]] = await db.query(`
      SELECT COUNT(*) AS minimo
      FROM ArgomentoObbligatorio
      WHERE corso_id=?
    `, [cid]);

    const [[{ effettivo }]] = await db.query(`
      SELECT COUNT(DISTINCT IA.argomento_id) AS effettivo
      FROM InsegnamentoArgomento IA
      JOIN Insegnamento I ON I.id=IA.insegnamento_id
      WHERE I.corso_id=?
    `, [cid]);

    res.json({ minimo, effettivo });
  });

  return router;
};
