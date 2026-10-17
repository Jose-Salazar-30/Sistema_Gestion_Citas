const Pago = require('../models/Pago');
const Caja = require('../models/Caja');
const Cita = require('../models/Cita');

// --- MÓDULO DE CAJA ---

// 1. Abrir caja diaria
const abrirCaja = async (req, res) => {
  try {
    const { montoInicial } = req.body;
    const usuarioResponsable = req.usuario.id;

    // Regla: Cada usuario autorizado podrá tener únicamente una caja abierta a la vez (RN-22)
    const cajaAbierta = await Caja.findOne({ usuarioResponsable, estado: 'ABIERTA' });
    if (cajaAbierta) {
      return res.status(400).json({ mensaje: 'Ya tienes una caja abierta actualmente' });
    }

    const nuevaCaja = new Caja({
      usuarioResponsable,
      montoInicial,
      estado: 'ABIERTA'
    });

    await nuevaCaja.save();
    res.status(201).json({ mensaje: 'Caja abierta exitosamente', caja: nuevaCaja });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al abrir la caja', error: error.message });
  }
};

// 2. Consultar caja actual del usuario
const obtenerCajaActual = async (req, res) => {
  try {
    const caja = await Caja.findOne({ usuarioResponsable: req.usuario.id, estado: 'ABIERTA' });
    if (!caja) {
      return res.status(404).json({ mensaje: 'No tienes ninguna caja abierta' });
    }
    res.json(caja);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al consultar la caja actual', error: error.message });
  }
};

// 3. Cerrar caja diaria (Cálculo de totales, efectivo esperado y diferencias)
const cerrarCaja = async (req, res) => {
  try {
    const { efectivoContado } = req.body;
    const caja = await Caja.findById(req.params.id);

    if (!caja || caja.estado !== 'ABIERTA') {
      return res.status(404).json({ mensaje: 'Caja no encontrada o ya está cerrada' });
    }

    // Buscar todos los pagos válidos asociados a esta caja
    const pagos = await Pago.find({ caja: caja._id, estado: 'REGISTRADO' });

    let totalEfectivo = 0;
    let totalTransferencias = 0;
    let totalTarjeta = 0;

    pagos.forEach(pago => {
      if (pago.metodoPago === 'EFECTIVO') totalEfectivo += pago.monto;
      if (pago.metodoPago === 'TRANSFERENCIA') totalTransferencias += pago.monto;
      if (pago.metodoPago === 'TARJETA') totalTarjeta += pago.monto;
    });

    const totalIngresos = totalEfectivo + totalTransferencias + totalTarjeta;
    const efectivoEsperado = caja.montoInicial + totalEfectivo;
    const diferencia = efectivoContado - efectivoEsperado;

    caja.totalEfectivo = totalEfectivo;
    caja.totalTransferencias = totalTransferencias;
    caja.totalTarjeta = totalTarjeta;
    caja.totalIngresos = totalIngresos;
    caja.efectivoEsperado = efectivoEsperado;
    caja.efectivoContado = efectivoContado;
    caja.diferencia = diferencia;
    caja.fechaCierre = new Date();
    caja.estado = 'CERRADA';

    await caja.save();
    res.json({ mensaje: 'Caja cerrada exitosamente', caja });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al cerrar la caja', error: error.message });
  }
};


// --- MÓDULO DE PAGOS ---

// 4. Registrar un pago o abono
const registrarPago = async (req, res) => {
  try {
    const { citaId, monto, metodoPago } = req.body;

    const cita = await Cita.findById(citaId);
    if (!cita) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }

    // Verificar que el usuario tenga una caja abierta (RN-20)
    const cajaAbierta = await Caja.findOne({ usuarioResponsable: req.usuario.id, estado: 'ABIERTA' });
    if (!cajaAbierta) {
      return res.status(400).json({ mensaje: 'Debe tener una caja abierta para registrar pagos' });
    }

    // Validar monto mayor a cero (RN-16)
    if (monto <= 0) {
      return res.status(400).json({ mensaje: 'El monto del pago debe ser mayor a cero' });
    }

    // Calcular pagos válidos previos para esta cita
    const pagosPrevios = await Pago.find({ cita: citaId, estado: 'REGISTRADO' });
    const totalPagadoPrevio = pagosPrevios.reduce((acc, p) => acc + p.monto, 0);

    // Validar que el total pagado no supere el costo de la cita (RN-17)
    if (totalPagadoPrevio + monto > cita.precioRegistrado) {
      return res.status(400).json({ 
        mensaje: `El monto excede el saldo pendiente. Costo cita: Q${cita.precioRegistrado}, Pagado previo: Q${totalPagadoPrevio}` 
      });
    }

    // Generar número de comprobante único interno
    const numeroComprobante = `COMP-${Date.now()}`;

    const nuevoPago = new Pago({
      numeroComprobante,
      paciente: cita.paciente,
      cita: citaId,
      caja: cajaAbierta._id,
      monto,
      metodoPago,
      usuarioRegistro: req.usuario.id,
      estado: 'REGISTRADO'
    });

    await nuevoPago.save();
    res.status(201).json({ mensaje: 'Pago registrado con éxito', pago: nuevoPago });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar el pago', error: error.message });
  }
};

// 5. Consultar saldo pendiente de una cita
const consultarSaldoCita = async (req, res) => {
  try {
    const { citaId } = req.params;
    const cita = await Cita.findById(citaId);
    if (!cita) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }

    const pagos = await Pago.find({ cita: citaId, estado: 'REGISTRADO' });
    const totalPagado = pagos.reduce((acc, p) => acc + p.monto, 0);
    const saldoPendiente = cita.precioRegistrado - totalPagado;

    let estadoFinanciero = 'PENDIENTE';
    if (totalPagado > 0 && saldoPendiente > 0) estadoFinanciero = 'PARCIAL';
    if (saldoPendiente <= 0) estadoFinanciero = 'PAGADO';

    res.json({
      costoTotal: cita.precioRegistrado,
      totalPagado,
      saldoPendiente,
      estadoFinanciero,
      pagos
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al calcular saldo', error: error.message });
  }
};

// 6. Anular un pago (solo si pertenece a caja abierta - RN-21)
const anularPago = async (req, res) => {
  try {
    const { motivoAnulacion } = req.body;
    const pago = await Pago.findById(req.params.id).populate('caja');

    if (!pago) {
      return res.status(404).json({ mensaje: 'Pago no encontrado' });
    }

    if (pago.caja.estado === 'CERRADA') {
      return res.status(400).json({ mensaje: 'No se pueden anular pagos pertenecientes a cajas cerradas' });
    }

    pago.estado = 'ANULADO';
    pago.motivoAnulacion = motivoAnulacion || 'Sin motivo especificado';
    await pago.save();

    res.json({ mensaje: 'Pago anulado correctamente', pago });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al anular el pago', error: error.message });
  }
};

module.exports = {
  abrirCaja,
  obtenerCajaActual,
  cerrarCaja,
  registrarPago,
  consultarSaldoCita,
  anularPago
};