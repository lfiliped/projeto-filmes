const mongoose = require('mongoose');

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  }
}

module.exports = connectDB;