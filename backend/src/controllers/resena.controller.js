const resenaModel = require('../models/resena.model');

// Crear reseña
const createResena = async (req, res) => {
  try {
    const resenaData = {
      ...req.body,
      id_usuario: req.usuario.id // ID del usuario autenticado
    };
    
    const nuevaResena = await resenaModel.createResena(resenaData);
    res.status(201).json(nuevaResena);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al crear reseña',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Obtener reseñas de negocio
const getResenasNegocio = async (req, res) => {
  try {
    const resenas = await resenaModel.getResenasByNegocio(req.params.id_negocio);
    res.json(resenas);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener reseñas',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

const getResenasEvento = async (req, res) => {
  try {
    const resenas = await resenaModel.getResenasByEvento(req.params.id_evento);
    res.json(resenas);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener reseñas del evento',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Actualizar reseña
const updateResena = async (req, res) => {
  try {
    const resenaActualizada = await resenaModel.updateResena(
      req.params.id_resena, 
      req.body
    );
    
    if (!resenaActualizada) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }
    
    res.json(resenaActualizada);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al actualizar reseña',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Eliminar reseña
const deleteResena = async (req, res) => {
  try {
    const deleted = await resenaModel.deleteResena(req.params.id_resena);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Reseña no encontrada' });
    }
    
    res.json({ message: 'Reseña eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al eliminar reseña',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

module.exports = {
  createResena,
  getResenasNegocio,
  getResenasEvento,
  updateResena,
  deleteResena
};