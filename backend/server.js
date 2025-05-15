require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const seedAdminUser = require('./src/seed/admin');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./src/middleware/errorHandler');

const filmesRoutes = require('./src/routes/filmes');
const comentariosRoutes = require('./src/routes/comentarios');
const authRoutes = require('./src/routes/authRoutes');
const ratingsRoutes = require('./src/routes/ratings');

const app = express();
connectDB().then(seedAdminUser);

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001', 
      'https://filmes-backend-g1tv.onrender.com',// Temporarily allow 3001 until port is fixed
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/register', authLimiter);
app.use('/api/login', authLimiter);

app.use('/api', authRoutes);
app.use('/api/filmes', filmesRoutes);
app.use('/api/comentarios', comentariosRoutes);
app.use('/api/ratings', ratingsRoutes);

app.use((_req, res) => res.status(404).json({ message: 'Rota não encontrada.' }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
  console.log('Rotas carregadas: /api/comentarios, /api/filmes, /api/ratings, /api (auth)');
});