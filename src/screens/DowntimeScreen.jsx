import { h } from "preact";
import { useState } from "preact/hooks";
import { appState } from "../core/store.js";
import { Chip } from "../kit/Chip.jsx";
import { Btn } from "../kit/Btn.jsx";
import { dispatch } from "../core/command.js";

export function DowntimeScreen() {
  const state = appState.value;

  const [conflicts, setConflicts] = useState([
    {
      id: "SYNC-101",
      entity: "Clinical SOAP Note (Dr. Rao)",
      uhid: "UHID-2024-00891",
      localVersion: "Updated foot dressing protocol: Clean with saline, apply hydrogel dressing, non-weight bearing.",
      serverVersion: "Standard diabetic foot dressing advised.",
      resolution: "Keep Local Draft (Clinical Preference)",
      status: "Ready to Merge"
    },
    {
      id: "SYNC-102",
      entity: "Vitals Reading (Nurse Station)",
      uhid: "UHID-2024-00891",
      localVersion: "BP: 148/92, RBS: 242 mg/dL (Captured 09:12 AM offline)",
      serverVersion: "BP: 140/90, RBS: Pending (Baseline)",
      resolution: "Keep Local Draft (Newer Reading)",
      status: "Ready to Merge"
    }
  ]);

  const [isSyncing, setIsSyncing] = useState(false);

  const handleBatchSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      dispatch("RESOLVE_SYNC_CONFLICTS", { count: conflicts.length });
      setConflicts([]);
      setIsSyncing(false);
    }, 1200);
  };

  return (
    <div className="panel-scroll" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h1 className="font-h1">Offline Downtime Sync &amp; Conflict Resolution Desk</h1>
            <Chip tone="slate">SCR-23 / Frame 25</Chip>
            <Chip tone="emerald">Reconnected: 100 Mbps</Chip>
          </div>
          <p className="font-body-sm" style={{ color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
            Reconnected local database merge with three-way differential inspection
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Btn
            variant="primary"
            icon="sync"
            disabled={conflicts.length === 0 || isSyncing}
            onClick={handleBatchSync}
          >
            {isSyncing ? "Reconciling..." : `Batch Sync All Records (${conflicts.length})`}
          </Btn>
        </div>
      </div>

      {conflicts.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {conflicts.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                background: "var(--color-bg-primary)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                borderLeft: "4px solid var(--color-interactive-primary)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="font-subtitle">{item.entity}</span>
                  <span className="font-mono-sm">{item.uhid}</span>
                </div>
                <Chip tone="emerald">{item.status}</Chip>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {/* Local */}
                <div
                  style={{
                    padding: "10px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--color-bg-secondary)",
                    border: "1px solid var(--color-border-subtle)"
                  }}
                >
                  <div className="font-caption" style={{ color: "var(--color-interactive-primary)", fontWeight: "600" }}>
                    OFFLINE LOCAL DRAFT (TIMESTAMP: 09:12 AM)
                  </div>
                  <div style={{ fontSize: "13px", marginTop: "4px", color: "var(--color-text-primary)" }}>
                    {item.localVersion}
                  </div>
                </div>

                {/* Server */}
                <div
                  style={{
                    padding: "10px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--color-bg-secondary)",
                    border: "1px solid var(--color-border-subtle)"
                  }}
                >
                  <div className="font-caption" style={{ color: "var(--color-text-secondary)", fontWeight: "600" }}>
                    MASTER SERVER RECORD (TIMESTAMP: 08:30 AM)
                  </div>
                  <div style={{ fontSize: "13px", marginTop: "4px", color: "var(--color-text-secondary)" }}>
                    {item.serverVersion}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px solid var(--color-border-subtle)" }}>
                <span className="font-caption" style={{ color: "var(--color-text-secondary)" }}>
                  Auto-Selected Strategy: <strong>{item.resolution}</strong>
                </span>
                <Btn
                  size="sm"
                  variant="secondary"
                  icon="check"
                  onClick={() => setConflicts(conflicts.filter((c) => c.id !== item.id))}
                >
                  Accept &amp; Clear Conflict
                </Btn>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="card"
          style={{
            background: "var(--color-bg-primary)",
            padding: "48px 24px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--color-clinical-emerald)" }}>
            cloud_done
          </span>
          <div className="font-subtitle">All Local Records Successfully Reconciled</div>
          <div className="font-body-sm" style={{ color: "var(--color-text-secondary)", maxWidth: "420px" }}>
            The local encrypted storage is in 100% parity with the central hospital EMR server. Zero pending sync conflicts.
          </div>
          <Btn variant="secondary" onClick={() => (window.location.hash = "#/dashboard")}>
            Return to Clinical Dashboard
          </Btn>
        </div>
      )}
    </div>
  );
}
