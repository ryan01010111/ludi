import { Router } from 'express';
import config from 'config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import auth from '../middleware/auth';
import * as adapter from './authAdapter';
import redis from '../redis';
import validator from '../validator';
import { clearRefreshTokenCookie, setRefreshTokenCookie } from '../utils';
import sendMail from '../mailer';
import { TokenUser } from '../@types';

const router = Router();

const refreshTokenConfig: Record<string, any> = config.get('refreshToken');
const accessTokenConfig: Record<string, any> = config.get('accessToken');

// @route   GET /auth/refresh
// @desc    issue new access and refresh tokens
// @access  Public
router.get('/refresh', async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    res.status(401).json({ error: 'Invalid or missing token' });
    return;
  }
  clearRefreshTokenCookie(res);

  let tokenData;
  let userIdStr: string;
  try {
    tokenData = jwt.verify(
      refreshToken,
      refreshTokenConfig.secret,
    ) as jwt.JwtPayload & TokenUser;
    userIdStr = String(tokenData.id);

    let tokenFound: boolean;
    try {
      const removedCount = await redis.sRem(userIdStr, refreshToken);
      tokenFound = removedCount > 0;
    } catch (e) {
      next(e);
      return;
    }

    if (!tokenFound) {
      // token already used - revoke all refresh tokens for user
      try {
        await redis.del(userIdStr);
      } catch (e) {
        next(e);
        return;
      }
      throw new Error('Refresh token already used');
    }
  } catch (e) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const tokenUserData = { id: tokenData.id, emailAddress: tokenData.emailAddress };
  const accessToken = jwt.sign(
    tokenUserData,
    accessTokenConfig.secret,
    { expiresIn: accessTokenConfig.ttl },
  );
  const newRefreshToken = setRefreshTokenCookie(res, tokenUserData);

  try {
    await redis.sAdd(userIdStr, newRefreshToken);

    res.json({
      user: {
        emailAddress: tokenData.emailAddress,
        username: tokenData.username,
      },
      accessToken,
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
      refreshTokenConfig.secret,
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
    const data = jwt.verify(token, refreshTokenConfig.secret) as jwt.JwtPayload & TokenUser;
    userID = data.id;
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  const user = await adapter.getUserById(userID);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  if (user.status === 'active') {
    res.status(409).json({ error: 'ACCOUNT_ALREADY_ACTIVATED' });
    return;
  }

  try {
    await adapter.updateUser(user.id, { status: 'active', updatedBy: 'system' });
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

    const reqRefreshToken: string | undefined = req.cookies.refreshToken;
    if (reqRefreshToken) await redis.sRem(String(user.id), reqRefreshToken);
    clearRefreshTokenCookie(res);

    const tokenUserData = { id: user.id, emailAddress: user.emailAddress };
    const accessToken = jwt.sign(
      tokenUserData,
      accessTokenConfig.secret,
      { expiresIn: accessTokenConfig.ttl },
    );
    const refreshToken = setRefreshTokenCookie(res, tokenUserData);
    await redis.sAdd(String(user.id), refreshToken);

    res.json({
      user: {
        emailAddress: user.emailAddress,
        username: user.username,
      },
      accessToken,
    });
  } catch (e) {
    next(e);
  }
});

// @route   POST /auth/logout
// @desc    revoke refresh token
// @access  Public
router.post('/logout', async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    res.status(401).json({ error: 'Invalid or missing token' });
    return;
  }
  clearRefreshTokenCookie(res);

  let userIdStr: string;
  try {
    const userData = jwt.verify(
      refreshToken,
      refreshTokenConfig.secret,
      { ignoreExpiration: true },
    ) as jwt.JwtPayload & TokenUser;
    userIdStr = String(userData.id);
  } catch (e) {
    res.status(401).json({ error: 'Invalid or missing token' });
    return;
  }

  try {
    await redis.sRem(userIdStr, refreshToken);
    res.end();
  } catch (e) {
    next(e);
  }
});

// TODO: remove
// @route   GET /auth/test
// @desc    test auth
// @access  Private
router.get('/test', auth, async (_req, res) => {
  res.json({ success: true });
});

export default router;
