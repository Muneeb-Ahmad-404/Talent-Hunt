import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    CREATE TABLE applicants (
      id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id    uuid        NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      headline   text,
      bio        text,
      skills     jsonb       NOT NULL DEFAULT '{}',
      location   text,
      attributes jsonb       NOT NULL DEFAULT '{}',
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`DROP TABLE applicants;`);
}