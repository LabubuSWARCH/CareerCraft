import { Router } from 'express';
import {
  loginUser,
  logoutSession,
  registerUser,
  validateSession,
  requestPasswordReset,
  resetPassword,
} from '../../../service/auth';
import { COOKIE_DOMAIN, NODE_ENV } from '../../../config';

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password, full_name, email, phone, address, profile_picture } = req.body;

    const user = await registerUser({
      username,
      password,
      full_name,
      email,
      phone,
      address,
      profile_picture,
    });

    res.status(201).json(user);
  } catch (err: unknown) {
    console.log(err);
    if (err instanceof Error && err.message.includes('already exists')) {
      return res.status(409).json({ error: getErrorMessage(err) });
    }
    res.status(500).json({ error: getErrorMessage(err) });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const { user, token } = await loginUser(username, password);

    res.cookie('SESSION_TOKEN', token, {
      httpOnly: true,
      maxAge: 3600 * 1000,
      domain: COOKIE_DOMAIN,
      sameSite: 'lax',
      secure: NODE_ENV === 'production',
    });

    res.json({ user, token });
  } catch (err: unknown) {
    console.error(err);
    res.status(401).json({ error: getErrorMessage(err) });
  }
});

router.post('/logout', async (req, res) => {
  const token = req.cookies.SESSION_TOKEN;
  if (token) await logoutSession(token);
  res.clearCookie('SESSION_TOKEN');
  res.json({ success: true });
});

router.get('/profile', async (req, res) => {
  const token = req.cookies.SESSION_TOKEN;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  const user = await validateSession(token);
  if (!user) return res.status(401).json({ error: 'Invalid session' });

  res.json(user);
});

router.post('/forgot', async (req, res) => {
  try {
    const { identifier } = req.body;
    const result = await requestPasswordReset(identifier);
    res.json(result);
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
});

router.post('/reset', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const result = await resetPassword(token, newPassword);
    res.json(result);
  } catch (err: unknown) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
});

export default router;
