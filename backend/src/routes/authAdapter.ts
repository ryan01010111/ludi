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

export async function getUserByRefreshToken(refreshToken: string): Promise<User | null> {
  const sql = `
    SELECT ${defaultUserColumns}
    FROM platform_user_refresh_tokens purt
    JOIN platform_users pu ON pu.id = purt.platform_user_id
    WHERE purt.refresh_token = $1 AND pu.status != 'deleted';
  `;
  const res = await db.query(sql, [refreshToken]);
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

export async function getUserRefreshTokens(userID: number): Promise<string[]> {
  const sql = `
    SELECT refresh_token AS "refreshToken"
    FROM platform_user_refresh_tokens
    WHERE platform_user_id = $1;
  `;
  const res = await db.query(sql, [userID]);
  return res.rows.map(row => row.refreshToken);
}

export async function addUserRefreshToken(userID: number, refreshToken: string) {
  await db.query(
    'INSERT INTO platform_user_refresh_tokens (platform_user_id, refresh_token) VALUES ($1, $2);',
    [userID, refreshToken],
  );
}

export async function deleteUserRefreshToken(refreshToken: string) {
  await db.query(
    'DELETE FROM platform_user_refresh_tokens WHERE refresh_token = $1;',
    [refreshToken],
  );
}

export async function deleteAllRefreshTokensForUser(userID: number) {
  await db.query(
    'DELETE FROM platform_user_refresh_tokens WHERE platform_user_id = $1;',
    [userID],
  );
}
