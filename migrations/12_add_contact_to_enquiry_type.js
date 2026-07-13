export const up = async (pool) => {
  try {
    // Drop the old check constraint
    await pool.query(`
      ALTER TABLE enquiries
      DROP CONSTRAINT enquiries_enquiry_type_check;
    `);

    // Add the new check constraint with 'contact' included
    await pool.query(`
      ALTER TABLE enquiries
      ADD CONSTRAINT enquiries_enquiry_type_check
      CHECK (enquiry_type IN ('general', 'bid', 'inspection', 'complaint', 'contact'));
    `);

    console.log('✓ enquiries.enquiry_type check constraint updated to include "contact"');
  } catch (error) {
    if (error.message.includes('does not exist')) {
      console.log('✓ enquiry_type check constraint not found or already migrated');
      return;
    }
    throw error;
  }
};

export const down = async (pool) => {
  try {
    // Drop the new constraint
    await pool.query(`
      ALTER TABLE enquiries
      DROP CONSTRAINT enquiries_enquiry_type_check;
    `);

    // Restore the old constraint without 'contact'
    await pool.query(`
      ALTER TABLE enquiries
      ADD CONSTRAINT enquiries_enquiry_type_check
      CHECK (enquiry_type IN ('general', 'bid', 'inspection', 'complaint'));
    `);

    console.log('✓ enquiries.enquiry_type check constraint reverted');
  } catch (error) {
    console.error('Error reverting enquiry_type constraint:', error);
    throw error;
  }
};

export default { up, down };
