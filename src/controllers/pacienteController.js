const Paciente = require('../models/Paciente');

const obtenerPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.find();
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener pacientes', error: error.message });
  }
};

const obtenerPacientePorId = async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.id);
    if (!paciente) {
      return res.status(404).json({ mensaje: 'Paciente no encontrado' });
    }
    res.json(paciente);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener paciente', error: error.message });
  }
};

const registrarPaciente = async (req, res) => {
  try {
    const nuevoPaciente = new Paciente(req.body);
    await nuevoPaciente.save();
    res.status(201).json({ mensaje: 'Paciente registrado exitosamente', paciente: nuevoPaciente });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar paciente', error: error.message });
  }
};

const actualizarPaciente = async (req, res) => {
  try {
    const pacienteActualizado = await Paciente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pacienteActualizado) {
      return res.status(404).json({ mensaje: 'Paciente no encontrado' });
    }
    res.json({ mensaje: 'Paciente actualizado con éxito', paciente: pacienteActualizado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar paciente', error: error.message });
  }
};

// Desactivar mediante eliminación lógica (RF-03)
const cambiarEstadoPaciente = async (req, res) => {
  try {
    const { estado } = req.body; // 'ACTIVO' o 'INACTIVO'
    const paciente = await Paciente.findByIdAndUpdate(req.params.id, { estado }, { new: true });
    if (!paciente) {
      return res.status(404).json({ mensaje: 'Paciente no encontrado' });
    }
    res.json({ mensaje: `Estado del paciente cambiado a ${estado}`, paciente });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al cambiar estado', error: error.message });
  }
};

module.exports = { 
  obtenerPacientes, 
  obtenerPacientePorId, 
  registrarPaciente, 
  actualizarPaciente, 
  cambiarEstadoPaciente 
};