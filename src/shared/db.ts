import { Client } from "pg";
import { Pool } from 'pg';
import { config } from './config';

let client: Client | null = null;
let _queryCount = 0;

export function resetQueryCount() { _queryCount = 0; }
export function getQueryCount() { return _queryCount; }


export const pool = new Pool({ connectionString: config.DATABASE_URL });

export const db = { query: pool.query.bind(pool) };