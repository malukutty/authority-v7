import { getRecentEvents } from "./repo.js";

export function getInsights() {
  const events = getRecentEvents(1000) as Array<{
    request_id: string;
    agent: string;
    task: string;
    cost_usd: number;
  }>;

  const byRequest = new Map<
    string,
    { request_id: string; agent: string; task: string; spend: number }
  >();

  for (const event of events) {
    const current = byRequest.get(event.request_id) ?? {
      request_id: event.request_id,
      agent: event.agent,
      task: event.task,
      spend: 0
    };

    current.spend += event.cost_usd;
    byRequest.set(event.request_id, current);
  }

  const requestRows = [...byRequest.values()];
  const avgSpend =
    requestRows.length > 0
      ? requestRows.reduce((sum, row) => sum + row.spend, 0) / requestRows.length
      : 0;

  const suspicious = requestRows
    .filter((row) => avgSpend > 0 && row.spend >= avgSpend * 2.5)
    .sort((a, b) => b.spend - a.spend)[0];

  const byAgentTask = new Map<string, { agent: string; task: string; count: number; spend: number }>();

  for (const event of events) {
    const key = `${event.agent}::${event.task}`;
    const current = byAgentTask.get(key) ?? {
      agent: event.agent,
      task: event.task,
      count: 0,
      spend: 0
    };

    current.count += 1;
    current.spend += event.cost_usd;
    byAgentTask.set(key, current);
  }

  const loop = [...byAgentTask.values()]
    .filter((row) => row.count >= 4)
    .sort((a, b) => b.count - a.count || b.spend - a.spend)[0];

  return {
    suspiciousRun: suspicious
      ? {
          title: `This run cost ${(suspicious.spend / avgSpend).toFixed(2)}x more than usual`,
          subtitle: "Is this expected?",
          agent: suspicious.agent,
          task: suspicious.task,
          spend: Number(suspicious.spend.toFixed(6)),
          averageSpend: Number(avgSpend.toFixed(6))
        }
      : null,
    loopDetection: loop
      ? {
          title: `This task retried ${loop.count} times`,
          subtitle: "Should this have stopped?",
          agent: loop.agent,
          task: loop.task,
          repeatCount: loop.count,
          spend: Number(loop.spend.toFixed(6)),
          pattern: "retry → same step → repeat"
        }
      : null
  };
} 