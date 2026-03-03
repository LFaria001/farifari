export interface Env {
  DB: D1Database;
  JWT_SECRET: string;
  RECAPTCHA_SECRET: string;
  ALLOWED_ORIGIN: string;
}

export interface User {
  id: string;
  email: string;
}

export interface JWTPayload {
  sub: string;
  email: string;
  jti: string;
  iat: number;
  exp: number;
}
