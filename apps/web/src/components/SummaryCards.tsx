import type { Summary } from "../types";

export function SummaryCards({ summary }: { summary: Summary | null }) {
  const items = [
    ["Spend", `$${(summary?.spend ?? 0).toFixed(2)}`],
    ["Requests", summary?.requests ?? 0],
    ["Agents", summary?.agents ?? 0],
    ["Tasks", summary?.tasks ?? 0],
    ["Blocked", summary?.blocked ?? 0]
  ];

  return (
    <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
      {items.map(([label, value]) => (
        <div key={String(label)} className="card">
          <div className="label">{label}</div>
          <div style={{ fontSize: 28, marginTop: 8, fontWeight: 700 }}>{value}</div>
        </div>
      ))}
    </div>
  );
}