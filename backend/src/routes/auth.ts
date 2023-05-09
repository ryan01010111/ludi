import { Router } from 'express';
import config from 'config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import auth from '../middleware/auth';
import adapter from './authAdapter';
import validator from '../validator';
import { setTokenCookie } from '../utils';
import sendMail from '../mailer';

const router = Router();

const jwtConfig: Record<string, any> = config.get('jwt');

// @route   GET /auth
// @desc    auth user
// @access  Private
router.get('/', auth, async (req, res, next) => {
  try {
    const user = await adapter.getUserById(req.user.id);
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    setTokenCookie(res, user);
    res.json({
      emailAddress: user.emailAddress,
      username: user.username,
    });
  } catch (e) {
    next(e);
  }
});

// @route   POST /auth/register
// @desc    register user
// @access  Public
router.post('/register', async (req, res, next) => {
  const validationResult = validator.register.safeParse(req.body);
  if (!validationResult.success) {
    res.status(400).json({ validationError: validationResult.error.issues });
    return;
  }
  const { emailAddress, username, password } = validationResult.data;

  try {
    // TODO: check username exists
    const existingUser = await adapter.getUser(emailAddress);
    if (existingUser) {
      res.end();
      return;
    }

    const hash = await bcrypt.hash(password, 12);
    const user = await adapter.createUser({ emailAddress, username, password: hash });

    const token = jwt.sign(
      { id: user.id },
      jwtConfig.secret,
      { expiresIn: '1 hour' },
    );
    await sendMail(user.emailAddress, 'registrationConfirmation', token);

    res.end();
  } catch (e) {
    next(e);
  }
});

// @route   POST /auth/confirm-registration
// @desc    confirm user registration
// @access  Public
router.post('/confirm-registration', async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    res.status(401).json({ error: 'Missing token' });
    return;
  }

  let userID: number;
  try {
    const data = jwt.verify(token, jwtConfig.secret);
    userID = (data as jwt.JwtPayload).id;
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  // TODO: check if already activated

  try {
    await adapter.activateUser(userID);
  } catch (e) {
    next(e);
    return;
  }

  res.end();
});

// @route   POST /auth/login
// @desc    issue access token
// @access  Public
router.post('/login', async (req, res, next) => {
  const validationResult = validator.login.safeParse(req.body);
  if (!validationResult.success) {
    res.status(400).json({ validationError: validationResult.error.issues });
    return;
  }
  const { emailAddress, password } = validationResult.data;

  try {
    const userWithPassword = await adapter.getUser(emailAddress, true);
    if (!userWithPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    if (userWithPassword.status === 'pendingActivation') {
      res.status(401).json({ error: 'ACCOUNT_NOT_ACTIVATED' });
      return;
    }

    const { password: hash, ...user } = userWithPassword;

    const passwordMatches = await bcrypt.compare(password, hash);
    if (!passwordMatches) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const tokenUser = { id: user.id, emailAddress: user.emailAddress };
    setTokenCookie(res, tokenUser);
    res.json({
      emailAddress: user.emailAddress,
      username: user.username,
    });
  } catch (e) {
    next(e);
  }
});

// @route   POST /auth/logout
// @desc    revoke access token
// @access  Private
router.post('/logout', auth, async (_req, res) => {
  res.clearCookie('token');
  res.end();
});

export default router;
