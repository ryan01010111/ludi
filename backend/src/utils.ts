import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { TokenUser } from './@types';

// TODO
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_TTL = '1 day';

/* eslint-disable-next-line import/prefer-default-export */
export function setTokenCookie(res: Response, user: TokenUser) {
  const token = jwt.sign(
    user,
    JWT_SECRET,
    { expiresIn: JWT_TTL },
  );

  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; SameSite=Strict; Secure; Path=/`);
}
