/**
 * Samruddhi HMS Declarative Cross-Module Reactive Rules
 * Executes automatic cascaded state updates across hospital departments
 */

export const REACTIONS = {
  // 1. Patient Admission (Ward & Enterprise Integration)
  PATIENT_ADMITTED(draft, payload) {
    const { uhid, bedId, fallRisk = true, isolation = "Contact Precaution", diagnosis = "Post-Op Orthopedic Care" } = payload;
    const patient = draft.patients[uhid];
    if (!patient) return;

    const admId = "ADM-" + Math.floor(1000 + Math.random() * 9000);

    // Update patient entity
    patient.admissionId = admId;
    patient.bed = bedId;
    if (fallRisk) patient.fallRisk = "Morse 65 (High Risk)";
    if (isolation) patient.isolation = isolation;

    // Update bed matrix
    const bed = draft.beds.find((b) => b.id === bedId);
    if (bed) {
      bed.status = "Occupied";
      bed.patientUhid = uhid;
      bed.patientName = patient.name;
      bed.fallRisk = !!fallRisk;
      bed.isolation = isolation;
    }

    // Create Nursing SBAR Handover record
    draft.nursingHandovers[bedId] = {
      bed: bedId,
      uhid: uhid,
      patient: `${patient.name}, ${patient.age}${patient.gender === "Female" ? "F" : "M"}`,
      situation: `Admitted to ${bedId} under ${diagnosis}.`,
      background: `Known history: ${(patient.activeConditions || []).join(", ") || "Under evaluation"}.`,
      assessment: `Vitals stable. Fall risk: ${patient.fallRisk || "Standard"}. Isolation: ${isolation || "None"}.`,
      recommendation: `Complete initial intake nursing assessment. Bed alarm armed.`,
      outgoingNurse: "Nurse S. More",
      incomingNurse: "Assigned Shift Nurse",
      signedTime: draft.session.clockTime
    };

    // Append to active invoice if present
    const encKey = Object.keys(draft.encounters).find((k) => draft.encounters[k].uhid === uhid);
    if (encKey && draft.encounters[encKey].invoiceId) {
      const inv = draft.invoices[draft.encounters[encKey].invoiceId];
      if (inv) {
        inv.lines.push({
          item: `Ward Bed Admission Charge (${bedId})`,
          dept: "Nursing / Inpatient",
          qty: 1,
          unitPrice: 1200,
          total: 1200
        });
        inv.subtotal += 1200;
        inv.patientCoPay += 1200;
      }
    }
  },

  // 2. Patient Registration & Intake
  PATIENT_REGISTERED(draft, payload) {
    const { patient, encounterType = "Appointment", doctor = "Dr. R. Rao" } = payload;
    draft.patients[patient.uhid] = patient;

    const encId = "OPD-" + Math.floor(8000 + Math.random() * 1000);
    const tokenNum = "T-" + String(draft.queue.length + 11).padStart(3, "0");

    draft.encounters[encId] = {
      id: encId,
      uhid: patient.uhid,
      doctor,
      department: "General Medicine OPD",
      room: "Consultation 04 (Dr. Rao)",
      date: draft.session.clockDate,
      startTime: draft.session.clockTime,
      type: encounterType,
      step: "Registered",
      status: "Waiting",
      token: tokenNum,
      vitalsRecorded: false,
      prescriptionSigned: false,
      ordersPlaced: false,
      closed: false
    };

    // Add to OPD Queue
    draft.queue.push({
      token: tokenNum,
      uhid: patient.uhid,
      name: `${patient.name}, ${patient.age}${patient.gender === "Female" ? "F" : "M"}`,
      type: encounterType,
      payer: patient.payer || "Cash",
      arrivalTime: draft.session.clockTime,
      waitTime: "0 min",
      state: "Waiting",
      doctor
    });
  },

  // 3. Specimen Rejection (Laboratory -> Nursing Task)
  SPECIMEN_REJECTED(draft, payload) {
    const { orderId, reason = "Haemolysed" } = payload;
    const order = draft.orders.find((o) => o.id === orderId);
    if (!order) return;

    order.status = "Specimen rejected";
    order.rejectionReason = reason;
    order.rejectionTime = draft.session.clockTime;

    // Automatically create recollection stat task for nurse
    order.recollectionTask = {
      task: `Recollect specimen for ${order.test}`,
      owner: "Nurse S. More",
      status: "Collection pending",
      priority: "Stat",
      assignedTime: draft.session.clockTime
    };

    // Add disclosure to document packages
    Object.values(draft.packages).forEach((pkg) => {
      if (pkg.uhid === order.uhid) {
        const hasNotice = pkg.documents.some((d) => d.title.includes("Pending Investigation Notice"));
        if (!hasNotice) {
          pkg.documents.push({
            title: `Pending Investigation Notice (${order.id})`,
            note: `${order.test} specimen rejected (${reason}). Recollection pending.`,
            required: true,
            included: true
          });
        }
      }
    });
  },

  // 4. Critical Panic Result (LIS -> Doctor Hard Blocker)
  CRITICAL_PANIC_RESULT(draft, payload) {
    const { orderId, uhid, test, value } = payload;
    const patient = draft.patients[uhid];
    if (patient) {
      patient.criticalResult = {
        test,
        value,
        orderId,
        resultedTime: draft.session.clockTime,
        verifiedBy: "P. Nair (LIS)",
        responsibleDoctor: "Dr. R. Rao",
        readBackRecorded: false,
        elapsedMinutes: 1
      };
    }

    // Hard block encounter closure
    const encKey = Object.keys(draft.encounters).find((k) => draft.encounters[k].uhid === uhid);
    if (encKey) {
      draft.encounters[encKey].criticalBlocker = true;
    }
  },

  // 5. Verbal Read-Back Completed (Unblocks Doctor & Discharge)
  CRITICAL_READBACK_RECORDED(draft, payload) {
    const { orderId, uhid, communicatedBy, receivedBy, valueReadBack } = payload;
    const order = draft.orders.find((o) => o.id === orderId);
    if (order) {
      order.readBackLogged = true;
      order.readBackDetails = { communicatedBy, receivedBy, valueReadBack, time: draft.session.clockTime };
      order.status = "Acknowledged";
    }

    const patient = draft.patients[uhid];
    if (patient && patient.criticalResult) {
      patient.criticalResult.readBackRecorded = true;
      patient.criticalResult.verifiedTime = draft.session.clockTime;
    }

    // Unblock encounter
    const encKey = Object.keys(draft.encounters).find((k) => draft.encounters[k].uhid === uhid);
    if (encKey) {
      draft.encounters[encKey].criticalBlocker = false;
    }
  },

  // 6. Pharmacy Stock-out Flagged (Pharmacist -> Prescriber Clarification)
  PHARMACY_STOCKOUT_FLAGGED(draft, payload) {
    const { rxId, medicine, reason } = payload;
    const rx = draft.prescriptions[rxId];
    if (!rx) return;

    const line = rx.items.find((i) => i.medicine.includes(medicine));
    if (line) {
      line.status = "Awaiting prescriber review";
      line.dispensedQty = 0;
      line.balanceRemaining = line.prescribedQty;
      line.stockText = "Unavailable — stock confirmed 0 · Last synced 1 min ago";
    }

    // Create CLR ticket if not existing
    const clrId = "CLR-" + Math.floor(400 + Math.random() * 100);
    draft.clarifications.push({
      id: clrId,
      rxId,
      uhid: rx.uhid,
      medicine,
      directions: line ? line.directions : "As prescribed",
      reason: reason || "Out of stock at Main Dispensary",
      raisedBy: "Pharmacist V. Gokhale",
      raisedTime: draft.session.clockTime,
      owner: rx.doctor || "Dr. R. Rao",
      status: "Awaiting prescriber review"
    });
  },

  // 7. Prescribing Decision Recorded (Doctor -> Pharmacy Resolution)
  PRESCRIBING_DECISION_RECORDED(draft, payload) {
    const { rxId, clarificationId, decision, note } = payload;
    const rx = draft.prescriptions[rxId];
    if (rx) {
      rx.stockOutDecision = {
        recorded: true,
        decision,
        time: draft.session.clockTime,
        doctor: draft.session.userId,
        note
      };
    }

    const clr = draft.clarifications.find((c) => c.id === clarificationId || c.rxId === rxId);
    if (clr) {
      clr.status = "Completed";
      clr.prescribingDecision = `${decision}: ${note}`;
    }
  },

  // 8. Payment Timeout / Branch 1
  PAYMENT_TIMEOUT(draft, payload) {
    const { invoiceId, paymentRef } = payload;
    const inv = draft.invoices[invoiceId];
    if (inv) {
      inv.status = "Payment pending reconciliation";
      inv.paymentRef = paymentRef;
      inv.gatewayTimeoutTime = draft.session.clockTime;
    }
  },

  // 9. Payment Reconciled / Branch 2
  PAYMENT_RECONCILED(draft, payload) {
    const { invoiceId, paymentRef, receiptId = "RCP-5521" } = payload;
    const inv = draft.invoices[invoiceId];
    if (inv) {
      inv.status = "Paid and reconciled";
      inv.paymentRef = paymentRef || "DEMO-UPI-8821";
      inv.receiptId = receiptId;
      inv.reconciledTime = draft.session.clockTime;
      inv.paidAmount = inv.patientCoPay;
    }

    // Unblock document package generation
    Object.values(draft.packages).forEach((pkg) => {
      if (pkg.uhid === (inv ? inv.uhid : null)) {
        pkg.documents.forEach((doc) => {
          if (doc.title.includes("Official Payment Receipt")) {
            doc.status = `₹${inv.paidAmount} Paid (Reconciled)`;
          }
        });
      }
    });
  },

  // 10. Encounter Signoff & Closure
  ENCOUNTER_CLOSED(draft, payload) {
    const { encounterId } = payload;
    const enc = draft.encounters[encounterId];
    if (!enc) return;

    enc.closed = true;
    enc.step = "Closed";
    enc.status = "Completed";

    // Update queue row
    const qRow = draft.queue.find((q) => q.uhid === enc.uhid);
    if (qRow) {
      qRow.state = "Completed";
    }
  }
};
