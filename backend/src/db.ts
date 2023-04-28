import { Pool, PoolClient } from 'pg';

// TODO
type GetClientCallback = (con: PoolClient) => Promise<any>;

const pool = new Pool();

export default {
  async query(text: string, params: any[]) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  },

  async getClient(cb: GetClientCallback) {
    const client = await pool.connect();
    const timeout = setTimeout(() => {
      console.error('A client has been checked out for more than 5 seconds!');
    }, 5000);

    client.query('BEGIN;');
    const result = await cb(client);
    client.query('COMMIT;');

    client.release();
    clearTimeout(timeout);
    return result;
  },
};
