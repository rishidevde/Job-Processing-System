import { h } from "preact";
import { useState } from "preact/hooks";
import { appState } from "../core/store.js";
import { Chip } from "../kit/Chip.jsx";
import { Btn } from "../kit/Btn.jsx";
import { dispatch } from "../core/command.js";

export function ClarificationsScreen() {
  const state = appState.value;
  const [activeTab, setActiveTab] = useState("clarifications");
  const [replyText, setReplyText] = useState("");

  const [clarifications, setClarifications] = useState([
    {
      id: "CLR-401",
      rxId: "RX-7710",
      patient: "Kamalbai Deshmukh (UHID-2024-00891)",
      prescriber: "Dr. Rajesh Rao",
      pharmacist: "Pooja Mehta, RPh",
      query:
        "Glimepiride 2mg out of stock at OPD Pharmacy. Proposed substitution: Gliclazide 80mg MR or Teneligliptin 20mg. Requesting prescriber authorization.",
      response: "Approved switch to Gliclazide 80mg MR once daily after breakfast. Note updated in SOAP plan.",
      status: "Resolved",
      time: "10:14 AM"
    },
    {
      id: "CLR-402",
      rxId: "RX-7689",
      patient: "Suresh Jadhav (UHID-2024-00720)",
      prescriber: "Dr. Ananya Sen",
      pharmacist: "Kiran Shinde, RPh",
      query:
        "Prescribed dosage of Enoxaparin 60mg SC q12h appears high given calculated CrCl of 32 mL/min. Recommend renal dose adjustment to 40mg SC q24h.",
      response: null,
      status: "Awaiting Prescriber",
      time: "10:28 AM"
    }
  ]);

  const handleSendReply = (id) => {
    if (!replyText.trim()) return;
    setClarifications(
      clarifications.map((c) =>
        c.id === id ? { ...c, response: replyText, status: "Resolved" } : c
      )
    );
    dispatch("RESOLVE_CLARIFICATION", { id, response: replyText });
    setReplyText("");
  };

  return (
    <div className="panel-scroll" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 className="font-h1">Prescriber Clarifications &amp; Drug Returns Desk</h1>
          <p className="font-body-sm" style={{ color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
            Real-time pharmacovigilance communication, dose adjustments &amp; IPD returns (SCR-18 / Frame 20)
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Btn
            variant={activeTab === "clarifications" ? "primary" : "secondary"}
            onClick={() => setActiveTab("clarifications")}
          >
            Clarifications Queue ({clarifications.length})
          </Btn>
          <Btn
            variant={activeTab === "returns" ? "primary" : "secondary"}
            onClick={() => setActiveTab("returns")}
          >
            Ward Returns (2)
          </Btn>
          <Btn variant="secondary" icon="arrow_back" onClick={() => (window.location.hash = "#/pharmacy")}>
            Pharmacy Desk
          </Btn>
        </div>
      </div>

      {activeTab === "clarifications" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {clarifications.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                background: "var(--color-bg-primary)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                borderLeft: item.status === "Resolved" ? "4px solid var(--color-clinical-emerald)" : "4px solid var(--color-operational-plum)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span className="font-subtitle">{item.id}</span>
                  <span className="font-mono-sm">{item.rxId}</span>
                  <Chip tone={item.status === "Resolved" ? "emerald" : "plum"}>
                    {item.status}
                  </Chip>
                </div>
                <span className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>
                  {item.time}
                </span>
              </div>

              <div style={{ fontSize: "13px" }}>
                Patient: <strong>{item.patient}</strong> &bull; Attending: <strong>{item.prescriber}</strong> &bull; Pharmacist: <strong>{item.pharmacist}</strong>
              </div>

              <div
                style={{
                  padding: "10px 14px",
                  background: "var(--color-bg-secondary)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border-subtle)",
                  fontSize: "13px"
                }}
              >
                <strong>Query:</strong> {item.query}
              </div>

              {item.response ? (
                <div
                  style={{
                    padding: "10px 14px",
                    background: "var(--color-emerald-50)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-clinical-emerald)",
                    fontSize: "13px",
                    color: "var(--color-emerald-700)"
                  }}
                >
                  <strong>Physician Authorization:</strong> {item.response}
                </div>
              ) : (
                <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                  <input
                    className="input-base"
                    placeholder="Enter physician dosage adjustment or substitution approval..."
                    style={{ flex: 1 }}
                    value={replyText}
                    onInput={(e) => setReplyText(e.target.value)}
                  />
                  <Btn variant="primary" icon="send" onClick={() => handleSendReply(item.id)}>
                    Authorize Resolution
                  </Btn>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Ward Returns Tab */
        <div className="card" style={{ background: "var(--color-bg-primary)", display: "flex", flexDirection: "column", gap: "12px" }}>
          <span className="font-subtitle">IPD Inpatient Medication Returns to Central Inventory</span>
          <table className="table-base">
            <thead>
              <tr>
                <th>Return ID</th>
                <th>Ward / Bed</th>
                <th>Patient</th>
                <th>Returned Drug &amp; Strength</th>
                <th>Quantity</th>
                <th>Batch #</th>
                <th>Pharmacist Inspection</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="font-mono-sm">RET-881</span></td>
                <td>Medical Ward Bed 04</td>
                <td>Kamalbai Deshmukh</td>
                <td>Inj. Ondansetron 4mg/2ml</td>
                <td>2 ampoules (Unopened)</td>
                <td>OD-9182</td>
                <td><Chip tone="emerald">Tamper Seal Intact</Chip></td>
              </tr>
              <tr>
                <td><span className="font-mono-sm">RET-880</span></td>
                <td>ICU Bed 02</td>
                <td>Ramesh Patil</td>
                <td>Inj. Pantoprazole 40mg IV</td>
                <td>1 vial</td>
                <td>PT-3321</td>
                <td><Chip tone="emerald">Restocked to Shelves</Chip></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
