const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/evento.controller');
const { authenticateRole, authenticateOwnerOrAdmin } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/auth');
const { eventoSchema } = require('../utils/validation');

// Crear evento (dueño o admin)
router.post('/',
  authenticateRole('dueño_negocio'),
  validateRequest(eventoSchema),
  eventoController.createEvento
);

// Obtener eventos de un negocio (público)
router.get('/negocio/:id_negocio', eventoController.getEventos);

// Actualizar evento (dueño o admin)
router.put('/:id_evento',
  authenticateRole('dueño_negocio'),
  validateRequest(eventoSchema),
  eventoController.updateEvento
);

// Eliminar evento (solo admin)
router.delete('/:id_evento',
  authenticateOwnerOrAdmin, // Solo verifica autenticación
  eventoController.deleteEvento // La verificación de propiedad ocurre aquí
);

module.exports = router;