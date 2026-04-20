import type {
  EventRow,
  InsightResponse,
  SpendByAgentRow,
  SpendByModelRow,
  Summary
} from "./types";

const API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8787";

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`request failed: ${path}`);
  return res.json();
}

export const api = {
  getSummary: () => getJson<Summary>("/v1/metrics/summary"),
  getAgents: () => getJson<SpendByAgentRow[]>("/v1/metrics/agents"),
  getModels: () => getJson<SpendByModelRow[]>("/v1/metrics/models"),
  getSpendOverTime: () => getJson<{ day: string; spend: number }[]>("/v1/metrics/spend-over-time"),
  getEvents: () => getJson<EventRow[]>("/v1/events?limit=20"),
  getInsights: () => getJson<InsightResponse>("/v1/insights")
};