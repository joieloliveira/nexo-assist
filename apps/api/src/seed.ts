import "dotenv/config";
import mongoose from "mongoose";
import { User } from "./models/user.js";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required");

const users = [
  { name: "Ana Souza", email: "ana.souza@nexo.local", role: "employee" },
  { name: "Bruno Lima", email: "bruno.lima@nexo.local", role: "employee" },
  { name: "Carla Mendes", email: "carla.mendes@nexo.local", role: "employee" },
  { name: "Marcos Oliveira", email: "marcos.oliveira@nexo.local", role: "analyst" },
] as const;

try {
  await mongoose.connect(uri);
  for (const user of users) {
    await User.updateOne({ email: user.email }, { $setOnInsert: { ...user, active: true } }, { upsert: true });
  }
  console.log("Demo users seeded:", users.map((user) => user.email).join(", "));
} finally {
  await mongoose.disconnect();
}
