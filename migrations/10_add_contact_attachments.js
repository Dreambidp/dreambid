/**
 * Migration: Add attachment_files column to enquiries for contact-form uploads
 */
export const up = async (pool) => {
  try {
    await pool.query(`
      ALTER TABLE enquiries
      ADD COLUMN IF NOT EXISTS attachment_files JSONB DEFAULT '[]'::jsonb;
    `);

    console.log('✓ attachment_files column added to enquiries');
  } catch (error) {
    if (error.code !== 'DUPLICATE_COLUMN' && !error.message.includes('already exists')) {
      throw error;
    }
    console.log('✓ attachment_files column already exists');
  }
};

export const down = async (pool) => {
  try {
    await pool.query('ALTER TABLE enquiries DROP COLUMN IF EXISTS attachment_files;');
    console.log('✓ attachment_files column dropped');
  } catch (error) {
    console.error('Error dropping attachment_files column:', error);
    throw error;
  }
};

export default { up, down };
