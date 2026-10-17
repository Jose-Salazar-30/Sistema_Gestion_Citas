const express = require('express');
const router = express.Router();
const { login, obtenerPerfil } = require('../controllers/authController');
const { verificarToken } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', verificarToken, obtenerPerfil);

module.exports = router;