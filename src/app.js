const express = require('express');
const cors = require('cors');
require('dotenv').config();
const conectarDB = require('./config/db');

// Importar Rutas
const authRoutes = require('./routes/authRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const pacienteRoutes = require('./routes/pacienteRoutes');
const citaRoutes = require('./routes/citaRoutes');
const pagoCajaRoutes = require('./routes/pagoCajaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

// Inicializar la aplicación Express
const app = express();

// Conectar a la Base de Datos de MongoDB
conectarDB();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta de prueba inicial
app.get('/', (req, res) => {
  res.json({ mensaje: 'API del Sistema SIGCA funcionando correctamente' });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/pagos', pagoCajaRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Definir puerto y arrancar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});