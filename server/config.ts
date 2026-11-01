import 'dotenv/config';

const production = process.env.NODE_ENV === 'production';

function required(name: string, fallback?: string): string {
  const value = process.env[name] || fallback;
  if (!value) throw new Error(`Variable d’environnement manquante : ${name}`);
  return value;
}

const sessionSecret = required('SESSION_SECRET', production ? undefined : 'development-only-change-me-32-characters');
if (production && sessionSecret.length < 32) {
  throw new Error('SESSION_SECRET doit contenir au moins 32 caractères en production.');
}

export const config = {
  production,
  port: Number(process.env.PORT || 4000),
  databaseUrl: required('DATABASE_URL'),
  databaseSsl: process.env.DATABASE_SSL === 'true',
  sessionSecret,
  sessionHours: Number(process.env.SESSION_HOURS || 8),
  allowedOrigins: (process.env.APP_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean),
};

export const cookieOptions = {
  httpOnly: true,
  secure: production,
  sameSite: production ? 'none' as const : 'lax' as const,
  path: '/',
  maxAge: config.sessionHours * 60 * 60 * 1000,
};

export const csrfCookieOptions = {
  ...cookieOptions,
  httpOnly: false,
  maxAge: 60 * 60 * 1000,
};
