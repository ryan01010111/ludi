import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import { TokenUser } from '../@types';

const auth: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.Authorization || req.headers.authorization;
  const accessToken = typeof authHeader === 'string'
    ? authHeader.match(/^Bearer (.+)/)?.[1]
    : null;

  if (!accessToken) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const { id, emailAddress } = jwt.verify(
      accessToken,
      config.get('accessToken.secret'),
    ) as jwt.JwtPayload & TokenUser;
    req.user = { id, emailAddress };
    next();
  } catch (e: any) {
    console.log('AUTH FAILURE:::', e?.message);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export default auth;
