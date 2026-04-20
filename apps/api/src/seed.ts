import { insertUsageEvent } from "./repo.js";
import { getSummary } from "./repo.js";

function iso(minutesAgo: number): string {
  return new Date(Date.now() - minutesAgo * 60_000).toISOString();
}

function event(input: {
  provider: "openai" | "anthropic";
  model: string;
  agent: string;
  task: string;
  requestId: string;
  attempt?: number;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  costUsd: number;
  status?: "ok" | "blocked" | "error";
  minutesAgo: number;
}) {
  return {
    provider: input.provider,
    model: input.model,
    agent: input.agent,
    task: input.task,
    route: "api",
    userId: "demo",
    requestId: input.requestId,
    parentRequestId: null,
    attempt: input.attempt ?? 1,
    inputTokens: input.inputTokens,
    outputTokens: input.outputTokens,
    latencyMs: input.latencyMs,
    costUsd: input.costUsd,
    status: input.status ?? "ok",
    createdAt: iso(input.minutesAgo),
  };
}

const seedEvents = [
  event({
    provider: "openai",
    model: "gpt-4o-mini",
    agent: "support-triage",
    task: "refund-check",
    requestId: "req-1001",
    inputTokens: 1400,
    outputTokens: 220,
    latencyMs: 910,
    costUsd: 0.00034,
    minutesAgo: 48,
  }),
  event({
    provider: "anthropic",
    model: "claude-sonnet-4-6",
    agent: "code-review",
    task: "patch-analysis",
    requestId: "req-1002",
    inputTokens: 5200,
    outputTokens: 1400,
    latencyMs: 3200,
    costUsd: 0.0366,
    minutesAgo: 46,
  }),
  event({
    provider: "openai",
    model: "gpt-4.1-mini",
    agent: "sales-outreach",
    task: "lead-personalization",
    requestId: "req-1003",
    inputTokens: 2100,
    outputTokens: 480,
    latencyMs: 1300,
    costUsd: 0.00161,
    minutesAgo: 44,
  }),
  event({
    provider: "anthropic",
    model: "claude-haiku-4-5",
    agent: "support-triage",
    task: "ticket-routing",
    requestId: "req-1004",
    inputTokens: 800,
    outputTokens: 160,
    latencyMs: 620,
    costUsd: 0.00040,
    minutesAgo: 42,
  }),

  // loop pattern
  event({
    provider: "openai",
    model: "gpt-4o-mini",
    agent: "support-triage",
    task: "refund-loop",
    requestId: "req-loop-1",
    attempt: 1,
    inputTokens: 1100,
    outputTokens: 210,
    latencyMs: 870,
    costUsd: 0.00029,
    minutesAgo: 35,
  }),
  event({
    provider: "openai",
    model: "gpt-4o-mini",
    agent: "support-triage",
    task: "refund-loop",
    requestId: "req-loop-2",
    attempt: 2,
    inputTokens: 1150,
    outputTokens: 220,
    latencyMs: 900,
    costUsd: 0.00030,
    minutesAgo: 34,
  }),
  event({
    provider: "openai",
    model: "gpt-4o-mini",
    agent: "support-triage",
    task: "refund-loop",
    requestId: "req-loop-3",
    attempt: 3,
    inputTokens: 1180,
    outputTokens: 230,
    latencyMs: 950,
    costUsd: 0.00031,
    minutesAgo: 33,
  }),
  event({
    provider: "openai",
    model: "gpt-4o-mini",
    agent: "support-triage",
    task: "refund-loop",
    requestId: "req-loop-4",
    attempt: 4,
    inputTokens: 1220,
    outputTokens: 240,
    latencyMs: 980,
    costUsd: 0.00033,
    minutesAgo: 32,
  }),
  event({
    provider: "openai",
    model: "gpt-4o-mini",
    agent: "support-triage",
    task: "refund-loop",
    requestId: "req-loop-5",
    attempt: 5,
    inputTokens: 1260,
    outputTokens: 250,
    latencyMs: 1005,
    costUsd: 0.00034,
    minutesAgo: 31,
  }),
  event({
    provider: "openai",
    model: "gpt-4o-mini",
    agent: "support-triage",
    task: "refund-loop",
    requestId: "req-loop-6",
    attempt: 6,
    inputTokens: 1300,
    outputTokens: 260,
    latencyMs: 1040,
    costUsd: 0.00036,
    minutesAgo: 30,
  }),

  // suspicious run
  event({
    provider: "anthropic",
    model: "claude-sonnet-4-6",
    agent: "contract-review",
    task: "msa-redline",
    requestId: "req-heavy-1",
    inputTokens: 18000,
    outputTokens: 4200,
    latencyMs: 7800,
    costUsd: 0.117,
    minutesAgo: 24,
  }),

  event({
    provider: "openai",
    model: "gpt-4o-mini",
    agent: "sales-outreach",
    task: "follow-up-sequence",
    requestId: "req-1005",
    inputTokens: 1700,
    outputTokens: 320,
    latencyMs: 880,
    costUsd: 0.00045,
    minutesAgo: 20,
  }),
  event({
    provider: "anthropic",
    model: "claude-haiku-4-5",
    agent: "billing-agent",
    task: "invoice-summary",
    requestId: "req-1006",
    inputTokens: 900,
    outputTokens: 180,
    latencyMs: 540,
    costUsd: 0.00045,
    minutesAgo: 18,
  }),
  event({
    provider: "openai",
    model: "gpt-4.1-mini",
    agent: "code-review",
    task: "unit-test-audit",
    requestId: "req-1007",
    inputTokens: 2600,
    outputTokens: 510,
    latencyMs: 1460,
    costUsd: 0.00186,
    minutesAgo: 14,
  }),
  event({
    provider: "anthropic",
    model: "claude-sonnet-4-6",
    agent: "support-triage",
    task: "escalation-draft",
    requestId: "req-1008",
    inputTokens: 4200,
    outputTokens: 980,
    latencyMs: 2600,
    costUsd: 0.0273,
    minutesAgo: 10,
  }),
  event({
    provider: "openai",
    model: "gpt-4o-mini",
    agent: "billing-agent",
    task: "credit-check",
    requestId: "req-1009",
    inputTokens: 1500,
    outputTokens: 200,
    latencyMs: 790,
    costUsd: 0.00035,
    minutesAgo: 8,
  }),
];

for (const item of seedEvents) {
  insertUsageEvent(item);
}

console.log(`Seeded ${seedEvents.length} events`); 

console.log("Summary after seed:", getSummary());