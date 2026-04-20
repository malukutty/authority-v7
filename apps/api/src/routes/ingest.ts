import type { Express } from "express";
import { usageEventSchema } from "../schema.js";
import { insertUsageEvent } from "../repo.js";

export function registerIngestRoutes(app: Express) {
  app.post("/v1/ingest", (req, res) => {
    const parsed = usageEventSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "invalid_payload",
        details: parsed.error.flatten()
      });
    }

    insertUsageEvent(parsed.data);
    return res.json({ ok: true });
  });
}