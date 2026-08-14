/*
 * Requires: Authorization: Bearer <token>
 *
 * GET    /api/admin/puntos-acopio      — todos los puntos (activos e inactivos)
 * POST   /api/admin/puntos-acopio      — crear punto
 * PATCH  /api/admin/puntos-acopio/:id  — actualizar punto
 * DELETE /api/admin/puntos-acopio/:id  — desactivar punto (soft delete)
 */

const router = require('express').Router();
const requireAuth = require('../middleware/auth');
const db = require('../db');

router.use(requireAuth);

router.get('/', async (_req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM puntos_acopio ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('GET /admin/puntos-acopio:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/', async (req, res) => {
  const { nombre, ciudad, departamento, direccion, lat, lng, horario, contacto, telefono, que_acepta, emergencia_id } = req.body;
  if (!nombre || !ciudad) return res.status(400).json({ error: 'Nombre y ciudad son requeridos' });
  try {
    const { rows } = await db.query(
      `INSERT INTO puntos_acopio
         (nombre, ciudad, departamento, direccion, lat, lng, horario, contacto, telefono, que_acepta, emergencia_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [nombre, ciudad, departamento, direccion, lat, lng, horario, contacto, telefono, que_acepta, emergencia_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /admin/puntos-acopio:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, ciudad, departamento, direccion, lat, lng, horario, contacto, telefono, que_acepta, activo, emergencia_id } = req.body;
  try {
    const { rows } = await db.query(
      `UPDATE puntos_acopio SET
         nombre        = COALESCE($1,  nombre),
         ciudad        = COALESCE($2,  ciudad),
         departamento  = COALESCE($3,  departamento),
         direccion     = COALESCE($4,  direccion),
         lat           = COALESCE($5,  lat),
         lng           = COALESCE($6,  lng),
         horario       = COALESCE($7,  horario),
         contacto      = COALESCE($8,  contacto),
         telefono      = COALESCE($9,  telefono),
         que_acepta    = COALESCE($10, que_acepta),
         activo        = COALESCE($11, activo),
         emergencia_id = COALESCE($12, emergencia_id),
         updated_at    = NOW()
       WHERE id = $13 RETURNING *`,
      [nombre, ciudad, departamento, direccion, lat, lng, horario, contacto, telefono, que_acepta, activo, emergencia_id, id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Punto de acopio no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('PATCH /admin/puntos-acopio/:id:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(
      'UPDATE puntos_acopio SET activo = FALSE, updated_at = NOW() WHERE id = $1 RETURNING *',
      [id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Punto de acopio no encontrado' });
    res.json({ message: 'Punto de acopio desactivado', punto: rows[0] });
  } catch (err) {
    console.error('DELETE /admin/puntos-acopio/:id:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
