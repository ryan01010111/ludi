import { Router } from 'express';
import bcrypt from 'bcryptjs';
import auth from '../../middleware/auth';
import adapter from './authAdapter';
import { setTokenCookie } from '../../utils';

const router = Router();

// @route   GET /auth
// @desc    auth user
// @access  Private
router.get('/', auth, (req, res) => {
  const { user } = req;
  setTokenCookie(res, req.user);
  res.json({ user });
});

// @route   POST /auth/login
// @desc    log in user
// @access  Public
router.post('/login', async (req, res, next) => {
  // TODO: validation
  const { emailAddress, password } = req.body;

  try {
    const userWithPassword = await adapter.getUser(emailAddress);
    if (!userWithPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const { password: hash, ...user } = userWithPassword;

    const passwordMatches = await bcrypt.compare(password, hash);
    if (!passwordMatches) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    setTokenCookie(res, user);
    res.json({ user });
  } catch (e) {
    next(e);
  }
});

export default router;
