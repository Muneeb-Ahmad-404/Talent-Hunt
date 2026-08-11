import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS location TEXT;
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS employment_type TEXT;
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_min INTEGER;
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary_max INTEGER;
    
    -- Add check constraint for employment_type
    ALTER TABLE jobs ADD CONSTRAINT jobs_employment_type_check 
      CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'internship'));

    -- Add idx on created_at DESC and id DESC  
    CREATE INDEX IF NOT EXISTS jobs_company_created_idx
      ON jobs (company_id, created_at DESC, id DESC);
    
    ALTER TABLE jobs ALTER COLUMN description DROP NOT NULL;    
    `);

}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    ALTER TABLE jobs DROP COLUMN IF EXISTS location;
    ALTER TABLE jobs DROP COLUMN IF EXISTS employment_type;
    ALTER TABLE jobs DROP COLUMN IF EXISTS salary_min;
    ALTER TABLE jobs DROP COLUMN IF EXISTS salary_max;
  `);
}