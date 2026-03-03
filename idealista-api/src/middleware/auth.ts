import { Context, Next } from "hono";
import { verifyJWT } from "../lib/crypto";
import type { Env, User } from "../lib/types";

export async function authMiddleware(c: Context<{ Bindings: Env; Variables: { user: User } }>, next: Next) {
  const cookie = c.req.header("Cookie") || "";
  const match = cookie.match(/session=([^;]+)/);
  if (!match) return c.json({ error: "Não autenticado" }, 401);

  const payload = await verifyJWT(match[1], c.env.JWT_SECRET);
  if (!payload) return c.json({ error: "Sessão inválida ou expirada" }, 401);

  // Check session not revoked
  const session = await c.env.DB.prepare("SELECT revoked FROM sessions WHERE jti = ?").bind(payload.jti).first<{ revoked: number }>();
  if (!session || session.revoked === 1) return c.json({ error: "Sessão revogada" }, 401);

  c.set("user", { id: payload.sub, email: payload.email });
  await next();
}
