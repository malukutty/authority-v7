import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { SpendByAgentRow } from "../types";

export function SpendByAgent({ rows }: { rows: SpendByAgentRow[] }) {
  return (
    <div className="card" style={{ height: 300 }}>
      <h3 style={{ marginTop: 0 }}>Spend by agent</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={rows}>
          <XAxis dataKey="agent" stroke="#7d8798" />
          <YAxis stroke="#7d8798" />
          <Tooltip />
          <Bar dataKey="spend" fill="#d98c2f" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}