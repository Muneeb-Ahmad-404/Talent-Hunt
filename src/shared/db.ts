import { Client } from "pg";

let client: Client | null = null;
let _queryCount = 0;

export function resetQueryCount() { _queryCount = 0; }
export function getQueryCount() { return _queryCount; }

function getDbClient() {
  if (!client) {
    client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    client.connect();
  }
  return client;
}

export const db = getDbClient();