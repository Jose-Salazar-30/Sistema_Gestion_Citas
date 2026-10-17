const express = require('express');
const router = express.Router();
const { obtenerCitas, programarCita, cambiarEstadoCita } = require('../controllers/citaController');
const { verificarToken, verificarRol } = require('../middleware/auth');

router.get('/', verificarToken, obtenerCitas);
router.post('/', verificarToken, verificarRol('ADMINISTRADOR', 'RECEPCIONISTA'), programarCita);
router.patch('/:id/estado', verificarToken, cambiarEstadoCita);

module.exports = router;