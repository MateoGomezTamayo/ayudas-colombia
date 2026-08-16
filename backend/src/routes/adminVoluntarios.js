const router = require('express').Router();
const requireAuth = require('../middleware/auth');
const db = require('../db');

router.use(requireAuth);

router.get('/', async (_req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM voluntarios ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('GET /admin/voluntarios:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/', async (req, res) => {
  const { nombre, ciudad, tipo, descripcion, link_inscripcion, whatsapp, instagram, telefono, emergencia_id } = req.body;
  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' });
  try {
    const { rows } = await db.query(
      `INSERT INTO voluntarios (nombre, ciudad, tipo, descripcion, link_inscripcion, whatsapp, instagram, telefono, emergencia_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [nombre, ciudad, tipo || 'presencial', descripcion, link_inscripcion, whatsapp, instagram, telefono, emergencia_id || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST /admin/voluntarios:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, ciudad, tipo, descripcion, link_inscripcion, whatsapp, instagram, telefono, activo } = req.body;
  try {
    const { rows } = await db.query(
      `UPDATE voluntarios SET
         nombre           = COALESCE($1, nombre),
         ciudad           = COALESCE($2, ciudad),
         tipo             = COALESCE($3, tipo),
         descripcion      = COALESCE($4, descripcion),
         link_inscripcion = COALESCE($5, link_inscripcion),
         whatsapp         = COALESCE($6, whatsapp),
         instagram        = COALESCE($7, instagram),
         telefono         = COALESCE($8, telefono),
         activo           = COALESCE($9, activo),
         updated_at       = NOW()
       WHERE id = $10 RETURNING *`,
      [nombre, ciudad, tipo, descripcion, link_inscripcion, whatsapp, instagram, telefono, activo, id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'No encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('PATCH /admin/voluntarios/:id:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE voluntarios SET activo = FALSE, updated_at = NOW() WHERE id = $1', [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /admin/voluntarios/:id:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
