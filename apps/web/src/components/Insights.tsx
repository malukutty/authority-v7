import type { InsightResponse } from "../types";

export function Insights({ insights }: { insights: InsightResponse | null }) {
  return (
    <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}>
      <div className="card">
        <div className="label" style={{ color: "#d98c2f" }}>Suspicious run</div>
        <h3>{insights?.suspiciousRun?.title ?? "No suspicious run yet"}</h3>
        {insights?.suspiciousRun && (
          <>
            <div style={{ color: "#9aa4b2" }}>agent: <span className="mono">{insights.suspiciousRun.agent}</span></div>
            <div style={{ color: "#9aa4b2" }}>task: <span className="mono">{insights.suspiciousRun.task}</span></div>
            <div style={{ marginTop: 12 }}>{insights.suspiciousRun.subtitle}</div>
          </>
        )}
      </div>
      <div className="card">
        <div className="label" style={{ color: "#d98c2f" }}>Loop detection</div>
        <h3>{insights?.loopDetection?.title ?? "No retry loop yet"}</h3>
        {insights?.loopDetection && (
          <>
            <div style={{ color: "#9aa4b2" }}>agent: <span className="mono">{insights.loopDetection.agent}</span></div>
            <div style={{ color: "#9aa4b2" }}>task: <span className="mono">{insights.loopDetection.task}</span></div>
            <div style={{ marginTop: 12 }}>{insights.loopDetection.subtitle}</div>
          </>
        )}
      </div>
    </div>
  );
}