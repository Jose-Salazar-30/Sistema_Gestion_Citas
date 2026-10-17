const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
  paciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
  servicio: { type: mongoose.Schema.Types.ObjectId, ref: 'Servicio', required: true },
  profesional: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  fecha: { type: Date, required: true },
  horaInicio: { type: String, required: true }, // Formato "HH:mm"
  horaFin: { type: String, required: true },    // Calculado automáticamente con la duración
  precioRegistrado: { type: Number, required: true }, // Precio congelado del servicio
  estado: { 
    type: String, 
    enum: ['PENDIENTE', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA'], 
    default: 'PENDIENTE' 
  },
  observacionesAdministrativas: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cita', citaSchema);