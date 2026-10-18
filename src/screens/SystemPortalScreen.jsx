import { h } from "preact";
import { useState } from "preact/hooks";
import { appState, resetState, activeBlockingInterlock } from "../core/store.js";
import { FRAMES } from "../registry/frames.js";
import { Chip } from "../kit/Chip.jsx";
import { Btn } from "../kit/Btn.jsx";
import { dispatch } from "../core/command.js";

export function SystemPortalScreen() {
  const state = appState.value;
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("all");

  const filteredFrames = FRAMES.filter((f) => {
    if (selectedRoleFilter === "all") return true;
    return f.role.toLowerCase() === selectedRoleFilter.toLowerCase();
  });

  return (
    <div className="panel-scroll" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Top Banner */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h1 className="font-h1">Developer Architecture Master Frame Matrix Portal</h1>
            <Chip tone="slate">DocCare Clinical Suite 3.1</Chip>
            <Chip tone="emerald">Reactive Core Synced</Chip>
          </div>
          <p className="font-body-sm" style={{ color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
            Real-time state debugger, simulation triggers &amp; full 38-frame architectural matrix
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Btn
            variant="danger"
            icon="restart_alt"
            onClick={() => {
              if (confirm("Reset application state back to canonical demonstration baseline?")) {
                resetState();
              }
            }}
          >
            Reset to Canonical Baseline
          </Btn>
          <Btn variant="primary" icon="view_carousel" onClick={() => (window.location.hash = "#/gallery")}>
            Visual Gallery
          </Btn>
        </div>
      </div>

      {/* Live System State Inspector & Simulation Command Center */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px" }}>
        {/* State Telemetry */}
        <div className="card" style={{ background: "var(--color-bg-primary)", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="font-subtitle">Live Reactive State Telemetry</span>
            <Chip tone={activeBlockingInterlock.value ? "red" : "emerald"}>
              {activeBlockingInterlock.value ? `Interlock: ${activeBlockingInterlock.value}` : "System Clear &bull; No Interlocks"}
            </Chip>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
            <div style={{ padding: "8px 12px", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-md)" }}>
              <div className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>PATIENTS IN STORE</div>
              <div className="font-subtitle" style={{ color: "var(--color-interactive-primary)", marginTop: "2px" }}>
                {Object.keys(state.patients || {}).length} Registered
              </div>
            </div>
            <div style={{ padding: "8px 12px", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-md)" }}>
              <div className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>OPD QUEUE ACTIVE</div>
              <div className="font-subtitle" style={{ color: "var(--color-text-primary)", marginTop: "2px" }}>
                {(state.queue || []).length} Tokens
              </div>
            </div>
            <div style={{ padding: "8px 12px", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-md)" }}>
              <div className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>ORDERS IN FLIGHT</div>
              <div className="font-subtitle" style={{ color: "var(--color-text-primary)", marginTop: "2px" }}>
                {(state.orders || []).length} Orders
              </div>
            </div>
            <div style={{ padding: "8px 12px", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-md)" }}>
              <div className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>PRESCRIPTIONS</div>
              <div className="font-subtitle" style={{ color: "var(--color-text-primary)", marginTop: "2px" }}>
                {Object.keys(state.prescriptions || {}).length} Active Rx
              </div>
            </div>
            <div style={{ padding: "8px 12px", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-md)" }}>
              <div className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>WARD BEDS OCCUPIED</div>
              <div className="font-subtitle" style={{ color: "var(--color-text-primary)", marginTop: "2px" }}>
                {state.beds.filter((b) => b.status === "Occupied").length} / {state.beds.length} Beds
              </div>
            </div>
            <div style={{ padding: "8px 12px", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-md)" }}>
              <div className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>WORM AUDIT BLOCKS</div>
              <div className="font-subtitle" style={{ color: "var(--color-clinical-emerald)", marginTop: "2px" }}>
                {state.auditLogs.length} Immutable
              </div>
            </div>
          </div>
        </div>

        {/* Live Simulation Controls */}
        <div className="card" style={{ background: "var(--color-bg-primary)", display: "flex", flexDirection: "column", gap: "10px" }}>
          <span className="font-subtitle">Live End-to-End Simulation Controls</span>
          <div className="font-caption" style={{ color: "var(--color-text-secondary)" }}>
            Execute real automated store reactions across all screens simultaneously:
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <Btn
              size="sm"
              variant="secondary"
              icon="bed"
              onClick={() => {
                dispatch("PATIENT_ADMITTED", {
                  uhid: "UHID-2024-00891",
                  bedId: "BED-04",
                  diagnosis: "Severe Hyperglycemia & Hyperkalemia (K+ 6.8)"
                });
              }}
            >
              Simulate Inpatient Bed Admit
            </Btn>

            <Btn
              size="sm"
              variant="secondary"
              icon="emergency"
              onClick={() => {
                dispatch("PUBLISH_LAB_RESULT", {
                  orderId: "ORD-9021",
                  uhid: "UHID-2024-00891",
                  results: [{ test: "Serum Potassium (K+)", value: "6.8", flag: "Critical Panic High" }],
                  hasCriticalPanic: true
                });
              }}
            >
              Simulate Panic Lab Alert
            </Btn>

            <Btn
              size="sm"
              variant="secondary"
              icon="hourglass_empty"
              onClick={() => (window.location.hash = "#/billing?branch=timeout")}
            >
              Simulate Gateway Timeout
            </Btn>

            <Btn
              size="sm"
              variant="secondary"
              icon="gpp_bad"
              onClick={() => (window.location.hash = "#/workspace?frame=28")}
            >
              Simulate Allergy Stop
            </Btn>
          </div>
        </div>
      </div>

      {/* Master 38-Frame Architectural Matrix Table */}
      <div className="card" style={{ background: "var(--color-bg-primary)", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="font-subtitle">Master Frame Execution Registry (38 Frames)</span>
            <Chip tone="slate">{filteredFrames.length} Frames Shown</Chip>
          </div>

          <div style={{ display: "flex", gap: "6px" }}>
            {["all", "Receptionist", "Doctor", "Nurse", "Lab Tech", "Pharmacist", "Cashier", "Admin"].map((r) => (
              <Btn
                key={r}
                size="sm"
                variant={selectedRoleFilter === r ? "primary" : "ghost"}
                onClick={() => setSelectedRoleFilter(r)}
              >
                {r === "all" ? "All Roles" : r}
              </Btn>
            ))}
          </div>
        </div>

        <table className="table-base">
          <thead>
            <tr>
              <th>Frame #</th>
              <th>Workflow Title</th>
              <th>Role</th>
              <th>Clock</th>
              <th>Architectural Invariant / Clinical Rule</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFrames.map((f) => (
              <tr key={f.id}>
                <td>
                  <span className="font-mono-sm" style={{ fontWeight: "700", color: "var(--color-interactive-primary)" }}>
                    Frame {f.frame}
                  </span>
                </td>
                <td>
                  <strong>{f.title}</strong>
                </td>
                <td>
                  <Chip tone="slate">{f.role}</Chip>
                </td>
                <td>
                  <span className="font-mono-sm">{f.time}</span>
                </td>
                <td style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
                  {f.invariant}
                </td>
                <td>
                  <Btn
                    size="sm"
                    variant="secondary"
                    icon="open_in_new"
                    onClick={() => {
                      window.location.hash = f.route;
                    }}
                  >
                    Teleport
                  </Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
