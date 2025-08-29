const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateRequest } = require('../middlewares/auth');
const { authenticateRole } = require('../middlewares/auth');
const { authSchema, loginSchema } = require('../utils/validation');

// Ruta de login con validación
router.post('/login', validateRequest(loginSchema), authController.login);

// Ruta de registro con validación
router.post('/register', validateRequest(authSchema), authController.register);

router.get(
  '/me',
  authenticateRole('cliente', 'dueño_negocio', 'administrador'), // Solo usuarios autenticados
  authController.getCurrentUser
);


module.exports = router;