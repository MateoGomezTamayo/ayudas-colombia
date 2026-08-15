const router = require('express').Router()
const db = require('../db')

router.get('/', async (_req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM voluntarios WHERE activo = TRUE ORDER BY created_at DESC LIMIT 100'
    )
    res.json(rows)
  } catch (err) {
    console.error('GET /voluntarios:', err.message)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

module.exports = router
