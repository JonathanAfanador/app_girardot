const reservaModel = require('../models/reserva.model');

// Crear reserva
const createReserva = async (req, res) => {
  try {
    // Verificar reserva existente
    if (await reservaModel.checkReservaExistente(req.usuario.id, req.body.id_negocio)) {
      return res.status(400).json({ 
        error: 'Ya tienes una reserva pendiente en este negocio',
        code: 'RESERVA_DUPLICADA'
      });
    }

    const reservaData = {
      ...req.body,
      id_usuario: req.usuario.id
    };

    const nuevaReserva = await reservaModel.createReserva(reservaData);
    res.status(201).json({
      ...nuevaReserva,
      mensaje: 'Reserva creada exitosamente'
    });
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(500).json({ 
      error: 'Error al crear reserva',
      details: process.env.NODE_ENV === 'development' ? error.message : null,
      code: 'ERROR_RESERVA'
    });
  }
};

// Obtener reservas de usuario
const getReservasUsuario = async (req, res) => {
  try {
    // Verificar que el usuario solo vea sus propias reservas
    if (parseInt(req.params.id_usuario) !== req.usuario.id && req.usuario.rol !== 'administrador') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    const reservas = await reservaModel.getReservasByUsuario(req.params.id_usuario);
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener reservas',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Actualizar estado de reserva
const updateReserva = async (req, res) => {
  try {
    const { estado } = req.body;
    const reservaActualizada = await reservaModel.updateReservaStatus(
      req.params.id_reserva,
      estado
    );

    if (!reservaActualizada) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    res.json(reservaActualizada);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al actualizar reserva',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

module.exports = {
  createReserva,
  getReservasUsuario,
  updateReserva
};