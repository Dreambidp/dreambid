import bcrypt from 'bcryptjs';

const password = process.argv[2] || process.env.PASSWORD;

async function generateHash() {
  if (!password) {
    console.error('Usage: node generate-hash.js <password>');
    process.exit(1);
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log('Password:', password);
  console.log('Hash:', hash);
}

generateHash();
