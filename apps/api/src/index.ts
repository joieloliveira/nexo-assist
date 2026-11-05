import "dotenv/config";
import express from "express";

const app = express();
app.use(express.json());
app.get("/health", (_request, response) => {
  response.json({ status: "ok", service: "nexo-assist-api" });
});

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  console.log(`Nexo Assist API listening on port ${port}`);
});
