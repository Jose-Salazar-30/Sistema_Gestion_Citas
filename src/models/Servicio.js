const mongoose = require('mongoose');

const servicioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  duracionMinutos: { type: Number, required: true }, // Duración en minutos
  precio: { type: Number, required: true },          // Precio en quetzales (Q)
  imagenUrl: { type: String, default: '' },
  estado: { type: String, enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Servicio', servicioSchema);