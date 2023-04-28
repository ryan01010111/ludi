import db from '../../db';

const defaultUserFields = [
  'id',
  'email_address AS "emailAddress"',
  'username',
  'password',
];
interface User {
  id: number,
  emailAddress: string,
  username: string,
  password: string,
}

export default {
  async getUser(emailAddress: string): Promise<User> {
    const sql = `
    SELECT ${defaultUserFields}
    FROM platform_users WHERE email_address = $1;
  `;
    const res = await db.query(sql, [emailAddress]);
    return res.rows[0];
  },
};
