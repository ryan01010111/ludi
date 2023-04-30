import { Response } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import { TokenUser } from './@types';

const jwtConfig: Record<string, any> = config.get('jwt');
const cookieMaxAge: number = config.get('cookieMaxAge');

/* eslint-disable-next-line import/prefer-default-export */
export function setTokenCookie(res: Response, user: TokenUser) {
  const token = jwt.sign(
    user,
    jwtConfig.secret,
    { expiresIn: jwtConfig.ttl },
  );

  res.cookie('token', token, {
    maxAge: cookieMaxAge * 1000,
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    path: '/',
  });
}
