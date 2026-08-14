/*
 * GET  /api/solicitudes
 *   Query params: emergencia_id, ciudad, prioridad, estado
 *   Returns: solicitudes con items, ordenadas alta→media→baja y más recientes primero
 *
 * POST /api/solicitudes
 *   Body: {
 *     emergencia_id, ciudad, departamento, lat, lng,
 *     nombre_solicitante, contacto, descripcion, prioridad,
 *     items: [{ categoria_id, producto, cantidad, unidad }]
 *   }
 *   Returns: solicitud creada
 */

const router = require('express').Router();
const db = require('../db');

function buildFilters(query) {
  const { emergencia_id, ciudad, prioridad, estado } = query;
  const conditions = [];
  const params = [];

  if (emergencia_id) { params.push(emergencia_id);       conditions.push(`s.emergencia_id = $${params.length}`); }
  if (ciudad)        { params.push(`%${ciudad}%`);       conditions.push(`s.ciudad ILIKE $${params.length}`); }
  if (prioridad)     { params.push(prioridad);            conditions.push(`s.prioridad = $${params.length}`); }
  if (estado)        { params.push(estado);               conditions.push(`s.estado = $${params.length}`); }

  return { where: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '', params };
}

const SOLICITUDES_WITH_ITEMS = (where) => `
  SELECT s.*,
    json_agg(
      json_build_object(
        'id',          si.id,
        'categoria_id',si.categoria_id,
        'producto',    si.producto,
        'cantidad',    si.cantidad,
        'unidad',      si.unidad,
        'cubierto',    si.cubierto
      )
    ) FILTER (WHERE si.id IS NOT NULL) AS items
  FROM solicitudes s
  LEFT JOIN solicitud_items si ON si.solicitud_id = s.id
  ${where}
  GROUP BY s.id
  ORDER BY
    CASE s.prioridad WHEN 'alta' THEN 1 WHEN 'media' THEN 2 WHEN 'baja' THEN 3 ELSE 4 END,
    s.created_at DESC
`;

router.get('/', async (req, res) => {
  const { where, params } = buildFilters(req.query);
  try {
    const { rows } = await db.query(SOLICITUDES_WITH_ITEMS(where), params);
    res.json(rows);
  } catch (err) {
    console.error('GET /solicitudes:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/', async (req, res) => {
  const {
    emergencia_id, ciudad, departamento, lat, lng,
    nombre_solicitante, contacto, descripcion, prioridad, items
  } = req.body;

  if (!ciudad) return res.status(400).json({ error: 'El campo ciudad es requerido' });

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `INSERT INTO solicitudes
         (emergencia_id, ciudad, departamento, lat, lng, nombre_solicitante, contacto, descripcion, prioridad)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [emergencia_id, ciudad, departamento, lat, lng, nombre_solicitante, contacto, descripcion, prioridad || 'media']
    );
    const solicitud = rows[0];

    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        await client.query(
          `INSERT INTO solicitud_items (solicitud_id, categoria_id, producto, cantidad, unidad)
           VALUES ($1,$2,$3,$4,$5)`,
          [solicitud.id, item.categoria_id, item.producto, item.cantidad, item.unidad]
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json(solicitud);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('POST /solicitudes:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  } finally {
    client.release();
  }
});

module.exports = router;
