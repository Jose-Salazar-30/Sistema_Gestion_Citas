const Cita = require('../models/Cita');
const Servicio = require('../models/Servicio');
const Paciente = require('../models/Paciente');

// Consultar todas las citas o filtrar
const obtenerCitas = async (req, res) => {
  try {
    const { profesional, fecha, estado } = req.query;
    let filtro = {};
    if (profesional) filtro.profesional = profesional;
    if (fecha) filtro.fecha = fecha;
    if (estado) filtro.estado = estado;

    const citas = await Cita.find(filtro)
      .populate('paciente', 'nombres apellidos')
      .populate('servicio', 'nombre precio')
      .populate('profesional', 'nombre correo');
    
    res.json(citas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener citas', error: error.message });
  }
};

// Programar una nueva cita
const programarCita = async (req, res) => {
  try {
    const { paciente, servicio, profesional, fecha, horaInicio, observacionesAdministrativas } = req.body;

    // 1. Validar que el paciente exista y esté activo (RN-03, RN-14)
    const pacienteEncontrado = await Paciente.findById(paciente);
    if (!pacienteEncontrado || pacienteEncontrado.estado !== 'ACTIVO') {
      return res.status(400).json({ mensaje: 'El paciente no existe o está inactivo' });
    }

    // 2. Validar que el servicio exista y esté activo (RN-03, RN-07)
    const servicioEncontrado = await Servicio.findById(servicio);
    if (!servicioEncontrado || servicioEncontrado.estado !== 'ACTIVO') {
      return res.status(400).json({ mensaje: 'El servicio no existe o está inactivo' });
    }

    // 3. Calcular hora de finalización usando la duración del servicio (RN-12)
    const [horas, minutos] = horaInicio.split(':').map(Number);
    const fechaInicioMinutos = horas * 60 + minutos;
    const fechaFinMinutos = fechaInicioMinutos + servicioEncontrado.duracionMinutos;
    
    const finHoras = Math.floor(fechaFinMinutos / 60).toString().padStart(2, '0');
    const finMinutos = (fechaFinMinutos % 60).toString().padStart(2, '0');
    const horaFin = `${finHoras}:${finMinutos}`;

    // 4. Validar que no existan citas traslapadas para el mismo profesional (RN-01)
    const citaTraslapada = await Cita.findOne({
      profesional,
      fecha,
      estado: { $ne: 'CANCELADA' },$or: [
        { horaInicio: { $lte: horaInicio }, horaFin: {$gt: horaInicio } },
        { horaInicio: { $lt: horaFin }, horaFin: {$gte: horaFin } }
      ]
    });

    if (citaTraslapada) {
      return res.status(400).json({ mensaje: 'El profesional ya tiene una cita programada en ese horario (Conflicto de traslape)' });
    }

    // 5. Crear la cita copiando el precio del servicio
    const nuevaCita = new Cita({
      paciente,
      servicio,
      profesional,
      fecha,
      horaInicio,
      horaFin,
      precioRegistrado: servicioEncontrado.precio,
      observacionesAdministrativas
    });

    await nuevaCita.save();
    res.status(201).json({ mensaje: 'Cita programada con éxito', cita: nuevaCita });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al programar cita', error: error.message });
  }
};

// Cambiar estado de la cita (Confirmar, Completar, Cancelar)
const cambiarEstadoCita = async (req, res) => {
  try {
    const { estado } = req.body; // 'CONFIRMADA', 'COMPLETADA', 'CANCELADA', 'PENDIENTE'
    const cita = await Cita.findById(req.params.id);
    if (!cita) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }

    // Reglas de negocio para estados (RN-05, RN-06)
    if (cita.estado === 'COMPLETADA' && estado === 'REPROGRAMAR') {
      return res.status(400).json({ mensaje: 'Las citas completadas no pueden reprogramarse' });
    }

    cita.estado = estado;
    await cita.save();
    res.json({ mensaje: `Cita actualizada a estado ${estado}`, cita });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar estado de la cita', error: error.message });
  }
};

module.exports = { obtenerCitas, programarCita, cambiarEstadoCita };