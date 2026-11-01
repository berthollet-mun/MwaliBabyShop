import { randomBytes, timingSafeEqual } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config, cookieOptions, csrfCookieOptions } from './config.js';

export type Role = 'ADMIN' | 'RESPONSABLE';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}

const SESSION_COOKIE = 'mwali_session';
const CSRF_COOKIE = 'mwali_csrf';

export function issueSession(response: Response, user: SessionUser): void {
  const token = jwt.sign(user, config.sessionSecret, {
    algorithm: 'HS256',
    expiresIn: `${config.sessionHours}h`,
    issuer: 'mwali-baby-shop',
    audience: 'mwali-admin',
  });
  response.cookie(SESSION_COOKIE, token, cookieOptions);
}

export function clearSession(response: Response): void {
  response.clearCookie(SESSION_COOKIE, cookieOptions);
}

export function createCsrf(response: Response): string {
  const token = randomBytes(32).toString('base64url');
  response.cookie(CSRF_COOKIE, token, csrfCookieOptions);
  return token;
}

export function requireCsrf(request: Request, response: Response, next: NextFunction): void {
  const cookieToken = request.cookies?.[CSRF_COOKIE];
  const headerToken = request.get('X-CSRF-Token');
  if (!cookieToken || !headerToken) {
    response.status(403).json({ error: 'Jeton CSRF manquant.' });
    return;
  }
  const cookieBuffer = Buffer.from(cookieToken);
  const headerBuffer = Buffer.from(headerToken);
  if (cookieBuffer.length !== headerBuffer.length || !timingSafeEqual(cookieBuffer, headerBuffer)) {
    response.status(403).json({ error: 'Jeton CSRF invalide.' });
    return;
  }
  next();
}

export function requireAuth(request: Request, response: Response, next: NextFunction): void {
  const token = request.cookies?.[SESSION_COOKIE];
  if (!token) {
    response.status(401).json({ error: 'Authentification requise.' });
    return;
  }
  try {
    request.user = jwt.verify(token, config.sessionSecret, {
      algorithms: ['HS256'],
      issuer: 'mwali-baby-shop',
      audience: 'mwali-admin',
    }) as SessionUser;
    next();
  } catch {
    clearSession(response);
    response.status(401).json({ error: 'Session expirée ou invalide.' });
  }
}

export function requireRole(...roles: Role[]) {
  return (request: Request, response: Response, next: NextFunction): void => {
    if (!request.user || !roles.includes(request.user.role)) {
      response.status(403).json({ error: 'Vous n’avez pas la permission d’effectuer cette action.' });
      return;
    }
    next();
  };
}
