import { h } from "preact";
import { appState } from "../core/store.js";
import { KpiCard, ExceptionCard } from "../kit/KpiCard.jsx";
import { Chip, PayerPill } from "../kit/Chip.jsx";
import { Btn } from "../kit/Btn.jsx";
import { liveClock } from "../core/clock.js";

export function DashboardScreen() {
  const state = appState.value;

  // Derive counts from live state
  const waitingCount = state.queue.filter((q) => q.state === "Waiting").length;
  const inConsultCount = state.queue.filter((q) => q.state === "In consultation").length;
  const resultsAwaitingReview = 2; // ORD-9923 creatinine, ORD-9930 potassium
  const exceptionTasksCount = 3;

  return (
    <div className="panel-scroll" style={{ display: "flex", flexDirection: "column", gap: "20px", paddingBottom: "24px" }}>
      {/* Title & Status Banner */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--color-border)", paddingBottom: "12px" }}>
        <div>
          <h1 className="font-h1">Dashboard — OPD, {liveClock.value.date}</h1>
          <p className="font-body-md" style={{ color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
            Dr. R. Rao · General Medicine OPD · Active Session Clock: <strong className="font-data-mono" style={{ color: "var(--color-interactive-primary)" }}>{liveClock.value.time}</strong>
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="chip chip-completed" style={{ padding: "4px 10px", height: "auto" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>check_circle</span>
            OPD Room 4 Active
          </span>
        </div>
      </div>

      {/* 4 KPI Summary Cards (Frame 02) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        <KpiCard title="Waiting" value={waitingCount} icon="hourglass_top" />
        <KpiCard title="In consultation" value={inConsultCount} icon="record_voice_over" highlight={true} />
        <KpiCard title="Results awaiting review" value={resultsAwaitingReview} icon="biotechnology" />
        <KpiCard title="Exception tasks" value={exceptionTasksCount} icon="report" alert={true} alertTone="critical" />
      </div>

      {/* Asymmetric Workspace: Left 68% Queue | Right 32% Exception Inbox */}
      <div className="split-68-32">
        {/* Left: Live OPD Queue */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2 className="font-h3">OPD Queue (Dr. R. Rao)</h2>
              <span className="font-label-bold" style={{ backgroundColor: "#F1F5F9", padding: "2px 8px", borderRadius: "9999px", fontSize: "11px" }}>
                {state.queue.length} Patients
              </span>
            </div>
            <Btn variant="sm" icon="refresh" onClick={() => (window.location.hash = "#/queue")}>
              View Live Queue
            </Btn>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: "60px", textAlign: "center" }}>Token</th>
                  <th>Patient Details</th>
                  <th>Billing</th>
                  <th>Arrival</th>
                  <th>Wait</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {state.queue.map((q) => {
                  const isKamalbai = q.uhid === "884021";

                  return (
                    <tr key={q.token} className={isKamalbai ? "row-selected" : ""}>
                      <td style={{ textAlign: "center", fontWeight: 700 }} className="font-data-mono">
                        {q.token}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{q.name}</div>
                        <div className="font-data-mono font-body-sm" style={{ color: "var(--color-text-muted)" }}>
                          UHID {q.uhid} · {q.type}
                        </div>
                      </td>
                      <td>
                        <PayerPill payer={q.payer} />
                      </td>
                      <td className="font-data-mono font-body-sm">{q.arrivalTime}</td>
                      <td className="font-data-mono font-body-sm" style={{ color: q.waitTime !== "—" ? "var(--color-text-secondary)" : "var(--color-text-muted)" }}>
                        {q.waitTime}
                      </td>
                      <td>
                        <Chip status={q.state} />
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {q.state === "In consultation" ? (
                          <Btn
                            variant="primary"
                            className="btn-sm"
                            onClick={() => (window.location.hash = "#/workspace/OPD-8843")}
                          >
                            Open workspace
                          </Btn>
                        ) : q.state === "Completed" ? (
                          <Btn
                            variant="sm"
                            onClick={() => (window.location.hash = "#/documents/OPD-8843")}
                          >
                            View summary
                          </Btn>
                        ) : (
                          <Btn
                            variant="sm"
                            onClick={() => (window.location.hash = `#/workspace/${q.uhid === "884021" ? "OPD-8843" : "OPD-8851"}`)}
                          >
                            Call next
                          </Btn>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Exception Inbox (3 Items) */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h2 className="font-h3">Exception Inbox</h2>
              <span style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700 }}>
                3
              </span>
            </div>
            <span className="font-label-bold" style={{ fontSize: "11px", color: "var(--color-critical-text)" }}>
              Escalation Active
            </span>
          </div>

          <div className="card-body panel-scroll" style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "14px" }}>
            {/* Card 1: Critical Potassium */}
            <ExceptionCard
              severity="Critical (clinical)"
              title="Serum potassium 6.8 mmol/L — read-back pending"
              patientName="Mr. Rajeshwar Patil"
              patientUhid="884150"
              patientEncounter="OPD-8851"
              owner="Dr. R. Rao · Verified by LIS Biochem"
              ageText="33 min ago"
              actionLabel="Open critical result"
              actionVariant="destructive"
              onAction={() => (window.location.hash = "#/critical?modal=readback")}
            />

            {/* Card 2: Metformin Stock-Out */}
            <ExceptionCard
              severity="Action needed"
              title="Metformin 500 mg unavailable — prescriber decision needed"
              patientName="Mrs. Kamalbai Deshmukh"
              patientUhid="884021"
              owner="Dr. R. Rao · Pharmacy Notification"
              ageText="4 min ago"
              actionLabel="Review stock-out"
              actionVariant="outline"
              onAction={() => (window.location.hash = "#/workspace/OPD-8843?state=stockout")}
            />

            {/* Card 3: Serum Creatinine */}
            <ExceptionCard
              severity="Action needed"
              title="Serum creatinine resulted — awaiting review"
              patientName="Mrs. Kamalbai Deshmukh"
              patientUhid="884021"
              owner="Dr. R. Rao · Value: 1.4 mg/dL"
              ageText="7 min ago"
              actionLabel="Open result"
              onAction={() => (window.location.hash = "#/orders")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
