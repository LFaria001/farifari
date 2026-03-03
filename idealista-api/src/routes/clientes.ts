import { Hono } from "hono";
import type { Env, User } from "../lib/types";

const clientes = new Hono<{ Bindings: Env; Variables: { user: User } }>();

// GET /api/clientes
clientes.get("/", async (c) => {
  const user = c.get("user");
  const { results } = await c.env.DB.prepare(
    "SELECT id, nome_agencia, contacto, email, notas, estado_cliente, creditos_vt, creditos_video, creditos_3d FROM clientes WHERE user_id = ?"
  ).bind(user.id).all();

  // Map flat columns to nested plano_mensal for frontend compatibility
  const mapped = results.map((r: any) => ({
    id: r.id,
    nome_agencia: r.nome_agencia,
    contacto: r.contacto || "",
    email: r.email || "",
    notas: r.notas || "",
    estado_cliente: r.estado_cliente,
    plano_mensal: {
      creditos_vt: r.creditos_vt,
      creditos_video: r.creditos_video,
      creditos_3d: r.creditos_3d,
    },
  }));
  return c.json({ clientes: mapped });
});

// POST /api/clientes
clientes.post("/", async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  const id = body.id || crypto.randomUUID();
  const pm = body.plano_mensal || {};

  await c.env.DB.prepare(
    "INSERT INTO clientes (id, user_id, nome_agencia, contacto, email, notas, estado_cliente, creditos_vt, creditos_video, creditos_3d) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).bind(
    id, user.id,
    body.nome_agencia, body.contacto || "", body.email || "", body.notas || "",
    body.estado_cliente || "ativo",
    pm.creditos_vt || 0, pm.creditos_video || 0, pm.creditos_3d || 0
  ).run();

  return c.json({
    cliente: {
      id, nome_agencia: body.nome_agencia, contacto: body.contacto || "",
      email: body.email || "", notas: body.notas || "",
      estado_cliente: body.estado_cliente || "ativo",
      plano_mensal: { creditos_vt: pm.creditos_vt || 0, creditos_video: pm.creditos_video || 0, creditos_3d: pm.creditos_3d || 0 },
    }
  }, 201);
});

// PUT /api/clientes/:id
clientes.put("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const body = await c.req.json();
  const pm = body.plano_mensal || {};

  const result = await c.env.DB.prepare(
    "UPDATE clientes SET nome_agencia = ?, contacto = ?, email = ?, notas = ?, estado_cliente = ?, creditos_vt = ?, creditos_video = ?, creditos_3d = ? WHERE id = ? AND user_id = ?"
  ).bind(
    body.nome_agencia, body.contacto || "", body.email || "", body.notas || "",
    body.estado_cliente || "ativo",
    pm.creditos_vt || 0, pm.creditos_video || 0, pm.creditos_3d || 0,
    id, user.id
  ).run();

  if (!result.meta.changes) return c.json({ error: "Cliente não encontrado" }, 404);
  return c.json({ cliente: { id, ...body, plano_mensal: pm } });
});

// DELETE /api/clientes/:id
clientes.delete("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");

  const result = await c.env.DB.prepare("DELETE FROM clientes WHERE id = ? AND user_id = ?").bind(id, user.id).run();
  if (!result.meta.changes) return c.json({ error: "Cliente não encontrado" }, 404);
  return c.json({ ok: true });
});

export default clientes;
