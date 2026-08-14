/*
 * Requires: Authorization: Bearer <token>
 *
 * GET   /api/admin/solicitudes           — todas con items y filtros opcionales
 * PATCH /api/admin/solicitudes/:id       — actualizar estado y/o prioridad
 * PATCH /api/admin/solicitudes/:id/items/:itemId — marcar item cubierto
 */

const router = require('express').Router();
const requireAuth = require('../middleware/auth');
const db = require('../db');

router.use(requireAuth);

router.get('/', async (req, res) => {
  const { emergencia_id, ciudad, prioridad, estado } = req.query;
  const conditions = [];
  const params = [];

  if (emergencia_id) { params.push(emergencia_id);   conditions.push(`s.emergencia_id = $${params.length}`); }
  if (ciudad)        { params.push(`%${ciudad}%`);   conditions.push(`s.ciudad ILIKE $${params.length}`); }
  if (prioridad)     { params.push(prioridad);        conditions.push(`s.prioridad = $${params.length}`); }
  if (estado)        { params.push(estado);           conditions.push(`s.estado = $${params.length}`); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const { rows } = await db.query(
      `SELECT s.*,
         json_agg(
           json_build_object(
             'id',           si.id,
             'categoria_id', si.categoria_id,
             'producto',     si.producto,
             'cantidad',     si.cantidad,
             'unidad',       si.unidad,
             'cubierto',     si.cubierto
           )
         ) FILTER (WHERE si.id IS NOT NULL) AS items
       FROM solicitudes s
       LEFT JOIN solicitud_items si ON si.solicitud_id = s.id
       ${where}
       GROUP BY s.id
       ORDER BY
         CASE s.prioridad WHEN 'alta' THEN 1 WHEN 'media' THEN 2 WHEN 'baja' THEN 3 ELSE 4 END,
         s.created_at DESC`,
      params
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /admin/solicitudes:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { estado, prioridad } = req.body;
  try {
    const { rows } = await db.query(
      `UPDATE solicitudes SET
         estado     = COALESCE($1, estado),
         prioridad  = COALESCE($2, prioridad),
         updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [estado, prioridad, id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Solicitud no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    console.error('PATCH /admin/solicitudes/:id:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.patch('/:id/items/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const { cubierto } = req.body;
  if (typeof cubierto !== 'boolean') {
    return res.status(400).json({ error: 'El campo cubierto debe ser booleano' });
  }
  try {
    const { rows } = await db.query(
      'UPDATE solicitud_items SET cubierto = $1 WHERE id = $2 RETURNING *',
      [cubierto, itemId]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Item no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('PATCH /admin/solicitudes/:id/items/:itemId:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
