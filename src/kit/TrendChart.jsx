import { h } from "preact";

export function TrendChart({ data = [], onOpenSource, title = "Longitudinal Trend: HbA1c (%)" }) {
  // Default Kamalbai HbA1c points if not passed
  const points = data.length > 0 ? data : [
    { date: "14 Feb '26", value: 7.1, type: "in-house", source: "Samruddhi Biochem Lab" },
    { date: "22 May '26", value: 7.9, type: "in-house", source: "Samruddhi Biochem Lab" },
    { date: "12 Aug '26", value: 8.6, type: "external", source: "City Lab (External Scan)" }
  ];

  return (
    <div className="card" style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span className="font-label-bold" style={{ fontSize: "12px", color: "var(--color-text-primary)" }}>{title}</span>
          <div className="font-body-sm" style={{ color: "var(--color-text-muted)", fontSize: "11px" }}>Target: &lt; 7.0 %</div>
        </div>
        {onOpenSource && (
          <button
            type="button"
            className="btn-text"
            style={{ fontSize: "11px", height: "auto", padding: 0 }}
            onClick={onOpenSource}
          >
            View source
          </button>
        )}
      </div>

      {/* SVG Canvas for precision graph */}
      <div style={{ width: "100%", height: "110px", position: "relative" }}>
        <svg viewBox="0 0 300 100" style={{ width: "100%", height: "100%", overflow: "visible" }}>
          {/* Target Reference Line (7.0%) */}
          <line x1="20" y1="75" x2="280" y2="75" stroke="#10B981" strokeDasharray="3 3" strokeWidth="1" />
          <text x="25" y="70" fill="#047857" fontSize="8" fontFamily="Inter">Target 7.0%</text>

          {/* Threshold Reference Line (8.0%) */}
          <line x1="20" y1="45" x2="280" y2="45" stroke="#F59E0B" strokeDasharray="3 3" strokeWidth="1" />
          <text x="25" y="40" fill="#B45309" fontSize="8" fontFamily="Inter">Threshold 8.0%</text>

          {/* Connecting Trend Line */}
          <polyline
            fill="none"
            stroke="#2563EB"
            strokeWidth="2"
            points="50,72 150,48 250,25"
          />

          {/* Point 1: 14 Feb (Solid dot) */}
          <circle cx="50" cy="72" r="4.5" fill="#2563EB" />
          <text x="50" y="62" textAnchor="middle" fill="#0F172A" fontSize="9" fontWeight="600" fontFamily="Inter">7.1</text>
          <text x="50" y="92" textAnchor="middle" fill="#64748B" fontSize="8" fontFamily="Inter">14 Feb</text>

          {/* Point 2: 22 May (Solid dot) */}
          <circle cx="150" cy="48" r="4.5" fill="#2563EB" />
          <text x="150" y="38" textAnchor="middle" fill="#0F172A" fontSize="9" fontWeight="600" fontFamily="Inter">7.9</text>
          <text x="150" y="92" textAnchor="middle" fill="#64748B" fontSize="8" fontFamily="Inter">22 May</text>

          {/* Point 3: 12 Aug (Hollow diamond = external scan) */}
          <polygon points="250,20 255,25 250,30 245,25" fill="#FFF" stroke="#B91C1C" strokeWidth="2" />
          <text x="250" y="15" textAnchor="middle" fill="#B91C1C" fontSize="9" fontWeight="700" fontFamily="Inter">8.6</text>
          <text x="250" y="92" textAnchor="middle" fill="#64748B" fontSize="8" fontFamily="Inter">12 Aug</text>
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "10px", color: "var(--color-text-secondary)", borderTop: "1px solid var(--color-border)", paddingTop: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#2563EB" }} />
          <span>In-house (verified)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ width: "8px", height: "8px", transform: "rotate(45deg)", border: "1.5px solid #B91C1C", backgroundColor: "#FFF" }} />
          <span>External Scan (reviewed)</span>
        </div>
      </div>
    </div>
  );
}

export function Timeline({ events = [], onOpenSource }) {
  const defaultEvents = [
    { date: "12 Aug 2026", title: "External HbA1c report attached (8.6%)", source: "Dr. Kulkarni Scan", hasSource: true },
    { date: "22 May 2026", title: "OPD visit · HbA1c 7.9% · Telmisartan partially dispensed", source: "Dr. R. Rao", badge: "Partial Dispense" },
    { date: "14 Feb 2026", title: "OPD visit · HbA1c 7.1% routine baseline checkup", source: "Controlled baseline" }
  ];

  const list = events.length > 0 ? events : defaultEvents;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "8px 0" }}>
      {list.map((ev, idx) => (
        <div key={idx} style={{ display: "flex", gap: "12px", position: "relative" }}>
          {/* Vertical connecting line */}
          {idx < list.length - 1 && (
            <div style={{ position: "absolute", left: "5px", top: "14px", bottom: "-12px", width: "2px", backgroundColor: "var(--color-border)" }} />
          )}

          {/* Dot */}
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "var(--color-primary)", marginTop: "3px", zIndex: 1 }} />

          <div style={{ flex: 1 }}>
            <div className="font-label-bold" style={{ fontSize: "12px" }}>{ev.date}</div>
            <div className="font-body-sm" style={{ color: "var(--color-text-primary)", marginTop: "2px" }}>{ev.title}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
              <span className="font-body-sm" style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>{ev.source}</span>
              {ev.hasSource && onOpenSource && (
                <button type="button" className="btn-text" style={{ fontSize: "11px", padding: 0 }} onClick={onOpenSource}>
                  View source
                </button>
              )}
              {ev.badge && (
                <span className="chip chip-action-needed" style={{ height: "18px", fontSize: "10px" }}>
                  {ev.badge}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
