import { Hono } from "hono";
import { corsMiddleware } from "./middleware/cors";
import { authMiddleware } from "./middleware/auth";
import authRoutes from "./routes/auth";
import clientesRoutes from "./routes/clientes";
import trabalhosRoutes from "./routes/trabalhos";
import consumosRoutes from "./routes/consumos";
import backupRoutes from "./routes/backup";
import type { Env, User } from "./lib/types";

const app = new Hono<{ Bindings: Env; Variables: { user: User } }>();

// CORS on all routes
app.use("*", corsMiddleware);

// Public auth routes
app.route("/auth", authRoutes);

// Protected API routes
app.use("/api/*", authMiddleware);
app.route("/api/clientes", clientesRoutes);
app.route("/api/trabalhos", trabalhosRoutes);
app.route("/api/consumos", consumosRoutes);
app.route("/api/backup", backupRoutes);

// Health check
app.get("/", (c) => c.json({ status: "ok", service: "idealista-api" }));

export default app;
