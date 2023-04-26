import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { setTokenCookie } from '../utils';
import { TokenUser } from '../@types';

// TODO
const JWT_SECRET = process.env.JWT_SECRET as string;

const router = Router();

// @route   GET /auth
// @desc    auth user
// @access  Private
router.get('/', (req, res) => {
  console.log(req.cookies);

  if (!req.cookies.token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  let user: TokenUser;
  try {
    const { id, emailAddress } = jwt.verify(req.cookies.token, JWT_SECRET) as jwt.JwtPayload;
    user = { id, emailAddress };
  } catch (e) {
    console.log('AUTH ERROR:', e);
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  setTokenCookie(res, user);

  res.json({ user });
});

// @route   POST /auth/login
// @desc    log in user
// @access  Public
router.post('/login', (req, res) => {
  // TODO: validation
  const { emailAddress, password } = req.body;
  console.log(emailAddress, password);

  const user = { id: Math.ceil(Math.random() * 1000), emailAddress };

  setTokenCookie(res, user);

  res.json({ user });
});

export default router;
