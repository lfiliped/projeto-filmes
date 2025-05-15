require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./utils/connectDB');
const seedAdminUser = require('./seed/admin');

// Conectar ao banco de dados e iniciar servidor
connectDB().then(async () => {
  // Realiza o seed do utilizador admin (se não existir)
  await seedAdminUser();

  // Middleware para interpretar JSON
  app.use(express.json());

  // Definição de rotas da API
  const authRoutes = require('./routes/authRoutes');
  app.use('/api', authRoutes);

  // Porta e start do servidor
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
  });
}).catch(err => {
  console.error('Falha ao iniciar o servidor:', err);
});
