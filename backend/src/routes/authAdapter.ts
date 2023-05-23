import db from '../db';

const defaultUserColumns = [
  'id',
  'email_address AS "emailAddress"',
  'username',
  'status',
];
interface User {
  id: number;
  emailAddress: string;
  username: string;
  status: string;
}

export async function getUser(
  emailAddress: string,
  withPassword: true
): Promise<User & { password: string } | null>;
export async function getUser(emailAddress: string, withPassword?: false) : Promise<User | null>;
export async function getUser(emailAddress: string, withPassword?: boolean) : Promise<User | null> {
  const sql = `
    SELECT ${defaultUserColumns} ${withPassword ? ', password' : ''}
    FROM platform_users
    WHERE LOWER(email_address) = LOWER($1) AND status != 'deleted';
  `;
  const res = await db.query(sql, [emailAddress]);
  if (!res.rowCount) return null;
  const result = res.rows[0];
  result.id = parseInt(result.id, 10);
  return result;
}

export async function getUserById(id: number): Promise<User | null> {
  const sql = `
    SELECT ${defaultUserColumns}
    FROM platform_users
    WHERE id = $1 AND status != 'deleted';
  `;
  const res = await db.query(sql, [id]);
  if (!res.rowCount) return null;
  const result = res.rows[0];
  result.id = parseInt(result.id, 10);
  return result;
}

interface CreateUserData {
  emailAddress: string;
  username: string;
  password: string;
}
export async function createUser(userData: CreateUserData): Promise<User> {
  const sql = `
    INSERT INTO platform_users (email_address, username, password)
    VALUES ($1, $2, $3) RETURNING ${defaultUserColumns};
  `;
  const res = await db.query(sql, [userData.emailAddress, userData.username, userData.password]);
  const result = res.rows[0];
  result.id = parseInt(result.id, 10);
  return result;
}

interface UpdateUserData {
  emailAddress?: string;
  username?: string;
  status?: string;
  updatedBy: number | string;
}
export async function updateUser(
  userID: number,
  userData: UpdateUserData,
): Promise<User | undefined> {
  const { columnsSQL, values } = db.genUpdateParams(userData, 2);

  const sql = `
    UPDATE platform_users SET ${columnsSQL}, updated_at = NOW()
    WHERE id = $1
    RETURNING ${defaultUserColumns};
  `;
  const res = await db.query(sql, [userID, ...values]);
  const result = res.rows[0];
  result.id = parseInt(result.id, 10);
  return result;
}
