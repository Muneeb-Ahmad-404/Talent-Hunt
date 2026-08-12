import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    -- 1. Add the new status column
    ALTER TABLE companies ADD COLUMN status TEXT DEFAULT 'pending';
    
    -- 2. Backfill status based on existing boolean columns
    UPDATE companies SET status = CASE
      WHEN verified = true AND suspended = false THEN 'verified'
      WHEN suspended = true THEN 'suspended'
      ELSE 'pending'
    END;
    
    -- 3. Add CHECK constraint
    ALTER TABLE companies ADD CONSTRAINT companies_status_check
      CHECK (status IN ('pending', 'verified', 'suspended'));
    
    -- 4. Make status NOT NULL
    ALTER TABLE companies ALTER COLUMN status SET NOT NULL;
    
    -- 5. Drop old columns (after verifying everything works)
    ALTER TABLE companies DROP COLUMN verified;
    ALTER TABLE companies DROP COLUMN suspended;
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    -- Re-add old columns
    ALTER TABLE companies ADD COLUMN verified BOOLEAN DEFAULT false;
    ALTER TABLE companies ADD COLUMN suspended BOOLEAN DEFAULT false;
    
    -- Backfill from status
    UPDATE companies SET 
      verified = (status = 'verified'),
      suspended = (status = 'suspended');
    
    -- Drop status column
    ALTER TABLE companies DROP COLUMN status;
  `);
}