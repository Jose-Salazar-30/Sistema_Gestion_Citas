const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Usuario = require('./src/models/Usuario');
const Servicio = require('./src/models/Servicio');
const Paciente = require('./src/models/Paciente');
const Cita = require('./src/models/Cita');
const Caja = require('./src/models/Caja');
const Pago = require('./src/models/Pago');

const poblarBaseDeDatos = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB para poblar datos completos...');

    // Limpiar base de datos
    await Usuario.deleteMany({});
    await Servicio.deleteMany({});
    await Paciente.deleteMany({});
    await Cita.deleteMany({});
    await Caja.deleteMany({});
    await Pago.deleteMany({});

    // 1. Usuarios
    const passHash = await bcrypt.hash('admin123', 10);
    const admin = await Usuario.create({
      nombre: 'Administrador Principal',
      correo: 'admin@sigca.com',
      password: passHash,
      rol: 'ADMINISTRADOR',
      estado: true
    });

    const recepcionista = await Usuario.create({
      nombre: 'María López (Recepción)',
      correo: 'recepcion@sigca.com',
      password: passHash,
      rol: 'RECEPCIONISTA',
      estado: true
    });

    const profesional = await Usuario.create({
      nombre: 'Dr. Carlos Mendoza',
      correo: 'dr.mendoza@sigca.com',
      password: passHash,
      rol: 'PROFESIONAL',
      estado: true
    });

    console.log('✅ 3 Usuarios creados (Admin, Recepción, Profesional)');

    // 2. Servicios
    const s1 = await Servicio.create({
      nombre: 'Consulta Psicológica General',
      descripcion: 'Evaluación y sesión terapéutica individual',
      duracionMinutos: 60,
      precio: 350,
      estado: 'ACTIVO'
    });

    const s2 = await Servicio.create({
      nombre: 'Terapia de Pareja',
      descripcion: 'Sesión enfocada en resolución de conflictos y comunicación',
      duracionMinutos: 90,
      precio: 500,
      estado: 'ACTIVO'
    });

    console.log('✅ Servicios iniciales creados');

    // 3. Pacientes
    const p1 = await Paciente.create({
      nombres: 'Juan José',
      apellidos: 'Pérez Gómez',
      fechaNacimiento: '1995-04-12',
      sexo: 'M',
      telefono: '55551234',
      direccion: 'Ciudad de Guatemala',
      estado: 'ACTIVO'
    });

    const p2 = await Paciente.create({
      nombres: 'Ana Lucía',
      apellidos: 'Martínez Ruiz',
      fechaNacimiento: '2001-08-25',
      sexo: 'F',
      telefono: '55555678',
      direccion: 'Mixco, Guatemala',
      estado: 'ACTIVO'
    });

    console.log('✅ Pacientes iniciales creados');

    // 4. Citas
    const c1 = await Cita.create({
      paciente: p1._id,
      servicio: s1._id,
      profesional: profesional._id,
      fecha: new Date(),
      horaInicio: '09:00',
      horaFin: '10:00',
      precioRegistrado: 350,
      estado: 'PENDIENTE',
      observacionesAdministrativas: 'Cita de primera vez'
    });

    console.log('✅ Cita inicial creada');

    mongoose.connection.close();
    console.log('🎉 ¡Base de datos poblada exitosamente al 100%!');
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
    process.exit(1);
  }
};

poblarBaseDeDatos();