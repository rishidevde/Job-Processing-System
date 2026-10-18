import { h } from "preact";
import { useState } from "preact/hooks";
import { appState } from "../core/store.js";
import { currentRoute } from "../core/router.js";
import { findRouteByPath } from "../registry/routes.js";
import { TopBar } from "./TopBar.jsx";
import { Sidebar } from "./Sidebar.jsx";
import { BellPanel } from "./BellPanel.jsx";
import { AvatarMenu } from "./AvatarMenu.jsx";
import { PatientStrip } from "../kit/PatientStrip.jsx";
import { Stepper } from "../kit/Stepper.jsx";
import { ToastContainer } from "../kit/ToastContainer.jsx";
import { Modal } from "../kit/Modal.jsx";
import { Field } from "../kit/Field.jsx";
import { Btn } from "../kit/Btn.jsx";
import { dispatch } from "../core/command.js";

export function Shell({ children }) {
  const [bellOpen, setBellOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [admitModalOpen, setAdmitModalOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState("104-A");
  const [admitReason, setAdmitReason] = useState("Step-down Metabolic Monitoring & Fluid Titration");

  const state = appState.value;
  const routeInfo = findRouteByPath(currentRoute.value.path);

  // Determine active patient and encounter for strip
  const encKey = currentRoute.value.query.enc || "OPD-8843";
  const enc = state.encounters[encKey] || state.encounters["OPD-8843"];
  const uhid = enc ? enc.uhid : "884021";

  // If login route, render fullscreen clean
  if (routeInfo.id === "login") {
    return (
      <div className="fullscreen-center">
        {children}
        <ToastContainer />
      </div>
    );
  }

  const showPatientStrip = routeInfo.patientStrip;
  const showStepper = routeInfo.stepper;

  return (
    <div className="app-shell">
      {/* 56px Top Bar */}
      <TopBar
        onToggleBell={() => setBellOpen(!bellOpen)}
        onToggleAvatarMenu={() => setAvatarOpen(!avatarOpen)}
      />

      {/* Main Body */}
      <div className="shell-body">
        {/* 240px Sidebar */}
        <Sidebar />

        {/* Dynamic Workspace */}
        <div className="shell-workspace">
          {/* Optional 64px Patient Identity Strip */}
          {showPatientStrip && (
            <PatientStrip
              uhid={uhid}
              encounterId={enc ? enc.id : "OPD-8843"}
              onOpenAdmitModal={() => setAdmitModalOpen(true)}
            />
          )}

          {/* Optional 40px Encounter Lifecycle Stepper */}
          {showStepper && (
            <Stepper
              currentStep={enc ? enc.step : "Consultation"}
              onStepClick={(step) => {
                if (step === "Registered") window.location.hash = "#/registration";
                else if (step === "Triage") window.location.hash = "#/triage/OPD-8843";
                else if (step === "Consultation") window.location.hash = "#/workspace/OPD-8843";
                else if (step === "Orders") window.location.hash = "#/orders";
                else if (step === "Pharmacy") window.location.hash = "#/pharmacy";
                else if (step === "Billing") window.location.hash = "#/billing/INV-OPD-5521";
                else if (step === "Documents") window.location.hash = "#/documents/OPD-8843";
              }}
            />
          )}

          {/* Screen Canvas (strictly panel scroll internally) */}
          <div className="screen-container">
            {children}
          </div>
        </div>
      </div>

      {/* Exception Alerts Drawer */}
      <BellPanel isOpen={bellOpen} onClose={() => setBellOpen(false)} />

      {/* Avatar Switcher Menu */}
      <AvatarMenu isOpen={avatarOpen} onClose={() => setAvatarOpen(false)} />

      {/* Global Notification Toasts */}
      <ToastContainer />

      {/* Integrated Ward Admission Modal (Triggers hospital-wide cascade!) */}
      {admitModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setAdmitModalOpen(false)}
          title="Admit Patient to Inpatient Ward"
          subtitle="Hospital Admission & Bed Assignment Workflow"
          icon="bed"
          size="md"
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", width: "100%" }}>
              <Btn variant="secondary" onClick={() => setAdmitModalOpen(false)}>
                Cancel
              </Btn>
              <Btn
                variant="primary"
                icon="check"
                onClick={() => {
                  dispatch("PATIENT_ADMIT", {
                    uhid,
                    bedId: selectedBed,
                    fallRisk: true,
                    isolation: "Contact Precaution",
                    diagnosis: admitReason
                  });
                  setAdmitModalOpen(false);
                }}
              >
                Confirm Admission & Assign Bed
              </Btn>
            </div>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ padding: "10px", backgroundColor: "var(--color-active-surface)", borderRadius: "6px", border: "1px solid var(--color-active-border)", fontSize: "13px" }}>
              Admitting <strong>Mrs. Kamalbai Deshmukh (UHID 884021)</strong> from OPD Consultation to Inpatient Care.
            </div>

            <Field
              label="Select Available Bed"
              type="select"
              value={selectedBed}
              onChange={setSelectedBed}
              options={state.beds.filter((b) => b.status === "Available" || b.id === "104-A").map((b) => ({
                value: b.id,
                label: `Bed ${b.id} (${b.type} · ${b.floor}) — Available`
              }))}
            />

            <Field
              label="Clinical Admission Diagnosis & Reason"
              type="textarea"
              value={admitReason}
              onChange={setAdmitReason}
              rows={2}
            />

            <div style={{ padding: "10px", backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "6px", fontSize: "12px", color: "#92400E" }}>
              <strong>Automatic Invariants Enforced:</strong>
              <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                <li>Bed status marks Occupied in Ward Matrix.</li>
                <li>Generates SBAR Handover task with Morse 65 Fall Risk & Contact Isolation.</li>
                <li>Appends bed admission charge to itemized hospital invoice.</li>
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
