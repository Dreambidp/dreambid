export async function up(pool) {
  await pool.query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS profile_photo_data BYTEA,
    ADD COLUMN IF NOT EXISTS profile_photo_mime_type VARCHAR(50) DEFAULT 'image/jpeg';
  `);
}

export async function down(pool) {
  await pool.query(`
    ALTER TABLE users
    DROP COLUMN IF EXISTS profile_photo_data,
    DROP COLUMN IF EXISTS profile_photo_mime_type;
  `);
}
