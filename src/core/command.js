/**
 * Samruddhi HMS Command Dispatcher & WORM Audit Interceptor
 */

import { updateState, addToast } from "./store.js";
import { REACTIONS } from "./reactions.js";

export function dispatch(commandType, payload = {}) {
  let auditEntry = null;
  let toastInfo = null;

  updateState((draft) => {
    const actorRole = draft.session.role;
    const now = new Date();
    const timestampUTC = now.toISOString().replace("T", ", ").substr(0, 19);
    draft.session.clockTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
    draft.session.clockDate = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    // 1. Core State Mutations by Command Type
    switch (commandType) {
      case "PATIENT_ADMIT": {
        REACTIONS.PATIENT_ADMITTED(draft, payload);
        auditEntry = {
          id: "AUD-" + Date.now().toString(36).toUpperCase(),
          timestampUTC,
          actor: actorName,
          role: actorRole,
          action: "Patient Admitted to Ward",
          resource: `UHID ${payload.uhid}`,
          justification: `Admitted to Bed ${payload.bedId} with ${payload.fallRisk ? "Fall Risk" : "Standard"} monitoring`
        };
        toastInfo = { type: "success", title: "Patient Admitted", message: `Bed ${payload.bedId} assigned. SBAR handover initialized.` };
        break;
      }

      case "REGISTER_PATIENT": {
        REACTIONS.PATIENT_REGISTERED(draft, payload);
        auditEntry = {
          id: "AUD-" + Date.now().toString(36).toUpperCase(),
          timestampUTC,
          actor: actorName,
          role: actorRole,
          action: "Patient Registered",
          resource: `UHID ${payload.patient.uhid}`,
          justification: `Issued token and opened OPD encounter`
        };
        toastInfo = { type: "success", title: "Registration Complete", message: `Patient added to queue with lifetime UHID ${payload.patient.uhid}.` };
        break;
      }

      case "SUBMIT_TRIAGE": {
        const { encounterId, vitals, homeLogEntry } = payload;
        draft.triageVitals[encounterId] = {
          recordedBy: draft.session.userId,
          time: `${draft.session.clockTime}, ${draft.session.clockDate}`,
          ...vitals
        };
        const enc = draft.encounters[encounterId];
        if (enc) {
          enc.step = "Consultation";
          enc.vitalsRecorded = true;
        }
        if (homeLogEntry) {
          draft.homeLog.push(homeLogEntry);
        }
        auditEntry = {
          id: "AUD-" + Date.now().toString(36).toUpperCase(),
          timestampUTC,
          actor: actorName,
          role: actorRole,
          action: "Triage Vitals Logged",
          resource: encounterId,
          justification: `Measured BP ${vitals.bp}, Pulse ${vitals.pulse}`
        };
        toastInfo = { type: "success", title: "Triage Submitted", message: "Patient vitals transferred to clinical workspace." };
        break;
      }

      case "SIGN_PRESCRIPTION": {
        const { rxId, items } = payload;
        const rx = draft.prescriptions[rxId];
        if (rx) {
          rx.status = "Signed";
          rx.signedTime = draft.session.clockTime;
          if (items) rx.items = items;
        }
        const encKey = Object.keys(draft.encounters).find((k) => draft.encounters[k].rxId === rxId);
        if (encKey) {
          draft.encounters[encKey].prescriptionSigned = true;
          draft.encounters[encKey].step = "Pharmacy";
        }
        auditEntry = {
          id: "AUD-" + Date.now().toString(36).toUpperCase(),
          timestampUTC,
          actor: actorName,
          role: actorRole,
          action: "Prescription Signed",
          resource: rxId,
          justification: "Signed by authorized consulting physician"
        };
        toastInfo = { type: "success", title: "Prescription Signed", message: `${rxId} sent to Central Dispensary.` };
        break;
      }

      case "REJECT_SPECIMEN": {
        REACTIONS.SPECIMEN_REJECTED(draft, payload);
        auditEntry = {
          id: "AUD-" + Date.now().toString(36).toUpperCase(),
          timestampUTC,
          actor: actorName,
          role: actorRole,
          action: "Specimen Rejected",
          resource: payload.orderId,
          justification: `Sample rejected due to: ${payload.reason}`
        };
        toastInfo = { type: "warning", title: "Specimen Rejected", message: `Recollection stat task created for Nurse S. More.` };
        break;
      }

      case "LOG_CRITICAL_READBACK": {
        REACTIONS.CRITICAL_READBACK_RECORDED(draft, payload);
        auditEntry = {
          id: "AUD-" + Date.now().toString(36).toUpperCase(),
          timestampUTC,
          actor: actorName,
          role: actorRole,
          action: "Critical Verbal Read-Back Confirmed",
          resource: payload.orderId,
          justification: `Communicated by ${payload.communicatedBy}, verified by ${payload.receivedBy} (${payload.valueReadBack})`
        };
        toastInfo = { type: "success", title: "Read-Back Recorded", message: "Critical Panic Barrier cleared. Encounter closure unblocked." };
        break;
      }

      case "FLAG_STOCKOUT": {
        REACTIONS.PHARMACY_STOCKOUT_FLAGGED(draft, payload);
        auditEntry = {
          id: "AUD-" + Date.now().toString(36).toUpperCase(),
          timestampUTC,
          actor: actorName,
          role: actorRole,
          action: "Stock-Out Clarification Raised",
          resource: payload.rxId,
          justification: `${payload.medicine} confirmed 0 units available`
        };
        toastInfo = { type: "info", title: "Stock-Out Flagged", message: "Prescriber notification sent to Doctor Exception Inbox." };
        break;
      }

      case "RECORD_PRESCRIBING_DECISION": {
        REACTIONS.PRESCRIBING_DECISION_RECORDED(draft, payload);
        auditEntry = {
          id: "AUD-" + Date.now().toString(36).toUpperCase(),
          timestampUTC,
          actor: actorName,
          role: actorRole,
          action: "Prescribing Decision Documented",
          resource: payload.rxId,
          justification: `Doctor decision: ${payload.decision} (${payload.note})`
        };
        toastInfo = { type: "success", title: "Decision Saved", message: "Pharmacy updated. Dispense route refreshed." };
        break;
      }

      case "DISPENSE_MEDICINE": {
        const { rxId, lineId, qtyDispensed } = payload;
        const rx = draft.prescriptions[rxId];
        if (rx) {
          const line = rx.items.find((i) => i.id === lineId);
          if (line) {
            line.dispensedQty = qtyDispensed;
            line.balanceRemaining = Math.max(0, line.prescribedQty - qtyDispensed);
            line.status = line.balanceRemaining === 0 ? "Dispensed" : "Partially dispensed";
          }
        }
        toastInfo = { type: "success", title: "Dispense Logged", message: `Recorded ${qtyDispensed} units dispensed.` };
        break;
      }

      case "TRIGGER_PAYMENT_TIMEOUT": {
        REACTIONS.PAYMENT_TIMEOUT(draft, payload);
        auditEntry = {
          id: "AUD-" + Date.now().toString(36).toUpperCase(),
          timestampUTC,
          actor: actorName,
          role: actorRole,
          action: "Payment Gateway Response Timed Out",
          resource: payload.invoiceId,
          justification: `Reference ${payload.paymentRef}. Auto-retry locked.`
        };
        toastInfo = { type: "warning", title: "Gateway Timeout (Branch 1)", message: "Payment pending reconciliation. Duplicate retry locked." };
        break;
      }

      case "RECONCILE_PAYMENT": {
        REACTIONS.PAYMENT_RECONCILED(draft, payload);
        auditEntry = {
          id: "AUD-" + Date.now().toString(36).toUpperCase(),
          timestampUTC,
          actor: actorName,
          role: actorRole,
          action: "Payment Reconciled & Receipt Issued",
          resource: payload.invoiceId,
          justification: `Receipt RCP-5521 issued via UPI reference ${payload.paymentRef || "DEMO-UPI-8821"}`
        };
        toastInfo = { type: "success", title: "Payment Reconciled (Branch 2)", message: "Official receipt RCP-5521 issued. ₹750 settled." };
        break;
      }

      case "CLOSE_ENCOUNTER": {
        REACTIONS.ENCOUNTER_CLOSED(draft, payload);
        auditEntry = {
          id: "AUD-" + Date.now().toString(36).toUpperCase(),
          timestampUTC,
          actor: actorName,
          role: actorRole,
          action: "Encounter Formally Closed",
          resource: payload.encounterId,
          justification: "Clinical & financial signoff finalized"
        };
        toastInfo = { type: "success", title: "Encounter Closed", message: `Visit ${payload.encounterId} closed. Document package ready.` };
        break;
      }

      case "SET_ROLE": {
        draft.session.role = payload.role;
        draft.session.userId = payload.name;
        draft.session.station = payload.station || draft.session.station;
        draft.session.department = payload.department || draft.session.department;
        draft.session.isLoggedIn = true;
        auditEntry = {
          id: "AUD-" + Date.now().toString(36).toUpperCase(),
          timestampUTC,
          actor: payload.name,
          role: payload.role,
          action: "Operator Signed In",
          resource: payload.station || "Terminal-01",
          justification: `Logged in as ${payload.name} (${payload.role})`
        };
        toastInfo = { type: "success", title: "Session Unlocked", message: `Welcome, ${payload.name} (${payload.role})` };
        break;
      }

      case "LOGOUT": {
        draft.session.isLoggedIn = false;
        auditEntry = {
          id: "AUD-" + Date.now().toString(36).toUpperCase(),
          timestampUTC,
          actor: actorName,
          role: actorRole,
          action: "Operator Signed Out",
          resource: "Workstation Session Lock",
          justification: "Session closed cleanly by user"
        };
        toastInfo = { type: "info", title: "Session Locked", message: "Logged out. Workstation returned to login screen." };
        break;
      }

      case "SET_CLOCK": {
        draft.session.clockTime = payload.time;
        if (payload.date) draft.session.clockDate = payload.date;
        toastInfo = { type: "info", title: "Clock Synchronized", message: `Time set to ${payload.time}.` };
        break;
      }

      default:
        console.log("Unhandled command:", commandType, payload);
    }

    // Append to WORM audit trail
    if (auditEntry) {
      draft.auditLog.unshift(auditEntry);
    }
  });

  if (toastInfo) {
    addToast(toastInfo);
  }
}
