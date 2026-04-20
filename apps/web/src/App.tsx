import { useEffect, useState } from "react";
import { api } from "./api";
import type {
  EventRow,
  InsightResponse,
  SpendByAgentRow,
  SpendByModelRow,
  Summary
} from "./types";
import { SummaryCards } from "./components/SummaryCards";
import { Insights } from "./components/Insights";
import { SpendByAgent } from "./components/SpendByAgent";
import { SpendByModel } from "./components/SpendByModel";
import { LiveFeed } from "./components/LiveFeed";

export default function App() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [agents, setAgents] = useState<SpendByAgentRow[]>([]);
  const [models, setModels] = useState<SpendByModelRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [insights, setInsights] = useState<InsightResponse | null>(null);

  useEffect(() => {
    async function load() {
      const [summaryData, agentData, modelData, eventData, insightData] = await Promise.all([
        api.getSummary(),
        api.getAgents(),
        api.getModels(),
        api.getEvents(),
        api.getInsights()
      ]);

      setSummary(summaryData);
      setAgents(agentData);
      setModels(modelData);
      setEvents(eventData);
      setInsights(insightData);
    }

    load();
    const timer = setInterval(load, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main>
      <div style={{ marginBottom: 28 }}>
        <div className="label">Authority v7</div>
        <h1 style={{ margin: "8px 0 0", fontSize: 44 }}>See what your AI agents are actually doing</h1>
      </div>

      <Insights insights={insights} />

      <div style={{ marginTop: 20 }}>
        <SummaryCards summary={summary} />
      </div>

      <div className="grid" style={{ gridTemplateColumns: "2fr 1fr", marginTop: 20 }}>
        <SpendByAgent rows={agents} />
        <SpendByModel rows={models} />
      </div>

      <div style={{ marginTop: 20 }}>
        <LiveFeed events={events} />
      </div>
    </main>
  );
}