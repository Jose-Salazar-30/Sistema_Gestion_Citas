const mongoose = require('mongoose');

const responsableSchema = new mongoose.Schema({
  fotografia: { type: String, default: '' },
  nombres: { type: String, required: true },
  apellidos: { type: String, required: true },
  parentesco: { type: String, required: true },
  telefono: { type: String, required: true },
  correo: { type: String, required: true },
  direccion: { type: String, required: true },
  pacientesAsociados: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Paciente' 
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Responsable', responsableSchema);