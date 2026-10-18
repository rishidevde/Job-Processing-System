import { h } from "preact";
import { useState } from "preact/hooks";
import { appState } from "../core/store.js";
import { Chip } from "../kit/Chip.jsx";
import { Btn } from "../kit/Btn.jsx";
import { DataTable } from "../kit/DataTable.jsx";

export function AuditScreen() {
  const state = appState.value;
  const [filterType, setFilterType] = useState("all");

  const auditLogs = state.auditLogs || [];

  const filtered = auditLogs.filter((log) => {
    if (filterType === "interlocks") return log.action.includes("ALLERGY") || log.action.includes("READBACK") || log.action.includes("BLOCKER");
    if (filterType === "clinical") return log.actorRole === "Doctor" || log.actorRole === "Nurse";
    return true;
  });

  const columns = [
    {
      key: "timestamp",
      header: "Timestamp (IST)",
      render: (val) => <span className="font-mono-sm">{val}</span>
    },
    {
      key: "actorName",
      header: "Actor / Role",
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: "600", fontSize: "13px" }}>{val}</div>
          <div className="font-caption" style={{ color: "var(--color-text-secondary)" }}>
            {row.actorRole} &bull; IP: 192.168.1.104
          </div>
        </div>
      )
    },
    {
      key: "action",
      header: "Governance Action",
      render: (val) => (
        <span style={{ fontWeight: "600", color: "var(--color-interactive-primary)" }}>
          {val}
        </span>
      )
    },
    {
      key: "details",
      header: "Payload &amp; Verification Chain",
      render: (val) => (
        <div style={{ maxWidth: "340px", fontSize: "12px", color: "var(--color-text-secondary)" }}>
          {typeof val === "object" ? JSON.stringify(val) : String(val)}
        </div>
      )
    },
    {
      key: "hash",
      header: "WORM Block Hash",
      render: (val) => (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Chip tone="slate">{val || "DEMO-HASH-0041"}</Chip>
        </div>
      )
    }
  ];

  return (
    <div className="panel-scroll" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h1 className="font-h1">WORM Cryptographic Audit Trail &amp; Forensic Log</h1>
            <Chip tone="slate">NABH / ISO 27001 Certified</Chip>
          </div>
          <p className="font-body-sm" style={{ color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
            Write-Once-Read-Many (WORM) tamper-evident compliance log (SCR-21 / Frame 23)
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Btn
            variant={filterType === "all" ? "primary" : "secondary"}
            onClick={() => setFilterType("all")}
          >
            All Logs ({auditLogs.length})
          </Btn>
          <Btn
            variant={filterType === "interlocks" ? "primary" : "secondary"}
            onClick={() => setFilterType("interlocks")}
          >
            Safety Interlocks
          </Btn>
          <Btn
            variant={filterType === "clinical" ? "primary" : "secondary"}
            onClick={() => setFilterType("clinical")}
          >
            Clinical Decisions
          </Btn>
          <Btn
            variant="secondary"
            icon="download"
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
              const downloadAnchor = document.createElement("a");
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", `WORM_AUDIT_TRAIL_${Date.now()}.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
          >
            Export JSON
          </Btn>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        emptyMessage="No cryptographic audit records matching criteria."
      />
    </div>
  );
}
