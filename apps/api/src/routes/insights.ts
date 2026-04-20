import type { Express } from "express";
import { getInsights } from "../analytics.js";

export function registerInsightRoutes(app: Express) {
  app.get("/v1/insights", (_req, res) => {
    res.json(getInsights());
  });
}