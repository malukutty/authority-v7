import type { Express } from "express";
import { clearAllEvents, getSummary, insertUsageEvent } from "../repo.js";

function iso(minutesAgo: number): string {
  return new Date(Date.now() - minutesAgo * 60_000).toISOString();
}

function makeSeedEvents() {
  return [
    {
      provider: "openai",
      model: "gpt-4o-mini",
      agent: "support-triage",
      task: "refund-check",
      route: "api",
      userId: "demo",
      requestId: "req-1001",
      parentRequestId: null,
      attempt: 1,
      inputTokens: 1400,
      outputTokens: 220,
      latencyMs: 910,
      costUsd: 0.00034,
      status: "ok",
      createdAt: iso(48)
    },
    {
      provider: "anthropic",
      model: "claude-sonnet-4-6",
      agent: "code-review",
      task: "patch-analysis",
      route: "api",
      userId: "demo",
      requestId: "req-1002",
      parentRequestId: null,
      attempt: 1,
      inputTokens: 5200,
      outputTokens: 1400,
      latencyMs: 3200,
      costUsd: 0.0366,
      status: "ok",
      createdAt: iso(46)
    },
    {
      provider: "openai",
      model: "gpt-4.1-mini",
      agent: "sales-outreach",
      task: "lead-personalization",
      route: "api",
      userId: "demo",
      requestId: "req-1003",
      parentRequestId: null,
      attempt: 1,
      inputTokens: 2100,
      outputTokens: 480,
      latencyMs: 1300,
      costUsd: 0.00161,
      status: "ok",
      createdAt: iso(44)
    },
    {
      provider: "anthropic",
      model: "claude-haiku-4-5",
      agent: "support-triage",
      task: "ticket-routing",
      route: "api",
      userId: "demo",
      requestId: "req-1004",
      parentRequestId: null,
      attempt: 1,
      inputTokens: 800,
      outputTokens: 160,
      latencyMs: 620,
      costUsd: 0.0004,
      status: "ok",
      createdAt: iso(42)
    },

    {
      provider: "openai",
      model: "gpt-4o-mini",
      agent: "support-triage",
      task: "refund-loop",
      route: "api",
      userId: "demo",
      requestId: "req-loop-1",
      parentRequestId: null,
      attempt: 1,
      inputTokens: 1100,
      outputTokens: 210,
      latencyMs: 870,
      costUsd: 0.00029,
      status: "ok",
      createdAt: iso(35)
    },
    {
      provider: "openai",
      model: "gpt-4o-mini",
      agent: "support-triage",
      task: "refund-loop",
      route: "api",
      userId: "demo",
      requestId: "req-loop-2",
      parentRequestId: null,
      attempt: 2,
      inputTokens: 1150,
      outputTokens: 220,
      latencyMs: 900,
      costUsd: 0.0003,
      status: "ok",
      createdAt: iso(34)
    },
    {
      provider: "openai",
      model: "gpt-4o-mini",
      agent: "support-triage",
      task: "refund-loop",
      route: "api",
      userId: "demo",
      requestId: "req-loop-3",
      parentRequestId: null,
      attempt: 3,
      inputTokens: 1180,
      outputTokens: 230,
      latencyMs: 950,
      costUsd: 0.00031,
      status: "ok",
      createdAt: iso(33)
    },
    {
      provider: "openai",
      model: "gpt-4o-mini",
      agent: "support-triage",
      task: "refund-loop",
      route: "api",
      userId: "demo",
      requestId: "req-loop-4",
      parentRequestId: null,
      attempt: 4,
      inputTokens: 1220,
      outputTokens: 240,
      latencyMs: 980,
      costUsd: 0.00033,
      status: "ok",
      createdAt: iso(32)
    },
    {
      provider: "openai",
      model: "gpt-4o-mini",
      agent: "support-triage",
      task: "refund-loop",
      route: "api",
      userId: "demo",
      requestId: "req-loop-5",
      parentRequestId: null,
      attempt: 5,
      inputTokens: 1260,
      outputTokens: 250,
      latencyMs: 1005,
      costUsd: 0.00034,
      status: "ok",
      createdAt: iso(31)
    },
    {
      provider: "openai",
      model: "gpt-4o-mini",
      agent: "support-triage",
      task: "refund-loop",
      route: "api",
      userId: "demo",
      requestId: "req-loop-6",
      parentRequestId: null,
      attempt: 6,
      inputTokens: 1300,
      outputTokens: 260,
      latencyMs: 1040,
      costUsd: 0.00036,
      status: "ok",
      createdAt: iso(30)
    },

    {
      provider: "anthropic",
      model: "claude-sonnet-4-6",
      agent: "contract-review",
      task: "msa-redline",
      route: "api",
      userId: "demo",
      requestId: "req-heavy-1",
      parentRequestId: null,
      attempt: 1,
      inputTokens: 18000,
      outputTokens: 4200,
      latencyMs: 7800,
      costUsd: 0.117,
      status: "ok",
      createdAt: iso(24)
    },

    {
      provider: "openai",
      model: "gpt-4o-mini",
      agent: "sales-outreach",
      task: "follow-up-sequence",
      route: "api",
      userId: "demo",
      requestId: "req-1005",
      parentRequestId: null,
      attempt: 1,
      inputTokens: 1700,
      outputTokens: 320,
      latencyMs: 880,
      costUsd: 0.00045,
      status: "ok",
      createdAt: iso(20)
    },
    {
      provider: "anthropic",
      model: "claude-haiku-4-5",
      agent: "billing-agent",
      task: "invoice-summary",
      route: "api",
      userId: "demo",
      requestId: "req-1006",
      parentRequestId: null,
      attempt: 1,
      inputTokens: 900,
      outputTokens: 180,
      latencyMs: 540,
      costUsd: 0.00045,
      status: "ok",
      createdAt: iso(18)
    },
    {
      provider: "openai",
      model: "gpt-4.1-mini",
      agent: "code-review",
      task: "unit-test-audit",
      route: "api",
      userId: "demo",
      requestId: "req-1007",
      parentRequestId: null,
      attempt: 1,
      inputTokens: 2600,
      outputTokens: 510,
      latencyMs: 1460,
      costUsd: 0.00186,
      status: "ok",
      createdAt: iso(14)
    },
    {
      provider: "anthropic",
      model: "claude-sonnet-4-6",
      agent: "support-triage",
      task: "escalation-draft",
      route: "api",
      userId: "demo",
      requestId: "req-1008",
      parentRequestId: null,
      attempt: 1,
      inputTokens: 4200,
      outputTokens: 980,
      latencyMs: 2600,
      costUsd: 0.0273,
      status: "ok",
      createdAt: iso(10)
    },
    {
      provider: "openai",
      model: "gpt-4o-mini",
      agent: "billing-agent",
      task: "credit-check",
      route: "api",
      userId: "demo",
      requestId: "req-1009",
      parentRequestId: null,
      attempt: 1,
      inputTokens: 1500,
      outputTokens: 200,
      latencyMs: 790,
      costUsd: 0.00035,
      status: "ok",
      createdAt: iso(8)
    }
  ];
}

export function registerDevRoutes(app: Express) {
  app.post("/v1/dev/seed", (_req, res) => {
    clearAllEvents();

    const seedEvents = makeSeedEvents();
    for (const event of seedEvents) {
      insertUsageEvent(event as any);
    }

    res.json({
      ok: true,
      seeded: seedEvents.length,
      summary: getSummary()
    });
  });
} 