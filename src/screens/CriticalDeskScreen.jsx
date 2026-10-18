import { h } from "preact";
import { useState } from "preact/hooks";
import { appState, activeBlockingInterlock } from "../core/store.js";
import { currentRoute } from "../core/router.js";
import { Chip } from "../kit/Chip.jsx";
import { Btn } from "../kit/Btn.jsx";
import { Field } from "../kit/Field.jsx";
import { Modal } from "../kit/Modal.jsx";
import { dispatch } from "../core/command.js";

export function CriticalDeskScreen() {
  const state = appState.value;
  const isBarrierFrame = currentRoute.value.query.barrier === "true" || currentRoute.value.query.frame === "34";

  const [barrierModalOpen, setBarrierModalOpen] = useState(isBarrierFrame);
  const [readBackForm, setReadBackForm] = useState({
    recipientName: "Dr. Rajesh Rao",
    recipientRole: "Attending Physician (Internal Medicine)",
    communicatedValue: "Serum Potassium (K+) 6.8 mEq/L (Critical High)",
    clinicalActionTaken: "Patient admitted immediately to Stepdown Bed 04; Calcium Gluconate 10% 10ml IV ordered; repeat STAT K+ scheduled.",
    readBackVerified: true
  });

  const handleCompleteReadBack = (e) => {
    e.preventDefault();
    dispatch("VERBAL_READ_BACK_COMPLETED", {
      orderId: "ORD-9021",
      uhid: "UHID-2024-00891",
      readBack: readBackForm
    });
    activeBlockingInterlock.value = null;
    setBarrierModalOpen(false);
  };

  return (
    <div className="panel-scroll" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h1 className="font-h1">Rejected Specimens &amp; Critical Results Desk</h1>
            <Chip tone="red" icon="crisis_alert">
              1 Active Critical Panic Result
            </Chip>
            {isBarrierFrame && <Chip tone="red">Frame 34: Verbal Read-Back Barrier</Chip>}
          </div>
          <p className="font-body-sm" style={{ color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
            Closed-loop verbal communication tracker with mandatory read-back logging (SCR-17 / Frames 19, 34)
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Btn
            variant="secondary"
            onClick={() => {
              if (isBarrierFrame) {
                window.location.hash = "#/critical";
                setBarrierModalOpen(false);
              } else {
                window.location.hash = "#/critical?frame=34";
                setBarrierModalOpen(true);
              }
            }}
          >
            {isBarrierFrame ? "Show Standard Desk (Frame 19)" : "Trigger Read-Back Barrier (Frame 34)"}
          </Btn>
          <Btn
            variant="danger"
            icon="ring_volume"
            onClick={() => {
              activeBlockingInterlock.value = "VERBAL_READBACK";
              setBarrierModalOpen(true);
            }}
          >
            Log Verbal Read-Back
          </Btn>
        </div>
      </div>

      {/* Critical Panic Results Card */}
      <div
        className="card"
        style={{
          border: "2px solid var(--color-clinical-red)",
          background: "var(--color-bg-primary)",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          padding: "16px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              className="material-symbols-outlined"
              style={{
                color: "var(--color-clinical-red)",
                fontSize: "28px",
                animation: "pulse 2s infinite"
              }}
            >
              emergency
            </span>
            <div>
              <div style={{ fontSize: "16px", fontWeight: "700", color: "var(--color-clinical-red)" }}>
                PANIC CRITICAL: Serum Potassium (K+) 6.8 mEq/L
              </div>
              <div className="font-caption" style={{ color: "var(--color-text-secondary)" }}>
                Patient: Kamalbai Deshmukh (UHID-2024-00891, 58F) &bull; Location: OPD Room 12 &rarr; Transferring to Ward Bed 04
              </div>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div className="font-caption" style={{ color: "var(--color-clinical-red)", fontWeight: "600" }}>
              MANDATORY NOTIFICATION WINDOW
            </div>
            <div className="font-mono" style={{ fontSize: "18px", fontWeight: "700", color: "var(--color-clinical-red)" }}>
              04:22 REMAINING
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "12px",
            background: "var(--color-red-50)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-clinical-red)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "12px",
            fontSize: "13px"
          }}
        >
          <div>
            <div className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>ORDER DETAILS</div>
            <div>Order: <strong>ORD-9021 (Renal Panel)</strong></div>
            <div>Specimen: <strong>#SPEC-8812</strong></div>
          </div>
          <div>
            <div className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>CARDIAC ARREST RISK</div>
            <div style={{ color: "var(--color-clinical-red)", fontWeight: "600" }}>
              High Risk of Fatal Arrhythmia / Asystole
            </div>
            <div>Action: Immediate ECG &amp; Calcium Gluconate</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <Btn
              variant="danger"
              icon="phone_in_talk"
              onClick={() => {
                activeBlockingInterlock.value = "VERBAL_READBACK";
                setBarrierModalOpen(true);
              }}
            >
              Execute Closed-Loop Read-Back
            </Btn>
          </div>
        </div>
      </div>

      {/* Rejected Specimens Log */}
      <div className="card" style={{ background: "var(--color-bg-primary)", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="font-subtitle">Pre-Analytical Specimen Discrepancies &amp; Re-draw Queue</span>
          <Chip tone="slate">2 Records</Chip>
        </div>

        <table className="table-base">
          <thead>
            <tr>
              <th>Specimen ID</th>
              <th>Patient</th>
              <th>Ordered Investigation</th>
              <th>Rejection Reason</th>
              <th>Flagged At</th>
              <th>Re-draw Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="font-mono-sm">#SPEC-8812</span></td>
              <td>Kamalbai Deshmukh (58F)</td>
              <td>Serum Electrolytes &amp; Creatinine</td>
              <td>
                <Chip tone="plum">Gross Hemolysis (+++)</Chip>
              </td>
              <td>09:40 AM</td>
              <td>
                <Chip tone="amber">Phlebotomy Dispatched</Chip>
              </td>
              <td>
                <Btn size="sm" variant="secondary" onClick={() => (window.location.hash = "#/orders")}>
                  Track Re-draw
                </Btn>
              </td>
            </tr>
            <tr>
              <td><span className="font-mono-sm">#SPEC-8794</span></td>
              <td>Suresh Jadhav (42M)</td>
              <td>Coagulation Profile (PT/INR)</td>
              <td>
                <Chip tone="plum">Underfilled Citrate Tube (&lt;90%)</Chip>
              </td>
              <td>08:55 AM</td>
              <td>
                <Chip tone="emerald">Re-draw Received &amp; Processing</Chip>
              </td>
              <td>
                <Btn size="sm" variant="ghost" icon="check" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Frame 34: Verbal Read-Back Barrier Modal */}
      {barrierModalOpen && (
        <Modal
          title="MANDATORY SAFETY BARRIER: Verbal Panic Result Read-Back (Frame 34)"
          open={barrierModalOpen}
          isBlocking={true}
          actions={
            <div style={{ display: "flex", gap: "10px" }}>
              <Btn
                variant="secondary"
                onClick={() => {
                  activeBlockingInterlock.value = null;
                  setBarrierModalOpen(false);
                }}
              >
                Hold (Do Not Dismiss)
              </Btn>
              <Btn variant="danger" icon="verified" onClick={handleCompleteReadBack}>
                Confirm Verbal Read-Back &amp; Unblock Encounter
              </Btn>
            </div>
          }
        >
          <form onSubmit={handleCompleteReadBack} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div
              style={{
                padding: "12px",
                background: "var(--color-red-50)",
                border: "1px solid var(--color-clinical-red)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                gap: "10px"
              }}
            >
              <span className="material-symbols-outlined" style={{ color: "var(--color-clinical-red)" }}>
                gpp_maybe
              </span>
              <div style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
                Hospital accreditation standard NABH / JCI mandates direct telephone communication with the licensed
                independent practitioner. The receiver must read back the numeric value word-for-word.
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Field
                label="Receiver Full Name"
                required
                value={readBackForm.recipientName}
                onChange={(e) => setReadBackForm({ ...readBackForm, recipientName: e.target.value })}
              />
              <Field
                label="Receiver Designation / Clinical Role"
                required
                value={readBackForm.recipientRole}
                onChange={(e) => setReadBackForm({ ...readBackForm, recipientRole: e.target.value })}
              />
            </div>

            <Field
              label="Critical Panic Value Communicated &amp; Repeated"
              required
              value={readBackForm.communicatedValue}
              onChange={(e) => setReadBackForm({ ...readBackForm, communicatedValue: e.target.value })}
            />

            <Field
              label="Immediate Clinical Action / Order Confirmed by Attending"
              required
              value={readBackForm.clinicalActionTaken}
              onChange={(e) => setReadBackForm({ ...readBackForm, clinicalActionTaken: e.target.value })}
            />

            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px" }}>
              <input
                type="checkbox"
                checked={readBackForm.readBackVerified}
                onChange={(e) => setReadBackForm({ ...readBackForm, readBackVerified: e.target.checked })}
              />
              <span>I certify that Dr. Rajesh Rao verbally read back <strong>"Potassium 6.8 mEq/L"</strong> accurately.</span>
            </label>
          </form>
        </Modal>
      )}
    </div>
  );
}
