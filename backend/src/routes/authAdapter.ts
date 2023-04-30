import db from '../db';

const defaultUserFields = [
  'id',
  'email_address AS "emailAddress"',
  'username',
  'status',
];
interface User {
  id: number,
  emailAddress: string,
  username: string
  status: string
}

async function getUser(
  emailAddress: string,
  withPassword: true
): Promise<User & { password: string }>;
async function getUser(emailAddress: string, withPassword?: false) : Promise<User>;
async function getUser(emailAddress: string, withPassword?: boolean) : Promise<User> {
  const sql = `
    SELECT ${defaultUserFields} ${withPassword ? ', password' : ''}
    FROM platform_users WHERE email_address = $1 AND status != 'deleted';
  `;
  const res = await db.query(sql, [emailAddress]);
  return res.rows[0];
}

interface CreateUserData {
  emailAddress: string;
  username: string;
  password: string;
}
async function createUser(userData: CreateUserData): Promise<User> {
  const sql = `
    INSERT INTO platform_users (email_address, username, password)
    VALUES ($1, $2, $3) RETURNING ${defaultUserFields};
  `;
  const res = await db.query(sql, [userData.emailAddress, userData.username, userData.password]);
  return res.rows[0];
}

async function activateUser(userID: number) {
  const sql = 'UPDATE platform_users SET status = \'active\' WHERE id = $1;';
  await db.query(sql, [userID]);
}

export default {
  getUser,
  createUser,
  activateUser,
};
