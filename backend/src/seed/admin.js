const bcrypt = require('bcrypt');
const User = require('../models/User');

async function seedAdminUser() {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASS;
    if (!email || !password) {
      console.error('ADMIN_EMAIL ou ADMIN_PASS não definidas no ambiente.');
      return;
    }
    let adminUser = await User.findOne({ email });
    if (!adminUser) {
      const hashedPass = await bcrypt.hash(password, 10);
      adminUser = new User({
        name: 'Administrador',
        email: email,
        password: hashedPass,
        role: 'admin'
      });
      await adminUser.save();
      console.log(`Utilizador admin criado: ${email}`);
    } else {
      console.log('Utilizador admin já existe. Seed ignorado.');
    }
  } catch (error) {
    console.error('Erro ao criar utilizador admin:', error);
  }
}

module.exports = seedAdminUser;