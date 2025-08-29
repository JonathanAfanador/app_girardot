const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoria.controller');

// Público
router.get('/', categoriaController.listarCategorias);

module.exports = router;