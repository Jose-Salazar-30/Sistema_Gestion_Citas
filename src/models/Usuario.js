const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { 
    type: String, 
    enum: ['ADMINISTRADOR', 'RECEPCIONISTA', 'PROFESIONAL'], 
    required: true 
  },
  estado: { type: Boolean, default: true }, // true = ACTIVO, false = INACTIVO
}, {
  timestamps: true
});

module.exports = mongoose.model('Usuario', usuarioSchema);