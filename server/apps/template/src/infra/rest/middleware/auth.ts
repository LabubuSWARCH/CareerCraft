import { NextFunction, Request, Response } from 'express';
import { AuthenticationError, validateSessionToken } from '../../grpc/auth-client';

function extractToken(req: Request): string | undefined {
  const cookieToken = req.cookies?.SESSION_TOKEN;
  if (cookieToken) return cookieToken;

  const authHeader = req.header('authorization');
  if (!authHeader) return undefined;

  const [scheme, value] = authHeader.split(' ');
  if (scheme?.toLowerCase() !== 'bearer') return undefined;
  return value;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const user = await validateSessionToken(token);
    req.user = { ...user, token };
    return next();
  } catch (err: unknown) {
    if (err instanceof AuthenticationError) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    console.error('Auth service validation error', err);
    return res.status(503).json({ error: 'Authentication service unavailable' });
  }
}
