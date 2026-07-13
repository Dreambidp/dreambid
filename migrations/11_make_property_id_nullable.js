export const up = async (pool) => {
  try {
    await pool.query(`
      ALTER TABLE enquiries
      ALTER COLUMN property_id DROP NOT NULL;
    `);
    console.log('✓ enquiries.property_id is now nullable');
  } catch (error) {
    if (error.code === '42703' || error.message.includes('column "property_id" of relation "enquiries" does not exist')) {
      console.log('✓ property_id column not found or already migrated');
      return;
    }
    throw error;
  }
};

export const down = async (pool) => {
  try {
    await pool.query(`
      ALTER TABLE enquiries
      ALTER COLUMN property_id SET NOT NULL;
    `);
    console.log('✓ enquiries.property_id set back to NOT NULL');
  } catch (error) {
    console.error('Error reverting property_id nullability:', error);
    throw error;
  }
};

export default { up, down };
