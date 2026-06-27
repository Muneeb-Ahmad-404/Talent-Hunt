The down function for create_applications must drop the table before create_jobs can also be dropped. Why — and what does this tell you about the order in which down migrations must run relative to up migrations?
Other tables depend on the jobs table thats why before dropping it we need to make sure no one is left with dependence on it to left data hanging(ghost data). So we go in reverse dependency order in a manner that no current table in the sequence have any dependeny. Conversely when we create tables (up migrations) we cannot first create the dependent tables without creating the ones they depend on.

Your team adds a new column next week: jobs.salary_range jsonb. Write the up and down bodies for that migration (two pgm.sql(...) calls).

import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    ALTER TABLE jobs 
    ADD COLUMN salary_range jsonb DEFAULT '{}'::jsonb NOT NULL;
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    ALTER TABLE jobs 
    DROP COLUMN salary_range;
  `);
}