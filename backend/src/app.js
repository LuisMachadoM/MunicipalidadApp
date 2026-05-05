const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const tramiteRoutes = require('./routes/tramiteRoutes');
const formularioRoutes = require('./routes/formularioRoutes');
const solicitudRoutes = require('./routes/solicitudRoutes');
const funcionarioRoutes = require('./routes/funcionarioRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.resolve(process.env.UPLOAD_DIR || 'uploads')));

app.get('/api/health', (_req, res) => res.json({ ok: true, message: 'Backend operativo.' }));
app.use('/api/auth', authRoutes);
app.use('/api/tramites', tramiteRoutes);
app.use('/api/formularios', formularioRoutes);
app.use('/api/solicitudes', solicitudRoutes);
app.use('/api/funcionario', funcionarioRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Error interno del servidor.' });
});

module.exports = app;
