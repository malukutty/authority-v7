import express from "express";
import cors from "cors";
import { registerHealthRoutes } from "./routes/health.js";
import { registerIngestRoutes } from "./routes/ingest.js";
import { registerMetricRoutes } from "./routes/metrics.js";
import { registerInsightRoutes } from "./routes/insights.js";
import { registerDevRoutes } from "./routes/dev.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

registerHealthRoutes(app);
registerIngestRoutes(app);
registerMetricRoutes(app);
registerInsightRoutes(app);
registerDevRoutes(app);

const rawPort = process.env.PORT;
const port = Number(rawPort || 8787);

app.listen(port, "0.0.0.0", () => {
  console.log("Authority API started");
  console.log("PORT from env:", rawPort);
  console.log("Listening on:", port);
});