import type { EventRow } from "../types";

export function LiveFeed({ events }: { events: EventRow[] }) {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Live feed</h3>
      <div className="grid">
        {events.map((event) => (
          <div
            key={event.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1.2fr 1fr 1fr 0.8fr",
              gap: 12,
              color: "#c8ced8",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 13
            }}
          >
           <span>{event?.agent ?? "—"}</span>
<span>{event?.task ?? "—"}</span>
<span>{event?.model ?? "—"}</span>
<span>
  $
  {Number.isFinite(Number(event?.cost_usd))
    ? Number(event.cost_usd).toFixed(4)
    : "0.0000"}
</span>
<span>{event?.provider ?? "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}