const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const tokenHeader = req.headers['authorization'];
  if (!tokenHeader) {
    return res.status(403).json({ mensaje: 'Token no proporcionado' });
  }

  const token = tokenHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ mensaje: 'Formato de token inválido' });
  }

  try {
    const cifrado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = cifrado;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};

const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: 'No tienes autorización para realizar esta acción' });
    }
    next();
  };
};

module.exports = { verificarToken, verificarRol };