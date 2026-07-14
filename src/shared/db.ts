import { Client } from "pg";

let client: Client | null = null;

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

