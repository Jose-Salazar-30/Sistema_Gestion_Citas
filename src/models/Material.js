const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  tipo: { type: String, required: true },
  enlaceRecurso: { type: String, required: true },
  estado: { type: String, enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' }
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);