import db from '../../src/db';

interface User {
  id: number,
  emailAddress: string,
  username: string
  status: string
}
export async function getUser(emailAddress: string) : Promise<User> {
  const sql = `
    SELECT
        id
      , email_address AS "emailAddress"
      , username
      , status
    FROM platform_users
    WHERE LOWER(email_address) = LOWER($1) AND status != 'deleted';
  `;
  const res = await db.query(sql, [emailAddress]);
  return res.rows[0];
}

export function disconnect() {
  return db.disconnect();
}
