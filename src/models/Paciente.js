const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
  fotografia: { type: String, default: '' },
  nombres: { type: String, required: true },
  apellidos: { type: String, required: true },
  fechaNacimiento: { type: Date, required: true },
  sexo: { type: String, enum: ['M', 'F'], required: true },
  telefono: { type: String, required: true },
  direccion: { type: String, required: true },
  fechaInicioProceso: { type: Date, default: Date.now },
  observacionesAdministrativas: { type: String, default: '' },
  estado: { type: String, enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Paciente', pacienteSchema);