const express = require('express');
const router = express.Router();
const negocioController = require('../controllers/negocio.controller');
const imagenController = require('../controllers/imagen.controller');
const { authenticateRole, authenticateOwnerOrAdmin } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/auth');
const { negocioSchema } = require('../utils/validation');

// Obtener todos los negocios (público)
router.get('/', negocioController.getAllNegocios);

router.get('/mis-negocios', authenticateRole('dueño_negocio'), negocioController.getMyBusinesses);

// Obtener negocio específico (público)
router.get('/:id', negocioController.getNegocioById);



// Crear nuevo negocio (solo dueños)
router.post(
  '/',
  authenticateRole('dueño_negocio'),
  validateRequest(negocioSchema),
  negocioController.createNegocio
);

// RUTA PARA SUBIR IMÁGENES (separada)
router.post(
  '/:id/imagenes',
  authenticateRole('dueño_negocio'),
  imagenController.agregarImagen
);

// Actualizar negocio (dueño o admin)
router.put('/:id',
  authenticateRole('dueño_negocio'),
  validateRequest(negocioSchema),
  negocioController.updateNegocio
);

// Eliminar negocio (solo admin y dueño)
router.delete(
  '/:id',
  authenticateOwnerOrAdmin,
  negocioController.deleteNegocio
);

// RUTA PARA ELIMINAR IMÁGENES (separada)
router.delete(
  '/:id/imagenes/:id_imagen',
  authenticateRole('dueño_negocio'),
  imagenController.eliminarImagen
);

module.exports = router;