const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reserva.controller');
const { authenticateRole, validateRequest } = require('../middlewares/auth');
const { reservaSchema } = require('../utils/validation');


// Crear reserva (solo clientes)
router.post(
  '/',
  authenticateRole('cliente'),
  validateRequest(reservaSchema),
  reservaController.createReserva
);

// Obtener reservas de usuario
router.get(
  '/usuario/:id_usuario',
  authenticateRole('cliente'),
  reservaController.getReservasUsuario
);

// Actualizar estado (ej: cancelar)
router.patch(
  '/:id_reserva/estado',
  authenticateRole('cliente'),
  reservaController.updateReserva
);

module.exports = router;