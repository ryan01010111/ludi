import { Pool, PoolClient } from 'pg';
import fs from 'fs';
import path from 'path';
import { camelCaseToSnakeCase } from './utils';

const pool = new Pool();

export default {
  async query(text: string, params: any[]) {
    // const start = Date.now();
    const res = await pool.query(text, params);
    // const duration = Date.now() - start;
    // console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  },

  async getClient<F extends (con: PoolClient) => Promise<any>>(cb: F): Promise<ReturnType<F>> {
    const client = await pool.connect();
    const timeout = setTimeout(() => {
      console.error('A client has been checked out for more than 5 seconds!');
    }, 5000);

    client.query('BEGIN;');
    try {
      const result = await cb(client);
      client.query('COMMIT;');
      return result;
    } catch (e) {
      client.query('ROLLBACK;');
      throw e;
    } finally {
      client.release();
      clearTimeout(timeout);
    }
  },

  genUpdateParams(colToValMap: Record<string, any>, valueIdx: number = 1) {
    const columnsSQL = [];
    const values = [];
    for (const [field, val] of Object.entries(colToValMap)) {
      if (field === undefined) continue;
      columnsSQL.push(`${camelCaseToSnakeCase(field)} = $${valueIdx++}`);
      values.push(val);
    }
    return { columnsSQL, values, valueIdx };
  },

  disconnect() {
    return pool.end();
  },
};

/* eslint-disable no-await-in-loop */
export async function runMigration() {
  console.log('>>> Running DB migrations...');

  const migrationTableRes = await pool
    .query('SELECT * FROM pg_tables WHERE tablename = \'migration_files\';');
  if (!migrationTableRes.rowCount) {
    await pool.query(`
      CREATE TABLE migration_files (
          filename VARCHAR PRIMARY KEY,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
  }

  const migrationDirPath = './db_migrations';
  for (const filename of fs.readdirSync(migrationDirPath)) {
    const existsRes = await pool.query(
      'SELECT * FROM migration_files WHERE filename = $1;',
      [filename],
    );
    if (existsRes.rowCount) continue;

    console.log(`Executing migration file: ${filename}`);
    await pool.query('BEGIN;');
    await pool.query(fs.readFileSync(
      path.join(migrationDirPath, filename),
      { encoding: 'utf-8' },
    ));
    await pool.query('INSERT INTO migration_files (filename) VALUES ($1);', [filename]);
    await pool.query('COMMIT;');
  }
}
