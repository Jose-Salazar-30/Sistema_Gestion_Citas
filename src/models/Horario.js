const mongoose = require('mongoose');

const horarioSchema = new mongoose.Schema({
  diaSemana: { type: String, required: true }, // Ej: 'Lunes', 'Martes'
  horaInicio: { type: String, required: true }, // '08:00'
  horaFin: { type: String, required: true },    // '17:00'
  activo: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Horario', horarioSchema);