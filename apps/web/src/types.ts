export type Summary = {
  spend: number;
  requests: number;
  agents: number;
  tasks: number;
  blocked: number;
};

export type SpendByAgentRow = {
  agent: string;
  spend: number;
};

export type SpendByModelRow = {
  model: string;
  spend: number;
};

export type EventRow = {
  id: number;
  provider: "openai" | "anthropic";
  model: string;
  agent: string;
  task: string;
  route: string;
  user_id: string;
  request_id: string;
  attempt: number;
  input_tokens: number;
  output_tokens: number;
  latency_ms: number;
  cost_usd: number;
  status: string;
  created_at: string;
};

export type InsightResponse = {
  suspiciousRun: null | {
    title: string;
    subtitle: string;
    agent: string;
    task: string;
    spend: number;
    averageSpend: number;
  };
  loopDetection: null | {
    title: string;
    subtitle: string;
    agent: string;
    task: string;
    repeatCount: number;
    spend: number;
    pattern: string;
  };
};