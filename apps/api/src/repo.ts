import { authorityDb } from "./db.js";
import type { UsageEventInput } from "./schema.js";

type EventRow = {
  id: number;
  provider: "openai" | "anthropic";
  model: string;
  agent: string;
  task: string;
  route: string;
  user_id: string;
  request_id: string;
  parent_request_id: string | null;
  attempt: number;
  input_tokens: number;
  output_tokens: number;
  latency_ms: number;
  cost_usd: number;
  status: "ok" | "blocked" | "error";
  created_at: string;
};

function mapInputToRow(id: number, event: UsageEventInput): EventRow {
  return {
    id,
    provider: event.provider,
    model: event.model,
    agent: event.agent,
    task: event.task,
    route: event.route,
    user_id: event.userId,
    request_id: event.requestId,
    parent_request_id: event.parentRequestId,
    attempt: event.attempt,
    input_tokens: event.inputTokens,
    output_tokens: event.outputTokens,
    latency_ms: event.latencyMs,
    cost_usd: event.costUsd,
    status: event.status,
    created_at: event.createdAt
  };
}

export function insertUsageEvent(event: UsageEventInput): void {
  if (authorityDb.kind === "memory") {
    const row = mapInputToRow(authorityDb.nextId++, event);
    authorityDb.rows.push(row);
    return;
  }

  authorityDb.db
    .prepare(`
      INSERT INTO usage_events (
        provider,
        model,
        agent,
        task,
        route,
        user_id,
        request_id,
        parent_request_id,
        attempt,
        input_tokens,
        output_tokens,
        latency_ms,
        cost_usd,
        status,
        created_at
      ) VALUES (
        @provider,
        @model,
        @agent,
        @task,
        @route,
        @userId,
        @requestId,
        @parentRequestId,
        @attempt,
        @inputTokens,
        @outputTokens,
        @latencyMs,
        @costUsd,
        @status,
        @createdAt
      )
    `)
    .run(event);
}

export function getRecentEvents(limit = 50) {
  if (authorityDb.kind === "memory") {
    return [...authorityDb.rows]
      .sort((a, b) => {
        const dateDiff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        return dateDiff !== 0 ? dateDiff : b.id - a.id;
      })
      .slice(0, limit);
  }

  return authorityDb.db
    .prepare(`
      SELECT *
      FROM usage_events
      ORDER BY datetime(created_at) DESC, id DESC
      LIMIT ?
    `)
    .all(limit);
}

export function getSummary() {
  if (authorityDb.kind === "memory") {
    const rows = authorityDb.rows;
    const spend = rows.reduce((sum, row) => sum + row.cost_usd, 0);
    const agents = new Set(rows.map((r) => r.agent)).size;
    const tasks = new Set(rows.map((r) => r.task)).size;
    const blocked = rows.filter((r) => r.status === "blocked").length;

    return {
      spend,
      requests: rows.length,
      agents,
      tasks,
      blocked
    };
  }

  return authorityDb.db
    .prepare(`
      SELECT
        COALESCE(SUM(cost_usd), 0) AS spend,
        COUNT(*) AS requests,
        COUNT(DISTINCT agent) AS agents,
        COUNT(DISTINCT task) AS tasks,
        SUM(CASE WHEN status = 'blocked' THEN 1 ELSE 0 END) AS blocked
      FROM usage_events
    `)
    .get() as {
    spend: number;
    requests: number;
    agents: number;
    tasks: number;
    blocked: number;
  };
}

export function getSpendByAgent() {
  if (authorityDb.kind === "memory") {
    const map = new Map<string, number>();
    for (const row of authorityDb.rows) {
      map.set(row.agent, (map.get(row.agent) ?? 0) + row.cost_usd);
    }

    return [...map.entries()]
      .map(([agent, spend]) => ({ agent, spend: Number(spend.toFixed(6)) }))
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 10);
  }

  return authorityDb.db
    .prepare(`
      SELECT agent, ROUND(SUM(cost_usd), 6) AS spend
      FROM usage_events
      GROUP BY agent
      ORDER BY spend DESC
      LIMIT 10
    `)
    .all() as Array<{ agent: string; spend: number }>;
}

export function getSpendByModel() {
  if (authorityDb.kind === "memory") {
    const map = new Map<string, number>();
    for (const row of authorityDb.rows) {
      map.set(row.model, (map.get(row.model) ?? 0) + row.cost_usd);
    }

    return [...map.entries()]
      .map(([model, spend]) => ({ model, spend: Number(spend.toFixed(6)) }))
      .sort((a, b) => b.spend - a.spend);
  }

  return authorityDb.db
    .prepare(`
      SELECT model, ROUND(SUM(cost_usd), 6) AS spend
      FROM usage_events
      GROUP BY model
      ORDER BY spend DESC
    `)
    .all() as Array<{ model: string; spend: number }>;
}

export function getSpendOverTime() {
  if (authorityDb.kind === "memory") {
    const map = new Map<string, number>();
    for (const row of authorityDb.rows) {
      const day = row.created_at.slice(0, 10);
      map.set(day, (map.get(day) ?? 0) + row.cost_usd);
    }

    return [...map.entries()]
      .map(([day, spend]) => ({ day, spend: Number(spend.toFixed(6)) }))
      .sort((a, b) => a.day.localeCompare(b.day));
  }

  return authorityDb.db
    .prepare(`
      SELECT substr(created_at, 1, 10) AS day, ROUND(SUM(cost_usd), 6) AS spend
      FROM usage_events
      GROUP BY day
      ORDER BY day ASC
    `)
    .all() as Array<{ day: string; spend: number }>;
}

export function clearAllEvents() {
  if (authorityDb.kind === "memory") {
    authorityDb.rows = [];
    authorityDb.nextId = 1;
    return;
  }

  authorityDb.db.prepare(`DELETE FROM usage_events`).run();
} 
