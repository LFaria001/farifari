import { Hono } from "hono";
import type { Env, User } from "../lib/types";

const trabalhos = new Hono<{ Bindings: Env; Variables: { user: User } }>();

// GET /api/trabalhos
trabalhos.get("/", async (c) => {
  const user = c.get("user");
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM trabalhos WHERE user_id = ?"
  ).bind(user.id).all();

  const mapped = results.map((r: any) => ({
    id: r.id,
    cliente_id: r.cliente_id,
    data_trabalho: r.data_trabalho,
    mes_referencia: r.mes_referencia,
    local: r.local_name || "",
    morada: r.morada || "",
    id_sistema: r.id_sistema || "",
    tipo_multimedia: r.tipo_multimedia,
    valor: r.valor,
    estado_trabalho: r.estado_trabalho,
    link_upload: r.link_upload || "",
    notas_upload: r.notas_upload || "",
    data_upload: r.data_upload,
  }));
  return c.json({ trabalhos: mapped });
});

// POST /api/trabalhos
trabalhos.post("/", async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  const id = body.id || crypto.randomUUID();

  await c.env.DB.prepare(
    `INSERT INTO trabalhos (id, user_id, cliente_id, data_trabalho, mes_referencia, local_name, morada, id_sistema, tipo_multimedia, valor, estado_trabalho, link_upload, notas_upload, data_upload)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id, user.id, body.cliente_id, body.data_trabalho, body.mes_referencia,
    body.local || "", body.morada || "", body.id_sistema || "",
    body.tipo_multimedia, body.valor ?? null,
    body.estado_trabalho || "Realizado",
    body.link_upload || "", body.notas_upload || "", body.data_upload || null
  ).run();

  return c.json({ trabalho: { id, ...body } }, 201);
});

// PUT /api/trabalhos/:id
trabalhos.put("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");
  const body = await c.req.json();

  const result = await c.env.DB.prepare(
    `UPDATE trabalhos SET cliente_id = ?, data_trabalho = ?, mes_referencia = ?, local_name = ?, morada = ?, id_sistema = ?,
     tipo_multimedia = ?, valor = ?, estado_trabalho = ?, link_upload = ?, notas_upload = ?, data_upload = ?
     WHERE id = ? AND user_id = ?`
  ).bind(
    body.cliente_id, body.data_trabalho, body.mes_referencia,
    body.local || "", body.morada || "", body.id_sistema || "",
    body.tipo_multimedia, body.valor ?? null,
    body.estado_trabalho || "Realizado",
    body.link_upload || "", body.notas_upload || "", body.data_upload || null,
    id, user.id
  ).run();

  if (!result.meta.changes) return c.json({ error: "Trabalho não encontrado" }, 404);
  return c.json({ trabalho: { id, ...body } });
});

// DELETE /api/trabalhos/:id
trabalhos.delete("/:id", async (c) => {
  const user = c.get("user");
  const id = c.req.param("id");

  const result = await c.env.DB.prepare("DELETE FROM trabalhos WHERE id = ? AND user_id = ?").bind(id, user.id).run();
  if (!result.meta.changes) return c.json({ error: "Trabalho não encontrado" }, 404);
  return c.json({ ok: true });
});

export default trabalhos;
