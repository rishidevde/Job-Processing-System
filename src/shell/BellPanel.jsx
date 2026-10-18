import { h } from "preact";
import { appState } from "../core/store.js";
import { ExceptionCard } from "../kit/KpiCard.jsx";
import { Drawer } from "../kit/Modal.jsx";

export function BellPanel({ isOpen, onClose }) {
  const state = appState.value;

  const patPatil = state.patients["884150"] || {};
  const isPatilReadBackPending = patPatil.criticalResult && !patPatil.criticalResult.readBackRecorded;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Exceptions & Alerts Inbox"
      subtitle="Actionable operational and clinical tasks requiring escalation"
      size="std"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Item 1: Critical Potassium Panic */}
        {isPatilReadBackPending && (
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
            onAction={() => {
              onClose();
              window.location.hash = "#/critical?modal=readback";
            }}
          />
        )}

        {/* Item 2: Metformin Stock-Out */}
        <ExceptionCard
          severity="Action needed"
          title="Metformin 500 mg unavailable — prescriber decision needed"
          patientName="Mrs. Kamalbai Deshmukh"
          patientUhid="884021"
          owner="Dr. R. Rao · Pharmacy Notification"
          ageText="4 min ago"
          actionLabel="Review stock-out"
          actionVariant="outline"
          onAction={() => {
            onClose();
            window.location.hash = "#/workspace/OPD-8843?state=stockout";
          }}
        />

        {/* Item 3: Serum Creatinine Awaiting Review */}
        <ExceptionCard
          severity="Action needed"
          title="Serum creatinine resulted — awaiting review"
          patientName="Mrs. Kamalbai Deshmukh"
          patientUhid="884021"
          owner="Dr. R. Rao · Value: 1.4 mg/dL"
          ageText="7 min ago"
          actionLabel="Open result"
          onAction={() => {
            onClose();
            window.location.hash = "#/orders";
          }}
        />
      </div>
    </Drawer>
  );
}
