const mongoose = require('mongoose');

const solicitudCitaSchema = new mongoose.Schema({
  nombreSolicitante: { type: String, required: true },
  correo: { type: String, required: true },
  telefono: { type: String, required: true },
  servicioSolicitado: { type: String, required: true },
  fechaPreferida: { type: Date, required: true },
  mensajeAdicional: { type: String, default: '' },
  estado: { type: String, enum: ['PENDIENTE', 'ATENDIDA', 'RECHAZADA'], default: 'PENDIENTE' },
  citaGenerada: { type: mongoose.Schema.Types.ObjectId, ref: 'Cita', default: null }
}, { timestamps: true });

module.exports = mongoose.model('SolicitudCita', solicitudCitaSchema);