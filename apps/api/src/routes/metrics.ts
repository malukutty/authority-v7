import type { Express } from "express";
import {
  getRecentEvents,
  getSpendByAgent,
  getSpendByModel,
  getSpendOverTime,
  getSummary
} from "../repo.js";

export function registerMetricRoutes(app: Express) {
  app.get("/v1/metrics/summary", (_req, res) => {
    res.json(getSummary());
  });

  app.get("/v1/metrics/agents", (_req, res) => {
    res.json(getSpendByAgent());
  });

  app.get("/v1/metrics/models", (_req, res) => {
    res.json(getSpendByModel());
  });

  app.get("/v1/metrics/spend-over-time", (_req, res) => {
    res.json(getSpendOverTime());
  });

  app.get("/v1/events", (req, res) => {
    const limit = Number(req.query.limit ?? 50);
    res.json(getRecentEvents(limit));
  });
}