const mongoose = require('mongoose');

const contenidoInstitucionalSchema = new mongoose.Schema({
  seccion: { type: String, required: true, unique: true }, // 'mision', 'vision', 'corporativo', etc.
  titulo: { type: String, required: true },
  contenido: { type: String, required: true },
  imagenUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('ContenidoInstitucional', contenidoInstitucionalSchema);