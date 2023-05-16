import { Response } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import { TokenUser } from './@types';

const refreshTokenConfig: Record<string, any> = config.get('refreshToken');

export function camelCaseToSnakeCase(input: string) {
  return input
    .replace(/[A-Z]+$/, s => `_${s.toLowerCase()}`)
    .replace(/([A-Z])/g, char => `_${char.toLowerCase()}`);
}

export function setRefreshTokenCookie(res: Response, user: TokenUser): string {
  const token = jwt.sign(
    user,
    refreshTokenConfig.secret,
    { expiresIn: refreshTokenConfig.ttl },
  );

  res.cookie('refreshToken', token, {
    maxAge: refreshTokenConfig.ttl * 1000,
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    path: '/api/auth',
  });

  return token;
}

export function clearRefreshTokenCookie(res: Response) {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    path: '/api/auth',
  });
}
