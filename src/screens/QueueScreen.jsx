import { h } from "preact";
import { useState } from "preact/hooks";
import { appState } from "../core/store.js";
import { currentRoute } from "../core/router.js";
import { Chip, PayerPill } from "../kit/Chip.jsx";
import { Btn } from "../kit/Btn.jsx";
import { Modal } from "../kit/Modal.jsx";
import { dispatch } from "../core/command.js";

export function QueueScreen() {
  const state = appState.value;
  const isForceEmpty = currentRoute.value.query.state === "empty";
  const [callNextModalOpen, setCallNextModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("live");
  const [filterPayer, setFilterPayer] = useState("all");

  const queueList = isForceEmpty ? [] : state.queue;

  const nextWaitingPatient = queueList.find((q) => q.state === "Waiting") || {
    token: "T-015",
    name: "Mr. Sanjay More, 52M",
    doctor: "Dr. R. Rao"
  };

  return (
    <div className="panel-scroll" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header Row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 className="font-h1">Appointments and OPD Queue</h1>
          <p className="font-body-sm" style={{ color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
            Real-time live OPD intake &amp; consultation dispatch stream
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {isForceEmpty ? (
            <Btn variant="secondary" onClick={() => (window.location.hash = "#/queue")}>
              Show Active Queue (5)
            </Btn>
          ) : (
            <Btn variant="secondary" onClick={() => (window.location.hash = "#/queue?state=empty")}>
              Preview Empty State (Frame 26)
            </Btn>
          )}
          <Btn variant="secondary" icon="person_add" onClick={() => (window.location.hash = "#/registration")}>
            Register Walk-in
          </Btn>
          <Btn
            variant="primary"
            icon="campaign"
            disabled={queueList.length === 0}
            onClick={() => setCallNextModalOpen(true)}
          >
            Call Next
          </Btn>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "24px", borderBottom: "1px solid var(--color-border)" }}>
        {[
          { id: "calendar", label: "Calendar" },
          { id: "live", label: "Live token queue" },
          { id: "load", label: "Doctor-wise load" },
          { id: "lab_return", label: "Return from lab" }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            style={{
              padding: "10px 4px",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid var(--color-primary)" : "2px solid transparent",
              color: activeTab === tab.id ? "var(--color-primary)" : "var(--color-text-secondary)",
              fontWeight: activeTab === tab.id ? 600 : 500,
              fontSize: "13px",
              cursor: "pointer"
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          backgroundColor: "#FFF",
          borderRadius: "6px",
          border: "1px solid var(--color-border)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "12px" }}>
          <span>Date: <strong>18 Oct 2026</strong></span>
          <span style={{ color: "var(--color-border)" }}>|</span>
          <span>Doctor: <strong>Dr. R. Rao</strong></span>
          <span style={{ color: "var(--color-border)" }}>|</span>
          <span>Dept: <strong>General Medicine OPD</strong></span>
          <span style={{ color: "var(--color-border)" }}>|</span>
          <span>Payer: </span>
          <select
            className="field-select"
            style={{ height: "28px", padding: "0 8px", fontSize: "11px" }}
            value={filterPayer}
            onChange={(e) => setFilterPayer(e.target.value)}
          >
            <option value="all">All Payers</option>
            <option value="TPA">TPA</option>
            <option value="Cash">Cash</option>
            <option value="Scheme">Scheme</option>
          </select>
        </div>

        <div style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
          <strong>{queueList.length}</strong> results
        </div>
      </div>

      {/* Queue Table or Empty State (Frame 26) */}
      <div className="card">
        {queueList.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--color-text-muted)" }}>
              queue
            </span>
            <h3 className="font-h2" style={{ fontSize: "16px" }}>No patients currently in queue</h3>
            <p className="font-body-sm" style={{ color: "var(--color-text-secondary)", maxWidth: "400px" }}>
              No patients match these filters for Dr. R. Rao on 18 Oct 2026. New walk-ins or scheduled appointments will appear here.
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              <Btn variant="primary" icon="person_add" onClick={() => (window.location.hash = "#/registration")}>
                Register Walk-in
              </Btn>
              <Btn variant="secondary" icon="refresh" onClick={() => (window.location.hash = "#/queue")}>
                Refresh Queue
              </Btn>
            </div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: "70px", textAlign: "center" }}>Token</th>
                  <th>Patient Details</th>
                  <th>Type</th>
                  <th>Payer</th>
                  <th>Arrival</th>
                  <th>Wait Time</th>
                  <th>Assigned Doctor</th>
                  <th>State</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {queueList.map((q) => (
                  <tr key={q.token} className={q.uhid === "884021" ? "row-selected" : ""}>
                    <td style={{ textAlign: "center", fontWeight: 700 }} className="font-data-mono">
                      {q.token}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{q.name}</div>
                      <div className="font-data-mono font-body-sm" style={{ color: "var(--color-text-muted)" }}>
                        UHID {q.uhid}
                      </div>
                    </td>
                    <td>{q.type}</td>
                    <td>
                      <PayerPill payer={q.payer} />
                    </td>
                    <td className="font-data-mono font-body-sm">{q.arrivalTime}</td>
                    <td className="font-data-mono font-body-sm" style={{ color: q.waitTime !== "—" ? "var(--color-text-secondary)" : "var(--color-text-muted)" }}>
                      {q.waitTime}
                    </td>
                    <td className="font-body-sm">{q.doctor}</td>
                    <td>
                      <Chip status={q.state} />
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                        {q.state === "In consultation" ? (
                          <Btn variant="primary" className="btn-sm" onClick={() => (window.location.hash = "#/workspace/OPD-8843")}>
                            Consult
                          </Btn>
                        ) : q.state === "Completed" ? (
                          <Btn variant="sm" onClick={() => (window.location.hash = "#/documents/OPD-8843")}>
                            Summary
                          </Btn>
                        ) : (
                          <Btn variant="sm" onClick={() => (window.location.hash = "#/workspace/OPD-8843")}>
                            Call
                          </Btn>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Call Next Confirmation Modal (prototype1.md §7 Frame 03) */}
      {callNextModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setCallNextModalOpen(false)}
          title="Confirm Patient Queue Dispatch"
          subtitle="Call next scheduled patient into consultation cabin"
          size="sm"
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", width: "100%" }}>
              <Btn variant="secondary" onClick={() => setCallNextModalOpen(false)}>
                Cancel
              </Btn>
              <Btn
                variant="primary"
                icon="campaign"
                onClick={() => {
                  setCallNextModalOpen(false);
                  window.location.hash = "#/workspace/OPD-8843";
                }}
              >
                Confirm Call (Token {nextWaitingPatient.token})
              </Btn>
            </div>
          }
        >
          <div style={{ fontSize: "13px", lineHeight: "20px" }}>
            Dispatching Token <strong>{nextWaitingPatient.token}</strong> ({nextWaitingPatient.name}) to <strong>{nextWaitingPatient.doctor}</strong> in Room 4.
          </div>
        </Modal>
      )}
    </div>
  );
}
