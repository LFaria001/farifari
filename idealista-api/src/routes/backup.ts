import { Hono } from "hono";
import type { Env, User } from "../lib/types";

const backup = new Hono<{ Bindings: Env; Variables: { user: User } }>();

// GET /api/backup/export
backup.get("/export", async (c) => {
  const user = c.get("user");

  const [clientesRes, trabalhosRes, consumosRes] = await Promise.all([
    c.env.DB.prepare("SELECT * FROM clientes WHERE user_id = ?").bind(user.id).all(),
    c.env.DB.prepare("SELECT * FROM trabalhos WHERE user_id = ?").bind(user.id).all(),
    c.env.DB.prepare("SELECT * FROM consumos WHERE user_id = ?").bind(user.id).all(),
  ]);

  // Map to frontend format
  const clientes = clientesRes.results.map((r: any) => ({
    id: r.id, nome_agencia: r.nome_agencia, contacto: r.contacto || "", email: r.email || "",
    notas: r.notas || "", estado_cliente: r.estado_cliente,
    plano_mensal: { creditos_vt: r.creditos_vt, creditos_video: r.creditos_video, creditos_3d: r.creditos_3d },
  }));

  const trabalhos = trabalhosRes.results.map((r: any) => ({
    id: r.id, cliente_id: r.cliente_id, data_trabalho: r.data_trabalho, mes_referencia: r.mes_referencia,
    local: r.local_name || "", morada: r.morada || "", id_sistema: r.id_sistema || "",
    tipo_multimedia: r.tipo_multimedia, valor: r.valor, estado_trabalho: r.estado_trabalho,
    link_upload: r.link_upload || "", notas_upload: r.notas_upload || "", data_upload: r.data_upload,
  }));

  const consumos = consumosRes.results.map((r: any) => ({
    id: r.id, trabalho_id: r.trabalho_id, cliente_id: r.cliente_id, periodo: r.periodo,
    delta_vt: r.delta_vt, delta_video: r.delta_video, delta_3d: r.delta_3d,
    timestamp: r.timestamp, observacoes: r.observacoes || "",
  }));

  return c.json({ clientes, trabalhos, consumos });
});

// POST /api/backup/import
backup.post("/import", async (c) => {
  const user = c.get("user");
  const { clientes, trabalhos, consumos } = await c.req.json();

  if (!Array.isArray(clientes) || !Array.isArray(trabalhos) || !Array.isArray(consumos)) {
    return c.json({ error: "Formato inválido: precisa de clientes, trabalhos e consumos como arrays" }, 400);
  }

  // Delete all existing data for this user
  const stmts: D1PreparedStatement[] = [
    c.env.DB.prepare("DELETE FROM consumos WHERE user_id = ?").bind(user.id),
    c.env.DB.prepare("DELETE FROM trabalhos WHERE user_id = ?").bind(user.id),
    c.env.DB.prepare("DELETE FROM clientes WHERE user_id = ?").bind(user.id),
  ];

  // Insert clientes
  for (const cl of clientes) {
    const pm = cl.plano_mensal || {};
    stmts.push(
      c.env.DB.prepare(
        "INSERT INTO clientes (id, user_id, nome_agencia, contacto, email, notas, estado_cliente, creditos_vt, creditos_video, creditos_3d) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(cl.id, user.id, cl.nome_agencia, cl.contacto || "", cl.email || "", cl.notas || "", cl.estado_cliente || "ativo", pm.creditos_vt || 0, pm.creditos_video || 0, pm.creditos_3d || 0)
    );
  }

  // Insert trabalhos
  for (const t of trabalhos) {
    stmts.push(
      c.env.DB.prepare(
        "INSERT INTO trabalhos (id, user_id, cliente_id, data_trabalho, mes_referencia, local_name, morada, id_sistema, tipo_multimedia, valor, estado_trabalho, link_upload, notas_upload, data_upload) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(t.id, user.id, t.cliente_id, t.data_trabalho, t.mes_referencia, t.local || "", t.morada || "", t.id_sistema || "", t.tipo_multimedia, t.valor ?? null, t.estado_trabalho || "Realizado", t.link_upload || "", t.notas_upload || "", t.data_upload || null)
    );
  }

  // Insert consumos
  for (const co of consumos) {
    stmts.push(
      c.env.DB.prepare(
        "INSERT INTO consumos (id, user_id, trabalho_id, cliente_id, periodo, delta_vt, delta_video, delta_3d, timestamp, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      ).bind(co.id, user.id, co.trabalho_id, co.cliente_id, co.periodo, co.delta_vt || 0, co.delta_video || 0, co.delta_3d || 0, co.timestamp || new Date().toISOString(), co.observacoes || "")
    );
  }

  await c.env.DB.batch(stmts);

  return c.json({ imported: { clientes: clientes.length, trabalhos: trabalhos.length, consumos: consumos.length } });
});

// DELETE /api/backup/all
backup.delete("/all", async (c) => {
  const user = c.get("user");
  await c.env.DB.batch([
    c.env.DB.prepare("DELETE FROM consumos WHERE user_id = ?").bind(user.id),
    c.env.DB.prepare("DELETE FROM trabalhos WHERE user_id = ?").bind(user.id),
    c.env.DB.prepare("DELETE FROM clientes WHERE user_id = ?").bind(user.id),
  ]);
  return c.json({ ok: true });
});

export default backup;
