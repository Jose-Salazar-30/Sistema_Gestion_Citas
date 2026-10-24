const Usuario = require("../models/Usuario");
const bcrypt = require('bcryptjs');

exports.obtenerUusuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('-password');
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).send({ msg: 'Error al obtener usuarios', error: error.message });
    }
};

exports.crearUsuario = asyn(req, res) => {
    try {
        const { nombres, apellidos, email, password, rol } = req.body;

        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).send({ msg: 'El usuario ya existe' });
        }

        usuario = new Usuario({ nombres, apellidos, email, password, rol });

        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);

        await usuario.save();

        res.status(201).json({ msg: 'Usuario creado exitosamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear el usuario', error: erro.message });
    }
};

exports.actualizarUsuario = async (req, res) => {
    try {
        const { nombres, apellidos, rol, estado } = req.body;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            req.params.id,
            { nombres, apellidos, rol, estado },
            { new: true }
        ).select('-password');

        if (!usuarioActualizado) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        res.status(200).json({ msg: 'Usuario actualizado', usuario: usuarioActualizado });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar usuario', error: error.message });
    }

};