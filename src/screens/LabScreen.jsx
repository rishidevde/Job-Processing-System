import { h } from "preact";
import { useState } from "preact/hooks";
import { appState } from "../core/store.js";
import { currentRoute } from "../core/router.js";
import { Chip } from "../kit/Chip.jsx";
import { Btn } from "../kit/Btn.jsx";
import { Modal } from "../kit/Modal.jsx";
import { dispatch } from "../core/command.js";

export function LabScreen() {
  const state = appState.value;
  const isRejectQuery = currentRoute.value.query.action === "reject" || currentRoute.value.query.frame === "29";

  const [rejectModalOpen, setRejectModalOpen] = useState(isRejectQuery);
  const [rejectReason, setRejectReason] = useState("Gross Hemolysis (+++ In Vitro Hemolysis)");
  const [rejectionNotes, setRejectionNotes] = useState("Serum visibly crimson pink post centrifugation; invalidates K+ measurement.");

  const [results, setResults] = useState([
    {
      test: "Serum Potassium (K+)",
      value: "6.8",
      unit: "mEq/L",
      refRange: "3.5 - 5.1",
      flag: "Critical Panic High",
      flagTone: "red",
      delta: "+2.2 (Previous: 4.6 mEq/L)"
    },
    {
      test: "Serum Creatinine",
      value: "2.1",
      unit: "mg/dL",
      refRange: "0.6 - 1.2",
      flag: "Delta Deviation Warning",
      flagTone: "amber",
      delta: "+0.9 (Previous: 1.2 mg/dL - 75% spike)"
    },
    {
      test: "Serum Sodium (Na+)",
      value: "138",
      unit: "mEq/L",
      refRange: "135 - 145",
      flag: "Normal",
      flagTone: "slate",
      delta: "Stable"
    },
    {
      test: "Blood Urea Nitrogen (BUN)",
      value: "38",
      unit: "mg/dL",
      refRange: "7 - 20",
      flag: "Elevated",
      flagTone: "amber",
      delta: "+14 mg/dL"
    }
  ]);

  const handlePublishResults = () => {
    // Triggers panic reaction if K+ is 6.8
    dispatch("PUBLISH_LAB_RESULT", {
      orderId: "ORD-9021",
      uhid: "UHID-2024-00891",
      results,
      hasCriticalPanic: true
    });
    window.location.hash = "#/critical";
  };

  const handleConfirmRejection = () => {
    dispatch("SPECIMEN_REJECTED", {
      orderId: "ORD-9021",
      uhid: "UHID-2024-00891",
      reason: rejectReason,
      notes: rejectionNotes
    });
    setRejectModalOpen(false);
  };

  return (
    <div className="panel-scroll" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h1 className="font-h1">LIS Accessioning &amp; Quality Control Desk</h1>
            <Chip tone="slate">Analyzer: Roche Cobas c501</Chip>
            {isRejectQuery && <Chip tone="red">Frame 29: Specimen Rejection Flow</Chip>}
          </div>
          <p className="font-body-sm" style={{ color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
            Automated Delta-Check detection &amp; pre-analytical sample validity guard (SCR-09 / Frames 10, 29)
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Btn
            variant="secondary"
            onClick={() => {
              if (isRejectQuery) {
                window.location.hash = "#/lab";
                setRejectModalOpen(false);
              } else {
                window.location.hash = "#/lab?frame=29";
                setRejectModalOpen(true);
              }
            }}
          >
            {isRejectQuery ? "Show Normal Accession (Frame 10)" : "Test Rejection Modal (Frame 29)"}
          </Btn>
          <Btn variant="danger" icon="block" onClick={() => setRejectModalOpen(true)}>
            Reject Specimen
          </Btn>
          <Btn variant="primary" icon="publish" onClick={handlePublishResults}>
            Verify &amp; Transmit to EMR
          </Btn>
        </div>
      </div>

      {/* Specimen Metadata Card */}
      <div
        className="card"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          background: "var(--color-bg-primary)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              padding: "10px",
              borderRadius: "var(--radius-md)",
              background: "var(--color-bg-secondary)",
              border: "1px solid var(--color-border-subtle)"
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "var(--color-interactive-primary)" }}>
              biotech
            </span>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="font-subtitle">Specimen Barcode: #SPEC-8812</span>
              <Chip tone="slate">Gold Top SST (Gel Separator)</Chip>
              <Chip tone="emerald">Collected 09:34 AM</Chip>
            </div>
            <div className="font-body-sm" style={{ color: "var(--color-text-secondary)", marginTop: "4px" }}>
              Patient: <strong>Kamalbai Deshmukh (UHID-2024-00891, 58F)</strong> &bull; Ordering Physician:{" "}
              <strong>Dr. Rajesh Rao</strong>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ textAlign: "right" }}>
            <div className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>ACCESSION STATE</div>
            <div style={{ fontWeight: "600", color: "var(--color-interactive-primary)" }}>Centrifuged &bull; Ready</div>
          </div>
        </div>
      </div>

      {/* Delta-Check Comparison Table */}
      <div className="card" style={{ background: "var(--color-bg-primary)", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="font-subtitle">Automated Analyzer Results &amp; Delta-Check Invariants</span>
            <Chip tone="red" icon="crisis_alert">
              1 Critical Panic
            </Chip>
            <Chip tone="amber" icon="trending_up">
              1 Delta Deviation
            </Chip>
          </div>
          <span className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>
            Bi-directional HL7 LIS Feed Synchronized
          </span>
        </div>

        <table className="table-base">
          <thead>
            <tr>
              <th>Analyte / Parameter</th>
              <th>Observed Result</th>
              <th>Unit</th>
              <th>Standard Reference Range</th>
              <th>Delta Check (vs Prior Baseline)</th>
              <th>Safety Flag</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr
                key={i}
                style={{
                  background:
                    r.flagTone === "red"
                      ? "var(--color-red-50)"
                      : r.flagTone === "amber"
                      ? "var(--color-amber-50)"
                      : "transparent"
                }}
              >
                <td>
                  <strong>{r.test}</strong>
                </td>
                <td style={{ fontSize: "15px", fontWeight: "700" }}>
                  <span style={{ color: r.flagTone === "red" ? "var(--color-clinical-red)" : "inherit" }}>
                    {r.value}
                  </span>
                </td>
                <td>{r.unit}</td>
                <td>{r.refRange}</td>
                <td>
                  <span
                    style={{
                      fontWeight: r.delta.includes("+") ? "600" : "normal",
                      color: r.flagTone === "amber" ? "var(--color-clinical-amber)" : "var(--color-text-secondary)"
                    }}
                  >
                    {r.delta}
                  </span>
                </td>
                <td>
                  <Chip tone={r.flagTone}>{r.flag}</Chip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Frame 29: Specimen Rejection Modal */}
      {rejectModalOpen && (
        <Modal
          title="Pre-Analytical Specimen Rejection Protocol (Frame 29)"
          open={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          actions={
            <div style={{ display: "flex", gap: "10px" }}>
              <Btn variant="secondary" onClick={() => setRejectModalOpen(false)}>
                Cancel
              </Btn>
              <Btn variant="danger" icon="check" onClick={handleConfirmRejection}>
                Confirm Rejection &amp; Order STAT Re-draw
              </Btn>
            </div>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div
              style={{
                padding: "12px",
                borderRadius: "var(--radius-md)",
                background: "var(--color-operational-plum-bg)",
                border: "1px solid var(--color-operational-plum-border)",
                display: "flex",
                gap: "10px"
              }}
            >
              <span className="material-symbols-outlined" style={{ color: "var(--color-operational-plum)" }}>
                warning
              </span>
              <div style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
                Specimen rejection halts LIS processing. The nursing station and attending physician will receive an
                immediate STAT re-draw alert. Specimen tube barcode #SPEC-8812 will be permanently archived as invalid.
              </div>
            </div>

            <div>
              <label className="font-caption" style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>
                Primary Rejection Criterion
              </label>
              <select
                className="input-base"
                style={{ width: "100%" }}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              >
                <option value="Gross Hemolysis (+++ In Vitro Hemolysis)">
                  Gross Hemolysis (+++ In Vitro Hemolysis - Pseudohyperkalemia Risk)
                </option>
                <option value="Insufficient Volume (QNS - Quantity Not Sufficient)">
                  Insufficient Volume (QNS - Quantity Not Sufficient)
                </option>
                <option value="Clotted Specimen (EDTA Micro-clots)">
                  Clotted Specimen (EDTA Micro-clots Detected)
                </option>
                <option value="Tube Mismatch / Incorrect Additive">
                  Tube Mismatch / Incorrect Anticoagulant Additive
                </option>
              </select>
            </div>

            <div>
              <label className="font-caption" style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>
                Laboratory Technical Notes
              </label>
              <textarea
                className="input-base"
                rows={3}
                style={{ width: "100%", resize: "vertical" }}
                value={rejectionNotes}
                onInput={(e) => setRejectionNotes(e.target.value)}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
