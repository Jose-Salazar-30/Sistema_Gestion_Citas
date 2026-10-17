const express = require('express');
const router = express.Router();
const { 
  obtenerPacientes, 
  obtenerPacientePorId, 
  registrarPaciente, 
  actualizarPaciente, 
  cambiarEstadoPaciente 
} = require('../controllers/pacienteController');
const { verificarToken, verificarRol } = require('../middleware/auth');

router.get('/', verificarToken, obtenerPacientes);
router.get('/:id', verificarToken, obtenerPacientePorId);
router.post('/', verificarToken, verificarRol('ADMINISTRADOR', 'RECEPCIONISTA'), registrarPaciente);
router.put('/:id', verificarToken, verificarRol('ADMINISTRADOR', 'RECEPCIONISTA'), actualizarPaciente);
router.patch('/:id/estado', verificarToken, verificarRol('ADMINISTRADOR', 'RECEPCIONISTA'), cambiarEstadoPaciente);

module.exports = router;