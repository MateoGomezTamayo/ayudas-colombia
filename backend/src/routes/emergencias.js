/*
 * GET  /api/emergencias        — lista todas las emergencias
 * GET  /api/emergencias/:id    — detalle con total_solicitudes
 */

const router = require('express').Router();
const db = require('../db');

router.get('/', async (_req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM emergencias ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('GET /emergencias:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(
      `SELECT e.*, COUNT(s.id)::int AS total_solicitudes
       FROM emergencias e
       LEFT JOIN solicitudes s ON s.emergencia_id = e.id
       WHERE e.id = $1
       GROUP BY e.id`,
      [id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Emergencia no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    console.error('GET /emergencias/:id:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
