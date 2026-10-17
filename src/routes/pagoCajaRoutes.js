const express = require('express');
const router = express.Router();
const {
  abrirCaja,
  obtenerCajaActual,
  cerrarCaja,
  registrarPago,
  consultarSaldoCita,
  anularPago
} = require('../controllers/pagoCajaController');
const { verificarToken, verificarRol } = require('../middleware/auth');

// Caja
router.post('/cajas/abrir', verificarToken, verificarRol('ADMINISTRADOR', 'RECEPCIONISTA'), abrirCaja);
router.get('/cajas/actual', verificarToken, obtenerCajaActual);
router.post('/cajas/:id/cerrar', verificarToken, verificarRol('ADMINISTRADOR', 'RECEPCIONISTA'), cerrarCaja);

// Pagos
router.post('/pagos', verificarToken, verificarRol('ADMINISTRADOR', 'RECEPCIONISTA'), registrarPago);
router.get('/citas/:citaId/saldo', verificarToken, consultarSaldoCita);
router.patch('/pagos/:id/anular', verificarToken, verificarRol('ADMINISTRADOR', 'RECEPCIONISTA'), anularPago);

module.exports = router;