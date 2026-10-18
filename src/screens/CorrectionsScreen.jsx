import { h } from "preact";
import { useState } from "preact/hooks";
import { appState } from "../core/store.js";
import { Chip } from "../kit/Chip.jsx";
import { Btn } from "../kit/Btn.jsx";
import { dispatch } from "../core/command.js";

export function CorrectionsScreen() {
  const state = appState.value;

  const [survivingUhid, setSurvivingUhid] = useState("UHID-2024-00891");
  const [justification, setJustification] = useState("Patient confirmed married name change from Patil to Deshmukh. Identical phone & address.");

  const p1 = {
    uhid: "UHID-2024-00891",
    name: "Kamalbai Deshmukh",
    age: "58",
    gender: "Female",
    phone: "98230 12345",
    payer: "Star Health TPA",
    address: "Flat 402, Shivneri Heights, Kolhapur",
    allergies: "Penicillin (Severe)",
    registeredAt: "Today 09:00 AM",
    visits: 1
  };

  const p2 = {
    uhid: "UHID-2024-00142",
    name: "Kamalbai Patil",
    age: "58",
    gender: "Female",
    phone: "98230 12345",
    payer: "Cash / Self-Pay",
    address: "Shivneri Heights, Pune Road, Kolhapur",
    allergies: "Penicillin",
    registeredAt: "14-Feb-2024",
    visits: 2
  };

  const handleMergeRecords = () => {
    dispatch("MERGE_PATIENTS", {
      survivor: survivingUhid,
      archived: survivingUhid === p1.uhid ? p2.uhid : p1.uhid,
      justification
    });
    window.location.hash = "#/registry";
  };

  return (
    <div className="panel-scroll" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h1 className="font-h1">Patient Identity Deduplication &amp; Record Merge Desk</h1>
            <Chip tone="plum">Confidence Match: 91.4%</Chip>
          </div>
          <p className="font-body-sm" style={{ color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
            Biometric &amp; demographic collision resolution with surviving record selection (SCR-14 / Frame 16)
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Btn variant="secondary" icon="arrow_back" onClick={() => (window.location.hash = "#/registry")}>
            Patient Registry
          </Btn>
          <Btn variant="primary" icon="merge" onClick={handleMergeRecords}>
            Execute Merge &amp; Archive Duplicate
          </Btn>
        </div>
      </div>

      {/* Side-by-Side Dual Column Comparison */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Record A */}
        <div
          className="card"
          style={{
            background: "var(--color-bg-primary)",
            border: survivingUhid === p1.uhid ? "2px solid var(--color-clinical-emerald)" : "1px solid var(--color-border-subtle)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "16px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="font-subtitle">Candidate Record A (Current Encounter)</span>
            <input
              type="radio"
              name="survivor"
              checked={survivingUhid === p1.uhid}
              onChange={() => setSurvivingUhid(p1.uhid)}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
            <div>UHID: <strong className="font-mono-sm">{p1.uhid}</strong></div>
            <div>Full Name: <strong>{p1.name}</strong></div>
            <div>Age / Gender: <strong>{p1.age}y / {p1.gender}</strong></div>
            <div>Phone: <strong>{p1.phone}</strong></div>
            <div>Payer: <strong>{p1.payer}</strong></div>
            <div>Address: <span>{p1.address}</span></div>
            <div>Allergies: <span style={{ color: "var(--color-clinical-red)", fontWeight: "600" }}>{p1.allergies}</span></div>
            <div>Registered: <span>{p1.registeredAt}</span></div>
          </div>

          <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1px solid var(--color-border-subtle)" }}>
            <Btn
              fullWidth
              variant={survivingUhid === p1.uhid ? "primary" : "secondary"}
              onClick={() => setSurvivingUhid(p1.uhid)}
            >
              {survivingUhid === p1.uhid ? "Surviving Primary Master" : "Select as Master"}
            </Btn>
          </div>
        </div>

        {/* Record B */}
        <div
          className="card"
          style={{
            background: "var(--color-bg-primary)",
            border: survivingUhid === p2.uhid ? "2px solid var(--color-clinical-emerald)" : "1px solid var(--color-border-subtle)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "16px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="font-subtitle">Candidate Record B (Historical Profile)</span>
            <input
              type="radio"
              name="survivor"
              checked={survivingUhid === p2.uhid}
              onChange={() => setSurvivingUhid(p2.uhid)}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
            <div>UHID: <strong className="font-mono-sm">{p2.uhid}</strong></div>
            <div>Full Name: <strong>{p2.name}</strong></div>
            <div>Age / Gender: <strong>{p2.age}y / {p2.gender}</strong></div>
            <div>Phone: <strong>{p2.phone}</strong></div>
            <div>Payer: <strong>{p2.payer}</strong></div>
            <div>Address: <span>{p2.address}</span></div>
            <div>Allergies: <span style={{ color: "var(--color-clinical-red)", fontWeight: "600" }}>{p2.allergies}</span></div>
            <div>Registered: <span>{p2.registeredAt}</span></div>
          </div>

          <div style={{ marginTop: "auto", paddingTop: "12px", borderTop: "1px solid var(--color-border-subtle)" }}>
            <Btn
              fullWidth
              variant={survivingUhid === p2.uhid ? "primary" : "secondary"}
              onClick={() => setSurvivingUhid(p2.uhid)}
            >
              {survivingUhid === p2.uhid ? "Surviving Primary Master" : "Select as Master"}
            </Btn>
          </div>
        </div>
      </div>

      {/* Justification & Governance Box */}
      <div className="card" style={{ background: "var(--color-bg-primary)", display: "flex", flexDirection: "column", gap: "10px" }}>
        <span className="font-subtitle-sm">Mandatory Deduplication Audit Rationale</span>
        <textarea
          className="input-base"
          rows={2}
          style={{ width: "100%", resize: "vertical" }}
          value={justification}
          onInput={(e) => setJustification(e.target.value)}
        />
        <div className="font-caption" style={{ color: "var(--color-text-secondary)" }}>
          Notice: The non-surviving record will be archived. All longitudinal encounters, lab reports, and prescriptions will be re-parented to the surviving master UHID.
        </div>
      </div>
    </div>
  );
}
