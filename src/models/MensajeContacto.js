const mongoose = require('mongoose');

const mensajeContactoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true },
  telefono: { type: String, required: true },
  asunto: { type: String, required: true },
  mensaje: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('MensajeContacto', mensajeContactoSchema);