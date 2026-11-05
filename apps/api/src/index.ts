import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { SignJWT, jwtVerify } from "jose";
import { z } from "zod";
import { User } from "./models/user.js";

const port = Number(process.env.PORT ?? 3001);
const jwtSecret = process.env.JWT_SECRET;
const mongoUri = process.env.MONGODB_URI;
const demoAuthEnabled = process.env.DEMO_AUTH_ENABLED === "true";
const allowedOrigin = process.env.WEB_ORIGIN ?? "http://localhost:3000";

if (!jwtSecret || jwtSecret.length < 32) throw new Error("JWT_SECRET must have at least 32 characters");
if (!mongoUri) throw new Error("MONGODB_URI is required");
if (!demoAuthEnabled) throw new Error("This demo login requires DEMO_AUTH_ENABLED=true");

const secret = new TextEncoder().encode(jwtSecret);
const app = express();
app.disable("x-powered-by");
app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: "16kb" }));

const credentialsSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(1),
});

app.get("/health", (_request, response) => {
  response.json({ status: mongoose.connection.readyState === 1 ? "ok" : "degraded", service: "nexo-assist-api" });
});

app.post("/auth/login", async (request, response) => {
  const parsed = credentialsSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: "Informe um e-mail válido e uma senha." });
    return;
  }
  try {
    const user = await User.findOne({ email: parsed.data.email, active: true }).lean();
    if (!user) {
      response.status(401).json({ error: "Credenciais inválidas." });
      return;
    }
    // Desafio técnico: qualquer senha não vazia para usuários de demonstração cadastrados.
    const token = await new SignJWT({ role: user.role })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(String(user._id))
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(secret);
    response.json({ token, user: { id: String(user._id), name: user.name, email: user.email, role: user.role } });
  } catch {
    response.status(503).json({ error: "Serviço de autenticação temporariamente indisponível." });
  }
});

app.get("/auth/me", async (request, response) => {
  const authorization = request.header("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    response.status(401).json({ error: "Não autenticado." });
    return;
  }
  try {
    const { payload } = await jwtVerify(authorization.slice(7), secret, { algorithms: ["HS256"] });
    const user = await User.findById(payload.sub).lean();
    if (!user?.active || user.role !== payload.role) {
      response.status(401).json({ error: "Sessão inválida." });
      return;
    }
    response.json({ user: { id: String(user._id), name: user.name, email: user.email, role: user.role } });
  } catch {
    response.status(401).json({ error: "Sessão inválida ou expirada." });
  }
});

mongoose.connect(mongoUri).then(() => {
  app.listen(port, () => console.log(`Nexo Assist API listening on port ${port}`));
}).catch((error: unknown) => {
  console.error("MongoDB connection failed:", error);
  process.exitCode = 1;
});
