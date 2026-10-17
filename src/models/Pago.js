const mongoose = require('mongoose');

const pagoSchema = new mongoose.Schema({
  numeroComprobante: { type: String, required: true, unique: true },
  paciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
  cita: { type: mongoose.Schema.Types.ObjectId, ref: 'Cita', required: true },
  caja: { type: mongoose.Schema.Types.ObjectId, ref: 'Caja', required: true },
  monto: { type: Number, required: true },
  metodoPago: { type: String, enum: ['EFECTIVO', 'TRANSFERENCIA', 'TARJETA'], required: true },
  usuarioRegistro: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  estado: { type: String, enum: ['REGISTRADO', 'ANULADO'], default: 'REGISTRADO' },
  motivoAnulacion: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pago', pagoSchema);