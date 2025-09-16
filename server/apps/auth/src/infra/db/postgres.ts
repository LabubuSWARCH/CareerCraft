import { Pool } from 'pg';
import { SQL_URL } from '../../config';

export const pool = new Pool({
  connectionString: SQL_URL,
});

export async function query(text: string, params?: unknown[]) {
  return pool.query(text, params);
}
