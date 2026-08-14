/*
 * POST /api/admin/emergencias
 *   Body:    { nombre, descripcion, tipo, estado, departamento, municipio, fecha_inicio }
 *   Returns: emergencia creada
 *
 * PATCH /api/admin/emergencias/:id
 *   Body:    campos a actualizar (todos opcionales excepto requiere al menos uno)
 *   Returns: emergencia actualizada
 *
 * Requires: Authorization: Bearer <token>
 */

const router = require('express').Router();
const requireAuth = require('../middleware/auth');
const db = require('../db');

router.use(requireAuth);

router.post('/', async (req, res) => {
  const { nombre, descripcion, tipo, estado, departamento, municipio, fecha_inicio } = req.body;
  if (!nombre) return res.status(400).json({ error: 'El nombre de la emergencia es requerido' });
  try {
    const { rows } = await db.query(
      `INSERT INTO emergencias (nombre, descripcion, tipo, estado, departamento, municipio, fecha_inicio)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [nombre, descripcion, tipo, estado || 'activa', departamento, municipio, fecha_inicio]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /admin/emergencias:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, tipo, estado, departamento, municipio, fecha_inicio } = req.body;
  try {
    const { rows } = await db.query(
      `UPDATE emergencias SET
         nombre       = COALESCE($1, nombre),
         descripcion  = COALESCE($2, descripcion),
         tipo         = COALESCE($3, tipo),
         estado       = COALESCE($4, estado),
         departamento = COALESCE($5, departamento),
         municipio    = COALESCE($6, municipio),
         fecha_inicio = COALESCE($7, fecha_inicio),
         updated_at   = NOW()
       WHERE id = $8 RETURNING *`,
      [nombre, descripcion, tipo, estado, departamento, municipio, fecha_inicio, id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Emergencia no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    console.error('PATCH /admin/emergencias/:id:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
