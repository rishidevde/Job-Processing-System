import { h } from "preact";
import { appState } from "../core/store.js";
import { PayerPill } from "./Chip.jsx";
import { Btn } from "./Btn.jsx";
import { dispatch } from "../core/command.js";

export function PatientStrip({ uhid = "884021", encounterId = "OPD-8843", onOpenAdmitModal }) {
  const state = appState.value;
  const patient = state.patients[uhid] || state.patients["884021"];
  const enc = state.encounters[encounterId] || state.encounters["OPD-8843"];

  const hasAllergy = patient.allergies && patient.allergies.length > 0;
  const allergy = hasAllergy ? patient.allergies[0] : null;

  return (
    <div className="patient-identity-strip">
      {/* Left: Demographics */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#EFF6FF",
            color: "var(--color-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "14px"
          }}
        >
          {patient.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="font-h3" style={{ fontSize: "15px" }}>{patient.name}</span>
            <span className="font-body-sm" style={{ color: "var(--color-text-secondary)" }}>
              {patient.age}Y · {patient.gender}
            </span>
            <PayerPill payer={patient.payer || "Cash"} memberRef={patient.payerRef} />
            {patient.bed && (
              <span className="chip chip-action-needed" style={{ height: "20px", fontSize: "11px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>bed</span>
                Bed {patient.bed}
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "2px" }} className="font-data-mono font-body-sm">
            <span>UHID: <strong>{patient.uhid}</strong></span>
            <span style={{ color: "var(--color-border-subtle)" }}>•</span>
            <span>Encounter: <strong>{enc ? enc.id : encounterId}</strong></span>
            {enc && (
              <>
                <span style={{ color: "var(--color-border-subtle)" }}>•</span>
                <span style={{ color: "var(--color-text-secondary)" }}>{enc.doctor} ({enc.room || "Room 4"})</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Critical Allergy Chip & Quick Clinical Action */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {hasAllergy && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "4px",
              backgroundColor: "var(--color-critical-bg)",
              border: "1px solid var(--color-critical-border)",
              color: "var(--color-critical-text)",
              fontSize: "12px",
              fontWeight: 600
            }}
            title={allergy.note || "Severe allergy reaction"}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>warning</span>
            <span>Allergy: {allergy.agent} ({allergy.reaction})</span>
          </div>
        )}

        {/* Quick Admit Button if patient not yet in ward */}
        {!patient.bed ? (
          <Btn
            variant="outline-action"
            icon="bed"
            onClick={onOpenAdmitModal}
            className="btn-sm"
          >
            Admit to Ward
          </Btn>
        ) : (
          <span className="chip chip-completed">
            <span className="material-symbols-outlined">verified</span>
            Inpatient Active
          </span>
        )}
      </div>
    </div>
  );
}
