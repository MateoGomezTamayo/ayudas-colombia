require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');

const app = express();

app.use(compression())
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '100kb' }));

// Cache 30s for public read endpoints under high load
const cache30 = (_req, res, next) => { res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60'); next() }

app.use('/api/emergencias', cache30, require('./routes/emergencias'));
app.use('/api/puntos-acopio', cache30, require('./routes/puntosAcopio'));
app.use('/api/solicitudes', cache30, require('./routes/solicitudes'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin/solicitudes', require('./routes/adminSolicitudes'));
app.use('/api/admin/puntos-acopio', require('./routes/adminPuntos'));
app.use('/api/admin/emergencias', require('./routes/adminEmergencias'));

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Ayudas Colombia API corriendo en puerto ${PORT}`));
