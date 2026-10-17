const express = require('express');
const router = express.Router();
const { obtenerServicios, crearServicio, actualizarServicio } = require('../controllers/servicioController');
const { verificarToken, verificarRol } = require('../middleware/auth');

router.get('/', obtenerServicios);
router.post('/', verificarToken, verificarRol('ADMINISTRADOR'), crearServicio);
router.put('/:id', verificarToken, verificarRol('ADMINISTRADOR'), actualizarServicio);

module.exports = router;