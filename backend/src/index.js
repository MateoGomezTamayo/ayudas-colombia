require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/emergencias', require('./routes/emergencias'));
app.use('/api/solicitudes', require('./routes/solicitudes'));
app.use('/api/puntos-acopio', require('./routes/puntosAcopio'));
app.use('/api/admin/solicitudes', require('./routes/adminSolicitudes'));
app.use('/api/admin/puntos-acopio', require('./routes/adminPuntos'));
app.use('/api/admin/emergencias', require('./routes/adminEmergencias'));

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Ayudas Colombia API corriendo en puerto ${PORT}`));
