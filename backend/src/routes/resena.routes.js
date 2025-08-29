const express = require('express');
const router = express.Router();
const resenaController = require('../controllers/resena.controller');
const { authenticateRole, validateRequest } = require('../middlewares/auth');
const { resenaSchema, resenaUpdateSchema } = require('../utils/validation');

// Crear reseña (solo clientes)
router.post(
  '/',
  authenticateRole('cliente'),
  validateRequest(resenaSchema),
  resenaController.createResena
);

// Obtener reseñas de negocio (público)
router.get('/negocio/:id_negocio', resenaController.getResenasNegocio);

router.get('/evento/:id_evento', resenaController.getResenasEvento);

// Actualizar reseña (solo autor)
router.put(
  '/:id_resena',
  authenticateRole('cliente'),
  validateRequest(resenaUpdateSchema),
  resenaController.updateResena
);

// Eliminar reseña (solo autor o admin)
router.delete(
  '/:id_resena',
  authenticateRole('cliente'),
  resenaController.deleteResena
);

module.exports = router;