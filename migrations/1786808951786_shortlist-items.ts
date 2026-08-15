import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(
        `CREATE TABLE shortlist_items (
        id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        applicant_id uuid REFERENCES applicants(id) NOT NULL,
        job_id       uuid REFERENCES jobs(id) NOT NULL,
        created_at   timestamptz NOT NULL DEFAULT now(),
        UNIQUE(applicant_id, job_id)
        );`
    );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(`DROP TABLE shortlist_items;`);
}
