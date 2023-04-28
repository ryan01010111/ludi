import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';

const auth: RequestHandler = (req, res, next) => {
  if (!req.cookies.token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const { id, emailAddress } = jwt.verify(
      req.cookies.token,
      config.get('jwt.secret'),
    ) as jwt.JwtPayload;
    req.user = { id, emailAddress };
    next();
  } catch (e: any) {
    console.log('AUTH FAILURE:::', e?.message);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export default auth;
