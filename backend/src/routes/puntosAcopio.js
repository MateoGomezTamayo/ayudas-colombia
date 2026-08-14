/*
 * GET /api/puntos-acopio
 *   Query params: emergencia_id, ciudad, departamento
 *   Returns: puntos activos filtrados, ordenados por created_at DESC
 */

const router = require('express').Router();
const db = require('../db');

router.get('/', async (req, res) => {
  const { emergencia_id, ciudad, departamento, tipo } = req.query;
  const conditions = ['p.activo = TRUE'];
  const params = [];

  if (emergencia_id) { params.push(emergencia_id);         conditions.push(`p.emergencia_id = $${params.length}`); }
  if (ciudad)        { params.push(`%${ciudad}%`);         conditions.push(`p.ciudad ILIKE $${params.length}`); }
  if (departamento)  { params.push(`%${departamento}%`);   conditions.push(`p.departamento ILIKE $${params.length}`); }
  if (tipo)          { params.push(tipo);                  conditions.push(`p.tipo = $${params.length}`); }

  try {
    const { rows } = await db.query(
      `SELECT * FROM puntos_acopio p WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`,
      params
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /puntos-acopio:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
