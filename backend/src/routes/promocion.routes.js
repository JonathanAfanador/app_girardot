const express = require('express');
const router = express.Router();
const promocionController = require('../controllers/promocion.controller');
const { authenticateRole, validateRequest } = require('../middlewares/auth');
const { promocionSchema, promocionUpdateSchema } = require('../utils/validation');

// Crear promoción (dueño o admin)
router.post(
  '/',
  authenticateRole('dueño_negocio'),
  validateRequest(promocionSchema),
  promocionController.createPromocion
);

// Obtener promociones de un negocio (público)
router.get('/negocio/:id_negocio', promocionController.getPromociones);

// Actualizar promoción (dueño o admin)
router.put(
  '/:id_promocion',
  authenticateRole('dueño_negocio'),
  validateRequest(promocionUpdateSchema),
  promocionController.updatePromocion
);

// Eliminar promoción (dueño o admin)
router.delete(
  '/:id_promocion',
  authenticateRole('dueño_negocio'),
  promocionController.deletePromocion
);

module.exports = router;