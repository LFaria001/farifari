const API_BASE = "https://idealista-api.lmvfa.workers.dev";

const opts = (method, body) => ({
  method,
  credentials: "include",
  headers: body ? { "Content-Type": "application/json" } : {},
  ...(body ? { body: JSON.stringify(body) } : {}),
});

async function request(path, method = "GET", body = null) {
  const res = await fetch(`${API_BASE}${path}`, opts(method, body));
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Erro ${res.status}`);
  return data;
}

// Auth
export const authMe = () => request("/auth/me");
export const authLogin = (email, password, recaptchaToken) =>
  request("/auth/login", "POST", { email, password, recaptchaToken });
export const authRegister = (email, password, recaptchaToken) =>
  request("/auth/register", "POST", { email, password, recaptchaToken });
export const authLogout = () => request("/auth/logout", "POST");

// Clientes
export const getClientes = () => request("/api/clientes").then(d => d.clientes);
export const createCliente = (data) => request("/api/clientes", "POST", data).then(d => d.cliente);
export const updateCliente = (id, data) => request(`/api/clientes/${id}`, "PUT", data).then(d => d.cliente);
export const deleteCliente = (id) => request(`/api/clientes/${id}`, "DELETE");

// Trabalhos
export const getTrabalhos = () => request("/api/trabalhos").then(d => d.trabalhos);
export const createTrabalho = (data) => request("/api/trabalhos", "POST", data).then(d => d.trabalho);
export const updateTrabalho = (id, data) => request(`/api/trabalhos/${id}`, "PUT", data).then(d => d.trabalho);
export const deleteTrabalho = (id) => request(`/api/trabalhos/${id}`, "DELETE");

// Consumos
export const getConsumos = () => request("/api/consumos").then(d => d.consumos);
export const createConsumo = (data) => request("/api/consumos", "POST", data).then(d => d.consumo);
export const updateConsumo = (id, data) => request(`/api/consumos/${id}`, "PUT", data).then(d => d.consumo);
export const deleteConsumo = (id) => request(`/api/consumos/${id}`, "DELETE");

// Backup
export const exportBackup = () => request("/api/backup/export");
export const importBackup = (data) => request("/api/backup/import", "POST", data);
export const deleteAllData = () => request("/api/backup/all", "DELETE");
