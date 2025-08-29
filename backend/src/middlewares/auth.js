const { verifyToken } = require('../utils/auth');
const pool = require('../config/db');
const { authSchema, loginSchema, negocioSchema, eventoSchema } = require('../utils/validation');

// Middleware para verificar roles específicos (admin o rol requerido)
// backend/src/middlewares/auth.js
const authenticateRole = (...allowedRoles) => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Obtener usuario desde la BD
    const { rows } = await pool.query(
      'SELECT * FROM Usuario WHERE id_usuario = $1', 
      [decoded.id]
    );

    if (!rows[0]) return res.status(401).json({ error: 'Usuario no existe' });

    const user = rows[0];
    
    // Verificar rol
    if (
      !allowedRoles.includes(user.tipo_usuario) && 
      user.tipo_usuario !== 'administrador' // Admins tienen acceso total
    ) {
      return res.status(403).json({ error: 'Permisos insuficientes' });
    }

    // Adjuntar usuario al request
    req.usuario = {
      id: user.id_usuario,
      nombre: user.nombre,
      correo: user.correo,
      tipo_usuario: user.tipo_usuario
    };

    next();
  } catch (error) {
    res.status(401).json({ 
      error: 'Token inválido',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Middleware simplificado para dueños/admins (solo verifica autenticación)
const authenticateOwnerOrAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Verificar usuario básico
    const userQuery = 'SELECT id_usuario, tipo_usuario FROM Usuario WHERE id_usuario = $1';
    const { rows } = await pool.query(userQuery, [decoded.id]);
    
    if (!rows[0]) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // Adjuntar información mínima necesaria
    req.usuario = {
      id: rows[0].id_usuario,
      rol: rows[0].tipo_usuario
    };

    next();
  } catch (error) {
    res.status(401).json({ 
      error: 'Token inválido o expirado',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

const validateRequest = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400).json({ 
      error: 'Error de validación',
      details: error.details.map(d => d.message) 
    });
  }
};


module.exports = {
  authenticateRole,
  authenticateOwnerOrAdmin,
  validateRequest
};