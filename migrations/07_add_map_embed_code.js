import pool from '../config/database.js';

export const up = async () => {
  try {
    // Add map_embed_code column to properties table
    await pool.query(`
      ALTER TABLE properties
      ADD COLUMN IF NOT EXISTS map_embed_code TEXT;
    `);
    
    console.log('✓ Migration: Added map_embed_code column to properties table (if needed)');
  } catch (error) {
    if (error.message.includes('already exists') || error.message.includes('duplicate column')) {
      console.log('ℹ️ Migration notice: map_embed_code column already exists');
    } else {
      console.error('Migration error:', error);
      throw error;
    }
  }
};

export const down = async () => {
  try {
    await pool.query(`
      ALTER TABLE properties
      DROP COLUMN IF EXISTS map_embed_code;
    `);
    
    console.log('✓ Migration rolled back: map_embed_code column removed');
  } catch (error) {
    console.error('Migration rollback error:', error);
    throw error;
  }
};
