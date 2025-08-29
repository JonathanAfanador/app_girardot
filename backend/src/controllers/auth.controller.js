const pool = require('../config/db');
const { generateToken, hashPassword, comparePassword } = require('../utils/auth');

const login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;
    
    const query = 'SELECT * FROM Usuario WHERE correo = $1';
    const { rows } = await pool.query(query, [correo]);
    
    if (!rows[0] || !(await comparePassword(contraseña, rows[0].contraseña))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = rows[0];
    const token = generateToken(user.id_usuario, user.tipo_usuario);

    res.json({
      id: user.id_usuario,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.tipo_usuario,
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const register = async (req, res) => {
  try {
    const { nombre, correo, contraseña, telefono, tipo_usuario } = req.body;
    
    // Verificar si el correo ya existe
    const existQuery = 'SELECT * FROM Usuario WHERE correo = $1';
    const { rows } = await pool.query(existQuery, [correo]);
    
    if (rows[0]) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    const hashedPassword = await hashPassword(contraseña);
    
    const insertQuery = `
      INSERT INTO Usuario (nombre, correo, contraseña, telefono, tipo_usuario)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;
    
    const values = [nombre, correo, hashedPassword, telefono, tipo_usuario];
    const result = await pool.query(insertQuery, values);
    
    const newUser = result.rows[0];
    const token = generateToken(newUser.id_usuario, newUser.tipo_usuario);

    res.status(201).json({
      id: newUser.id_usuario,
      nombre: newUser.nombre,
      correo: newUser.correo,
      rol: newUser.tipo_usuario,
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    // El middleware auth.js ya adjuntó el usuario a req.usuario
    res.json({
      id_usuario: req.usuario.id_usuario,
      nombre: req.usuario.nombre,
      correo: req.usuario.correo,
      tipo_usuario: req.usuario.tipo_usuario
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  login,
  register,
  getCurrentUser
};