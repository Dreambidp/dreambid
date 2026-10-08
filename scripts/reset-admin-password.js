import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

const adminEmail = process.env.ADMIN_EMAIL;
const newPassword = process.env.NEW_ADMIN_PASSWORD;

async function run() {
  try {
    if (!adminEmail || !newPassword) {
      console.error('Please set ADMIN_EMAIL and NEW_ADMIN_PASSWORD environment variables to update the admin password.');
      process.exit(1);
    }

    const hash = await bcrypt.hash(newPassword, 10);
    const res = await pool.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id, email',
      [hash, adminEmail]
    );

    if (res.rows.length === 0) {
      console.log(`No user with email ${adminEmail} found`);
    } else {
      console.log('Password updated for', res.rows[0].email);
    }
  } catch (err) {
    console.error('Error updating password:', err.message || err);
  } finally {
    await pool.end();
  }
}

run();
