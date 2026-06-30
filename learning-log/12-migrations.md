# Migration Order & Column Addition

## Question 1: Why must `down` for `create_applications` drop before `create_jobs`?

Other tables depend on the `jobs` table, which is why before dropping it we need to make sure no one is left with dependence on it to left data hanging (ghost data). 

So we go in **reverse dependency order** in a manner that no current table in the sequence has any dependency. Conversely, when we create tables (`up` migrations), we cannot first create the dependent tables without creating the ones they depend on.

---

## Question 2: Add `jobs.salary_range jsonb` column

Your team adds a new column next week: `jobs.salary_range jsonb`. Write the `up` and `down` bodies for that migration (two `pgm.sql(...)` calls).

```typescript
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