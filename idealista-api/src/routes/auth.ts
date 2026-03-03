import { Hono } from "hono";
import { generateSalt, hashPassword, verifyPassword, signJWT } from "../lib/crypto";
import { verifyRecaptcha } from "../lib/recaptcha";
import type { Env, User } from "../lib/types";

const auth = new Hono<{ Bindings: Env; Variables: { user: User } }>();

function sessionCookie(token: string, maxAge: number): string {
  return `session=${token}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=${maxAge}`;
}

async function createSession(db: D1Database, userId: string, email: string, jwtSecret: string) {
  const jti = crypto.randomUUID();
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 7 * 24 * 60 * 60; // 7 days

  await db.prepare("INSERT INTO sessions (jti, user_id, issued_at, expires_at) VALUES (?, ?, ?, ?)")
    .bind(jti, userId, new Date(iat * 1000).toISOString(), new Date(exp * 1000).toISOString()).run();

  const token = await signJWT({ sub: userId, email, jti, iat, exp }, jwtSecret);
  return { token, maxAge: 7 * 24 * 60 * 60 };
}

// POST /auth/register
auth.post("/register", async (c) => {
  const { email, password, recaptchaToken } = await c.req.json<{ email: string; password: string; recaptchaToken: string }>();

  if (!email || !password || password.length < 6) {
    return c.json({ error: "Email e password (min 6 chars) obrigatórios" }, 400);
  }

  if (!recaptchaToken || !(await verifyRecaptcha(recaptchaToken, c.env.RECAPTCHA_SECRET))) {
    return c.json({ error: "Verificação reCAPTCHA falhou" }, 400);
  }

  const existing = await c.env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email.toLowerCase()).first();
  if (existing) return c.json({ error: "Email já registado" }, 409);

  const id = crypto.randomUUID();
  const salt = generateSalt();
  const hash = await hashPassword(password, salt);

  await c.env.DB.prepare("INSERT INTO users (id, email, password_hash, password_salt) VALUES (?, ?, ?, ?)")
    .bind(id, email.toLowerCase(), hash, salt).run();

  const { token, maxAge } = await createSession(c.env.DB, id, email.toLowerCase(), c.env.JWT_SECRET);

  c.header("Set-Cookie", sessionCookie(token, maxAge));
  return c.json({ user: { id, email: email.toLowerCase() } }, 201);
});

// POST /auth/login
auth.post("/login", async (c) => {
  const { email, password, recaptchaToken } = await c.req.json<{ email: string; password: string; recaptchaToken: string }>();

  if (!email || !password) return c.json({ error: "Email e password obrigatórios" }, 400);

  if (!recaptchaToken || !(await verifyRecaptcha(recaptchaToken, c.env.RECAPTCHA_SECRET))) {
    return c.json({ error: "Verificação reCAPTCHA falhou" }, 400);
  }

  const user = await c.env.DB.prepare("SELECT id, email, password_hash, password_salt FROM users WHERE email = ?")
    .bind(email.toLowerCase()).first<{ id: string; email: string; password_hash: string; password_salt: string }>();

  if (!user || !(await verifyPassword(password, user.password_salt, user.password_hash))) {
    return c.json({ error: "Email ou password incorretos" }, 401);
  }

  const { token, maxAge } = await createSession(c.env.DB, user.id, user.email, c.env.JWT_SECRET);

  c.header("Set-Cookie", sessionCookie(token, maxAge));
  return c.json({ user: { id: user.id, email: user.email } });
});

// POST /auth/logout
auth.post("/logout", async (c) => {
  const cookie = c.req.header("Cookie") || "";
  const match = cookie.match(/session=([^;]+)/);
  if (match) {
    const { verifyJWT } = await import("../lib/crypto");
    const payload = await verifyJWT(match[1], c.env.JWT_SECRET);
    if (payload) {
      await c.env.DB.prepare("UPDATE sessions SET revoked = 1 WHERE jti = ?").bind(payload.jti).run();
    }
  }
  c.header("Set-Cookie", sessionCookie("", 0));
  return c.json({ ok: true });
});

// GET /auth/me
auth.get("/me", async (c) => {
  const cookie = c.req.header("Cookie") || "";
  const match = cookie.match(/session=([^;]+)/);
  if (!match) return c.json({ user: null });

  const { verifyJWT } = await import("../lib/crypto");
  const payload = await verifyJWT(match[1], c.env.JWT_SECRET);
  if (!payload) return c.json({ user: null });

  const session = await c.env.DB.prepare("SELECT revoked FROM sessions WHERE jti = ?").bind(payload.jti).first<{ revoked: number }>();
  if (!session || session.revoked === 1) return c.json({ user: null });

  return c.json({ user: { id: payload.sub, email: payload.email } });
});

export default auth;
