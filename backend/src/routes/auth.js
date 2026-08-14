/*
 * POST /api/auth/login
 *   Body:    { email, password }
 *   Returns: { token }
 *
 * POST /api/auth/setup
 *   Body:    { nombre, email, password }
 *   Returns: { admin: { id, nombre, email } }
 *   Only works when the admins table is empty.
 *
 * Required ENV: JWT_SECRET
 */

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }
  try {
    const { rows } = await db.query('SELECT * FROM admins WHERE email = $1', [email]);
    const admin = rows[0];
    if (!admin) return res.status(401).json({ error: 'Credenciales inválidas' });

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: admin.id, email: admin.email, nombre: admin.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ token });
  } catch (err) {
    console.error('auth/login:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/setup', async (req, res) => {
  const { nombre, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }
  try {
    const { rows } = await db.query('SELECT COUNT(*) FROM admins');
    if (parseInt(rows[0].count) > 0) {
      return res.status(400).json({ error: 'Ya existe un administrador registrado' });
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO admins (nombre, email, password_hash) VALUES ($1, $2, $3) RETURNING id, nombre, email',
      [nombre, email, hash]
    );
    res.status(201).json({ admin: result.rows[0] });
  } catch (err) {
    console.error('auth/setup:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
