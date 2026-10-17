const mongoose = require('mongoose');

const cajaSchema = new mongoose.Schema({
  usuarioResponsable: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  montoInicial: { type: Number, required: true },
  totalEfectivo: { type: Number, default: 0 },
  totalTransferencias: { type: Number, default: 0 },
  totalTarjeta: { type: Number, default: 0 },
  totalIngresos: { type: Number, default: 0 },
  efectivoEsperado: { type: Number, default: 0 },
  efectivoContado: { type: Number, default: 0 },
  diferencia: { type: Number, default: 0 },
  fechaApertura: { type: Date, default: Date.now },
  fechaCierre: { type: Date, default: null },
  estado: { type: String, enum: ['ABIERTA', 'CERRADA'], default: 'ABIERTA' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Caja', cajaSchema);