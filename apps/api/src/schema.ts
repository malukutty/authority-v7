import { z } from "zod";

export const usageEventSchema = z.object({
  provider: z.enum(["openai", "anthropic"]),
  model: z.string().min(1),
  agent: z.string().min(1),
  task: z.string().min(1),
  route: z.string().default("default"),
  userId: z.string().default("anonymous"),
  requestId: z.string().min(1),
  parentRequestId: z.string().nullable().default(null),
  attempt: z.number().int().min(1).default(1),
  inputTokens: z.number().int().nonnegative(),
  outputTokens: z.number().int().nonnegative(),
  latencyMs: z.number().int().nonnegative(),
  costUsd: z.number().nonnegative(),
  status: z.enum(["ok", "blocked", "error"]).default("ok"),
  createdAt: z.string().datetime().default(() => new Date().toISOString())
});

export type UsageEventInput = z.infer<typeof usageEventSchema>;