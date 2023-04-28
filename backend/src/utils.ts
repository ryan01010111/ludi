import { Response } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import { TokenUser } from './@types';

/* eslint-disable-next-line import/prefer-default-export */
export function setTokenCookie(res: Response, user: TokenUser) {
  const token = jwt.sign(
    user,
    config.get('jwt.secret'),
    { expiresIn: config.get('jwt.ttl') },
  );

  res.setHeader('Set-Cookie', `token=${token}; HttpOnly; SameSite=Strict; Secure; Path=/`);
}
