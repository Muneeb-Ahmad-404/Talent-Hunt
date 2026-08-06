import { MigrationBuilder } from "node-pg-migrate"

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(`
        CREATE TABLE invitations (
            id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
            company_id  UUID         NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
            email       TEXT         NOT NULL,
            role        TEXT         NOT NULL CHECK (role IN ('owner', 'hr_manager', 'recruiter', 'hiring_manager')),
            token_hash  TEXT         NOT NULL UNIQUE,
            expires_at  TIMESTAMPTZ  NOT NULL,
            created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
            UNIQUE (company_id, email)
        );
        CREATE INDEX idx_invitations_token_hash ON invitations (token_hash);
        CREATE INDEX idx_invitations_expires_at ON invitations (expires_at);
    `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.sql(`
        DROP TABLE invitations;
    `);
}