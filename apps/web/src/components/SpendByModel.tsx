import type { SpendByModelRow } from "../types";

export function SpendByModel({ rows }: { rows: SpendByModelRow[] }) {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Spend by model</h3>
      <div className="grid">
        {rows.map((row) => (
          <div key={row.model} style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{row.model}</span>
            <span>${row.spend.toFixed(4)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}