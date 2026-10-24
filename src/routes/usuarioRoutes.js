const express = require('express');
const router = express.Router();
const { obtenerUsuarios, crearUsuario, actualizarUsuario } = require('../controllers/usuarioController');
const { verificarToken, verificarRol } = require('../middleware/auth');

router.get('/', verificarToken, verificarRol('ADMINISTRADOR'), obtenerUsuarios);
router.post('/', /*verificarToken, verificarRol*/ ('ADMINISTRADOR'), crearUsuario);
router.put('/:id', verificarToken, verificarRol('ADMINISTRADOR'), actualizarUsuario);

module.exports = router;