const categoriaModel = require('../models/categoria.model');

const listarCategorias = async (req, res) => {
  try {
    const categorias = await categoriaModel.getAllCategorias();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener categorías',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

module.exports = {
  listarCategorias
};