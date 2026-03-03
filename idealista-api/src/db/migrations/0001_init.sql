-- Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nome_agencia TEXT NOT NULL,
  contacto TEXT,
  email TEXT,
  notas TEXT,
  estado_cliente TEXT NOT NULL DEFAULT 'ativo',
  creditos_vt INTEGER NOT NULL DEFAULT 0,
  creditos_video INTEGER NOT NULL DEFAULT 0,
  creditos_3d INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_clientes_user ON clientes(user_id);

-- Trabalhos
CREATE TABLE IF NOT EXISTS trabalhos (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cliente_id TEXT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  data_trabalho TEXT NOT NULL,
  mes_referencia TEXT NOT NULL,
  local_name TEXT,
  morada TEXT,
  id_sistema TEXT,
  tipo_multimedia TEXT NOT NULL,
  valor REAL,
  estado_trabalho TEXT NOT NULL DEFAULT 'Realizado',
  link_upload TEXT,
  notas_upload TEXT,
  data_upload TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_trabalhos_user ON trabalhos(user_id);
CREATE INDEX IF NOT EXISTS idx_trabalhos_cliente ON trabalhos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_trabalhos_mes ON trabalhos(mes_referencia);

-- Consumos
CREATE TABLE IF NOT EXISTS consumos (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trabalho_id TEXT NOT NULL REFERENCES trabalhos(id) ON DELETE CASCADE,
  cliente_id TEXT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  periodo TEXT NOT NULL,
  delta_vt INTEGER NOT NULL DEFAULT 0,
  delta_video INTEGER NOT NULL DEFAULT 0,
  delta_3d INTEGER NOT NULL DEFAULT 0,
  timestamp TEXT NOT NULL DEFAULT (datetime('now')),
  observacoes TEXT
);
CREATE INDEX IF NOT EXISTS idx_consumos_user ON consumos(user_id);
CREATE INDEX IF NOT EXISTS idx_consumos_cliente ON consumos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_consumos_periodo ON consumos(periodo);

-- Sessions
CREATE TABLE IF NOT EXISTS sessions (
  jti TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  issued_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  revoked INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
