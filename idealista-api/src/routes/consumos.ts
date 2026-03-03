import { Hono } from "hono";
import type { Env, User } from "../lib/types";

const consumos = new Hono<{ Bindings: Env; Variables: { user: User } }>();

// GET /api/consumos
consumos.get("/", async (c) => {
  const user = c.get("user");
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM consumos WHERE user_id = ?"
  ).bind(user.id).all();

  const mapped = results.map((r: any) => ({
    id: r.id,
    trabalho_id: r.trabalho_id,
    cliente_id: r.cliente_id,
    periodo: r.periodo,
    delta_vt: r.delta_vt,
    delta_video: r.delta_video,
    delta_3d: r.delta_3d,
    timestamp: r.timestamp,
    observacoes: r.observacoes || "",
  }));
  return c.json({ consumos: mapped });
});

// POST /api/consumos
consumos.post("/", async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  const id = body.id || crypto.randomUUID();

  await c.env.DB.prepare(
    `INSERT INTO consumos (id, user_id, trabalho_id, cliente_id, periodo, delta_vt, delta_video, delta_3d, timestamp, observacoes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, user.id, body.trabalho_id, body.cliente_id, body.periodo,
    body.delta_vt || 0, body.delta_video || 0, body.delta_3d || 0,
    body.timestamp || new Date().toISOString(), body.observacoes || ""
  ).run();

  return c.json({ consumo: { id, ...body } }, 201);
});

// PUT /api/consumos/:id
consumos.put("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const body = await c.req.json();

  const result = await c.env.DB.prepare(
    `UPDATE consumos SET trabalho_id = ?, cliente_id = ?, periodo = ?, delta_vt = ?, delta_video = ?, delta_3d = ?, observacoes = ?
     WHERE id = ? AND user_id = ?`
  ).bind(
    body.trabalho_id, body.cliente_id, body.periodo,
    body.delta_vt || 0, body.delta_video || 0, body.delta_3d || 0,
    body.observacoes || "",
    id, user.id
  ).run();

  if (!result.meta.changes) return c.json({ error: "Consumo não encontrado" }, 404);
  return c.json({ consumo: { id, ...body } });
});

// DELETE /api/consumos/:id
consumos.delete("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");

  const result = await c.env.DB.prepare("DELETE FROM consumos WHERE id = ? AND user_id = ?").bind(id, user.id).run();
  if (!result.meta.changes) return c.json({ error: "Consumo não encontrado" }, 404);
  return c.json({ ok: true });
});

export default consumos;
