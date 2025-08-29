require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors({
  origin: [
    'https://girardot-app-2.vercel.app', // URL de Vercel
    'http://localhost:5173' // Desarrollo local
  ],
  credentials: true
}));
app.use(express.json());

// ... después de los middlewares
const negocioRoutes = require('./routes/negocio.routes');
app.use('/api/negocios', negocioRoutes);

// ... después de otras rutas
const eventoRoutes = require('./routes/evento.routes');
app.use('/api/eventos', eventoRoutes);

const promocionRoutes = require('./routes/promocion.routes');
app.use('/api/promociones', promocionRoutes);

const categoriaRoutes = require('./routes/categoria.routes');
app.use('/api/categorias', categoriaRoutes);

const resenaRoutes = require('./routes/resena.routes');
app.use('/api/resenas', resenaRoutes);

const reservaRoutes = require('./routes/reserva.routes');
app.use('/api/reservas', reservaRoutes);

// ... después de los otros middlewares
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

// Rutas básicas
app.get('/', (req, res) => {
  res.send('API Girardot Funcionando');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});