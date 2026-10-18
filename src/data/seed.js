/**
 * Samruddhi HMS Canonical Demonstration Data Lock (D1-D10)
 * Strictly conforms to prototype1.md Section 6
 */

export function getInitialSeed() {
  return {
    // Current Session & Staff Profile
    session: {
      role: "doctor",
      userId: "dr_rao",
      station: "OPD Room 4",
      facility: "Samruddhi Hospital — Main Wing",
      clockTime: "10:45 AM",
      clockDate: "18 Oct 2026",
      isOffline: false,
      isLoggedIn: true
    },

    // Patients (D1, D2)
    patients: {
      "884021": {
        uhid: "884021",
        name: "Mrs. Kamalbai Deshmukh",
        age: 58,
        gender: "Female",
        dobYear: 1968,
        phone: "+91 98221 00000",
        maskedPhone: "+91 ••••• ••000",
        address: "Plot 14, Shivaji Nagar",
        payer: "TPA",
        payerRef: "TPA-DEMO-99420",
        activeConditions: ["Type 2 Diabetes Mellitus", "Essential Hypertension"],
        allergies: [
          {
            agent: "Penicillin",
            reaction: "severe rash",
            severity: "Critical",
            recordedBy: "Dr. A. Kulkarni",
            recordedDate: "14 Mar 2025 (OPD-2109)",
            note: "Histamine surge and diffuse maculopapular rash within 30 min of amoxicillin injection."
          }
        ],
        hba1cHistory: [
          { date: "14 Feb 2026", value: 7.1, type: "in-house", source: "Samruddhi Biochem Lab" },
          { date: "22 May 2026", value: 7.9, type: "in-house", source: "Samruddhi Biochem Lab" },
          { date: "12 Aug 2026", value: 8.6, type: "external", source: "City Lab (Dr. K. Sharma)", status: "Transcription reviewed" }
        ],
        encountersCount: 6
      },
      "884022": {
        uhid: "884022",
        name: "Mr. Ramesh Deshmukh",
        age: 32,
        gender: "Male",
        phone: "+91 98221 00000",
        relationship: "Son",
        lastVisit: "02 Sep 2026",
        payer: "Cash"
      },
      "884023": {
        uhid: "884023",
        name: "Mrs. Sunita Deshmukh",
        age: 29,
        gender: "Female",
        phone: "+91 98221 00000",
        relationship: "Daughter-in-law",
        lastVisit: "21 Jun 2026",
        payer: "Cash"
      },
      "884150": {
        uhid: "884150",
        name: "Mr. Rajeshwar Patil",
        age: 64,
        gender: "Male",
        phone: "+91 98223 44556",
        payer: "TPA",
        payerRef: "TPA-DEMO-88120",
        activeConditions: ["Acute Cardiac Review", "Chronic Kidney Disease Stage 3"],
        allergies: [],
        criticalResult: {
          test: "Serum potassium",
          value: "6.8 mmol/L",
          orderId: "ORD-9930",
          resultedTime: "10:12 AM",
          verifiedBy: "P. Nair",
          responsibleDoctor: "Dr. R. Rao",
          readBackRecorded: false,
          elapsedMinutes: 33
        }
      },
      "880312": {
        uhid: "880312",
        name: "Mr. Suresh Jadhav",
        age: 71,
        gender: "Male",
        payer: "Cash",
        admissionId: "ADM-2210",
        bed: "104-B",
        fallRisk: "Morse 65 (High Risk)",
        isolation: "Contact Precaution",
        lastObservation: "09:30 AM",
        nextObservationDue: "11:00 AM",
        tasksDue: 2
      },
      "879455": {
        uhid: "879455",
        name: "Mrs. Lata Gaikwad",
        age: 66,
        gender: "Female",
        payer: "Scheme",
        admissionId: "ADM-2214",
        bed: "105-B",
        lastObservation: "10:15 AM",
        nextObservationDue: "11:30 AM",
        tasksDue: 1
      },
      "889912": {
        uhid: "889912",
        name: "Mrs. Kamalbai Patil",
        age: 58,
        gender: "Female",
        dobYear: 1968,
        phone: "+91 98221 00000",
        address: "Plot 14 Shivajinagar",
        payer: "Cash",
        encountersCount: 1,
        isDuplicateCandidate: true
      }
    },

    // Active Encounters
    encounters: {
      "OPD-8843": {
        id: "OPD-8843",
        uhid: "884021",
        doctor: "Dr. R. Rao",
        department: "General Medicine OPD",
        room: "Consultation 04 (Dr. Rao)",
        date: "18 Oct 2026",
        startTime: "09:40 AM",
        type: "Appointment",
        step: "Consultation", // Registered -> Triage -> Consultation -> Orders -> Pharmacy -> Billing -> Documents -> Closed
        status: "In consultation",
        token: "T-014",
        vitalsRecorded: true,
        prescriptionSigned: true,
        rxId: "RX-7710",
        ordersPlaced: true,
        invoiceId: "INV-OPD-5521",
        packageId: "PKG-8843-v1",
        closed: false
      },
      "OPD-8851": {
        id: "OPD-8851",
        uhid: "884150",
        doctor: "Dr. R. Rao",
        department: "General Medicine OPD",
        date: "18 Oct 2026",
        startTime: "10:00 AM",
        type: "Emergency Cardiac Review",
        step: "Orders",
        status: "Action needed",
        token: "T-018",
        criticalBlocker: true,
        closed: false
      }
    },

    // Live OPD Token Queue (D3)
    queue: [
      {
        token: "T-012",
        uhid: "883907",
        name: "Mr. Anil Joshi, 45M",
        type: "Appointment",
        payer: "Cash",
        arrivalTime: "9:10 AM",
        waitTime: "—",
        state: "Completed",
        doctor: "Dr. R. Rao"
      },
      {
        token: "T-014",
        uhid: "884021",
        name: "Mrs. Kamalbai Deshmukh, 58F",
        type: "Appointment",
        payer: "TPA",
        arrivalTime: "9:40 AM",
        waitTime: "—",
        state: "In consultation",
        doctor: "Dr. R. Rao"
      },
      {
        token: "T-015",
        uhid: "884002",
        name: "Mr. Sanjay More, 52M",
        type: "Walk-in",
        payer: "Cash",
        arrivalTime: "9:52 AM",
        waitTime: "53 min",
        state: "Waiting",
        doctor: "Dr. R. Rao"
      },
      {
        token: "T-016",
        uhid: "884077",
        name: "Mrs. Fatima Sheikh, 41F",
        type: "Appointment",
        payer: "Scheme",
        arrivalTime: "10:05 AM",
        waitTime: "40 min",
        state: "Waiting",
        doctor: "Dr. R. Rao"
      },
      {
        token: "T-017",
        uhid: "883450",
        name: "Mr. Vikas Patil, 67M",
        type: "Return from lab",
        payer: "TPA",
        arrivalTime: "10:10 AM",
        waitTime: "35 min",
        state: "Action needed",
        doctor: "Dr. R. Rao"
      }
    ],

    // Triage Observations (D1)
    triageVitals: {
      "OPD-8843": {
        recordedBy: "Nurse S. More",
        time: "9:55 AM, 18 Oct 2026",
        temperature: "99.2 °F",
        bp: "140/90 mmHg",
        pulse: "82 bpm",
        spo2: "98 %",
        adherence: "Reported missed Telmisartan doses last week due to partial pharmacy dispense",
        notes: "Patient reports mild dizziness on 15 Oct. Ambulatory, oriented."
      }
    },

    homeLog: [
      { date: "12 Oct", bp: "138/88", glucose: 142, fever: "None", notes: "Routine" },
      { date: "13 Oct", bp: "142/90", glucose: 150, fever: "None", notes: "Normal diet" },
      { date: "14 Oct", bp: "140/92", glucose: 138, fever: "None", notes: "Mild headache" },
      { date: "15 Oct", bp: "136/86", glucose: 156, fever: "None", notes: "Dizziness on standing" },
      { date: "16 Oct", bp: "144/92", glucose: 148, fever: "None", notes: "Morning walk" },
      { date: "17 Oct", bp: "140/90", glucose: 160, fever: "None", notes: "Diet high carbohydrate" },
      { date: "18 Oct", bp: "138/88", glucose: 152, fever: "None", notes: "Fasting prior to visit" }
    ],

    // External Staged Documents (SCR-05, SCR-08)
    stagedDocs: [
      {
        id: "DOC-EXT-8840",
        filename: "City Lab HbA1c report.pdf",
        uploadedTime: "18 Oct 2026, 9:45 AM",
        uploadedBy: "Meena Pawar",
        sourceLab: "City Lab (external)",
        author: "Dr. K. Sharma",
        reportDate: "12 Aug 2026, 10:30 AM",
        extractedFields: {
          test: "HbA1c",
          value: "8.6",
          unit: "%",
          refRange: "< 5.7 %"
        },
        verificationStages: {
          documentAttributed: { done: true, by: "Meena Pawar", time: "9:46 AM" },
          transcriptionReviewed: { done: true, by: "Nurse S. More", time: "9:58 AM" },
          clinicallyValidated: { done: false, by: null, time: null },
          significanceAcknowledged: { done: false, by: null, time: null }
        }
      }
    ],

    // Clinical Consultation Notes (SCR-07)
    consultationNotes: {
      "OPD-8843": {
        chiefConcern: "Follow-up for diabetes mellitus and blood pressure management.",
        history: "Home fasting glucose 138–160 mg/dL over past 7 days; episode of lightheadedness/dizziness on 15 Oct. Compliance irregular over last 3 weeks due to previous partial pharmacy dispense.",
        examination: "Chest clear, CVS S1S2 heard. No pedal edema. Peripheral pulses palpable bilaterally.",
        assessment: "Suboptimally controlled Type 2 Diabetes Mellitus with worsening glycemia trend (HbA1c rising 7.1 -> 7.9 -> 8.6%). Stage 1 essential hypertension.",
        plan: "Step up metabolic control. Confirm current renal parameters and lipid baseline before drug titration. Emphasize home BP log and hydration.",
        diagnoses: ["Type 2 Diabetes Mellitus", "Essential Hypertension"],
        signedBy: "Dr. R. Rao",
        signedTime: "10:58 AM"
      }
    },

    // Prescriptions (D5)
    prescriptions: {
      "RX-7710": {
        id: "RX-7710",
        encounterId: "OPD-8843",
        uhid: "884021",
        doctor: "Dr. R. Rao",
        signedTime: "10:25 AM",
        status: "Signed",
        items: [
          {
            id: "RX-LINE-1",
            medicine: "Telmisartan 40 mg tablet",
            directions: "Once daily, morning after breakfast",
            duration: "30 days",
            prescribedQty: 30,
            dispensedQty: 20,
            balanceRemaining: 10,
            batch: "TL3890",
            expiry: "11/2026",
            status: "Partially dispensed",
            stockText: "Limited stock — 20 available · Last synced 2 min ago"
          },
          {
            id: "RX-LINE-2",
            medicine: "Metformin 500 mg tablet",
            directions: "Twice daily with meals (08:00 AM - 08:00 PM)",
            duration: "30 days",
            prescribedQty: 60,
            dispensedQty: 0,
            balanceRemaining: 60,
            status: "Awaiting prescriber review",
            clarificationId: "CLR-401",
            stockText: "Unavailable — stock confirmed 0 · Last synced 1 min ago"
          }
        ],
        stockOutDecision: {
          recorded: true,
          decision: "Keep as prescribed — await stock replenishment",
          time: "10:47 AM",
          doctor: "Dr. R. Rao",
          note: "Advised patient to claim 20 Telmisartan today and return for Metformin 60 tabs once central batch arrives."
        }
      }
    },

    // Pharmacy Inventory (FEFO tracked)
    inventory: {
      "Telmisartan 40 mg": {
        available: 0, // was 20, now 0 after Kamalbai took 20
        unit: "tablets",
        lastSynced: "2 min ago",
        batches: [
          { batchNumber: "TL3890", expiry: "11/2026", remaining: 0, initial: 20, location: "Rack A3" }
        ]
      },
      "Metformin 500 mg": {
        available: 0,
        unit: "tablets",
        lastSynced: "1 min ago",
        batches: []
      }
    },

    // Clarifications (SCR-18)
    clarifications: [
      {
        id: "CLR-401",
        rxId: "RX-7710",
        uhid: "884021",
        medicine: "Metformin 500 mg tablet",
        directions: "Twice daily, 30 days",
        reason: "Out of stock at Main Dispensary (PO-4481 replenishment pending)",
        raisedBy: "Pharmacist V. Gokhale",
        raisedTime: "10:41 AM",
        owner: "Dr. R. Rao",
        status: "Awaiting prescriber review",
        prescribingDecision: "Keep as prescribed (patient notified)"
      }
    ],

    // Laboratory & Diagnostic Orders (D4)
    orders: [
      {
        id: "ORD-9921",
        uhid: "884021",
        encounterId: "OPD-8843",
        test: "Lipid profile",
        priority: "Routine",
        orderedTime: "10:20 AM",
        collectedTime: "10:26 AM",
        specimen: "Serum",
        barcode: "DEMO-BC-77120",
        status: "Specimen rejected",
        rejectionReason: "Haemolysed",
        rejectionTime: "10:35 AM",
        recollectionTask: {
          task: "Recollect blood specimen for Lipid Profile",
          owner: "Nurse S. More",
          status: "Collection pending",
          priority: "Stat"
        }
      },
      {
        id: "ORD-9922",
        uhid: "884021",
        encounterId: "OPD-8843",
        test: "HbA1c (Glycated Hemoglobin)",
        priority: "Routine",
        orderedTime: "10:20 AM",
        status: "In progress",
        owner: "Dr. R. Rao (follow-up result review assigned)"
      },
      {
        id: "ORD-9923",
        uhid: "884021",
        encounterId: "OPD-8843",
        test: "Serum creatinine",
        priority: "Routine",
        orderedTime: "10:20 AM",
        resultEnteredTime: "10:30 AM",
        verifiedTime: "10:38 AM",
        verifiedBy: "P. Nair",
        acknowledgedBy: "Dr. R. Rao",
        acknowledgedTime: "10:46 AM",
        value: "1.4 mg/dL",
        referenceRange: "0.6 – 1.2 mg/dL",
        deltaFlag: "Value differs materially from prior result (14 Feb 2026: 0.9 mg/dL)",
        status: "Acknowledged"
      },
      {
        id: "ORD-9930",
        uhid: "884150",
        encounterId: "OPD-8851",
        test: "Serum potassium",
        priority: "Critical",
        orderedTime: "09:50 AM",
        resultEnteredTime: "10:05 AM",
        verifiedTime: "10:12 AM",
        verifiedBy: "P. Nair",
        value: "6.8 mmol/L",
        referenceRange: "3.5 – 5.0 mmol/L",
        status: "Resulted — awaiting review",
        readBackRequired: true,
        readBackLogged: false
      }
    ],

    // Invoices & Billing (D6)
    invoices: {
      "INV-OPD-5521": {
        id: "INV-OPD-5521",
        uhid: "884021",
        encounterId: "OPD-8843",
        patientName: "Mrs. Kamalbai Deshmukh",
        payer: "TPA",
        postedTime: "10:44 AM",
        status: "Paid and reconciled", // alternate branch is "Payment pending reconciliation"
        subtotal: 1790,
        tpaAllocation: 1040,
        tpaStatus: "Insurer decision pending",
        patientCoPay: 750,
        paidAmount: 750,
        paymentMethod: "UPI",
        paymentRef: "DEMO-UPI-8821",
        receiptId: "RCP-5521",
        reconciledTime: "10:52 AM",
        lines: [
          { item: "General Consultation (OPD)", dept: "General Medicine", qty: 1, unitPrice: 600, total: 600 },
          { item: "Lipid Profile Diagnostic Panel", dept: "Biochemistry", qty: 1, unitPrice: 450, total: 450 },
          { item: "HbA1c Blood Test", dept: "Biochemistry", qty: 1, unitPrice: 400, total: 400 },
          { item: "Serum Creatinine Test", dept: "Biochemistry", qty: 1, unitPrice: 220, total: 220 },
          { item: "Telmisartan 40 mg tab (Batch TL3890)", dept: "Pharmacy", qty: 20, unitPrice: 6, total: 120 },
          { item: "Metformin 500 mg tab", dept: "Pharmacy", qty: 0, unitPrice: 0, total: 0, note: "0 dispensed (stock shortage)" }
        ]
      },
      "INV-OPD-5498": {
        id: "INV-OPD-5498",
        uhid: "883907",
        patientName: "Mr. Anil Joshi",
        payer: "Cash",
        postedTime: "09:30 AM",
        status: "Posted",
        subtotal: 820,
        tpaAllocation: 0,
        patientCoPay: 820,
        lines: [
          { item: "Consultation", dept: "General Medicine", qty: 1, unitPrice: 600, total: 600 },
          { item: "Serum Glucose Fasting", dept: "Biochemistry", qty: 1, unitPrice: 220, total: 220 }
        ]
      }
    },

    // Billing Adjustments (D6, D10)
    adjustments: [
      {
        id: "ADJ-120",
        invoiceId: "INV-OPD-5498",
        patientName: "Mr. Anil Joshi",
        type: "Trust Concession",
        amount: 100,
        reason: "Trust concession (management approval)",
        requestedBy: "A. Pawar (Cashier)",
        requestedTime: "10:19 AM",
        approver: "N. Kamat (Supervisor)",
        status: "Pending approval"
      }
    ],

    // Document Packages (D8)
    packages: {
      "PKG-8843-v1": {
        id: "PKG-8843-v1",
        uhid: "884021",
        encounterId: "OPD-8843",
        patientName: "Mrs. Kamalbai Deshmukh",
        version: "v1 draft",
        createdTime: "11:05 AM, 18 Oct 2026",
        status: "Failed", // Failed / Revoked alternate
        channel: "WhatsApp (+91 ••••• ••000)",
        failureReason: "WhatsApp number not registered",
        consentStatus: "Recorded (11:10 AM)",
        documents: [
          { title: "Clinical Visit Summary", signed: "10:58 AM by Dr. R. Rao", required: true, included: true },
          { title: "Prescription Slip (RX-7710)", signed: "10:25 AM", required: true, included: true },
          { title: "Lab Investigation Report (ORD-9923)", signed: "10:38 AM by P. Nair", required: false, included: true },
          { title: "Pending Investigation Notice (ORD-9921, ORD-9922)", note: "Pending HbA1c & Lipids", required: true, included: true },
          { title: "Itemized Hospital Bill (INV-OPD-5521)", status: "Posted ₹1,790", required: true, included: true },
          { title: "Official Payment Receipt (RCP-5521)", status: "₹750 Paid", required: true, included: true }
        ]
      },
      "PKG-8801-v2": {
        id: "PKG-8801-v2",
        uhid: "884022",
        patientName: "Mr. Ramesh Deshmukh",
        version: "v2 (corrected reissue)",
        status: "Delivered",
        channel: "SMS link",
        createdTime: "02 Sep 2026"
      },
      "PKG-8790-v1": {
        id: "PKG-8790-v1",
        uhid: "884077",
        patientName: "Mrs. Fatima Sheikh",
        version: "v1",
        status: "Revoked",
        channel: "WhatsApp",
        createdTime: "17 Oct 2026, 4:20 PM",
        revocationReason: "Dispatched to incorrect recipient contact number. Audit retained."
      }
    },

    // Ward Beds (D2, D10)
    beds: [
      { id: "104-A", status: "Available", type: "General Ward", floor: "Floor 1" },
      { id: "104-B", status: "Occupied", patientUhid: "880312", patientName: "Mr. Suresh Jadhav", type: "General Ward", floor: "Floor 1", fallRisk: true, isolation: "Contact" },
      { id: "105-A", status: "Cleaning", type: "Semi-Private", floor: "Floor 1" },
      { id: "105-B", status: "Occupied", patientUhid: "879455", patientName: "Mrs. Lata Gaikwad", type: "Semi-Private", floor: "Floor 1", scheme: true }
    ],

    // SBAR Nursing Handover (SCR-15)
    nursingHandovers: {
      "104-B": {
        bed: "104-B",
        uhid: "880312",
        patient: "Mr. Suresh Jadhav, 71M",
        situation: "Post-op Day 2 right total hip arthroplasty. Hemodynamically stable, ambulating with walker assist.",
        background: "Known hypertension and osteoarthritis. Admitted 16 Oct under Dr. Joshi.",
        assessment: "Pain 3/10 controlled on paracetamol. Surgical dressing dry and intact. Morse Fall Scale 65 (High Risk). Contact precautions active for MRSA screening swab.",
        recommendation: "Maintain bed alarm active. Assist with transfers. Next vital observation due 11:00 AM.",
        outgoingNurse: "Nurse S. More",
        incomingNurse: "Nurse P. Kadam",
        signedTime: "10:45 AM"
      }
    },

    // WORM Audit Trail (D7)
    auditLog: [
      {
        id: "AUD-001",
        timestampUTC: "18 Oct 2026, 05:18:40",
        actor: "A. Pawar",
        role: "Cashier",
        action: "Payment initiated",
        resource: "INV-OPD-5521",
        justification: "Counter payment ₹750 via UPI (DEMO-UPI-8821)"
      },
      {
        id: "AUD-002",
        timestampUTC: "18 Oct 2026, 05:07:15",
        actor: "Dr. S. Mehta",
        role: "Doctor",
        action: "Break-glass access",
        resource: "UHID 884150",
        justification: "Emergency care, patient transferred from ER with acute panic potassium"
      },
      {
        id: "AUD-003",
        timestampUTC: "18 Oct 2026, 04:32:12",
        actor: "Dr. R. Rao",
        role: "Doctor",
        action: "Viewed record",
        resource: "UHID 884021",
        justification: "Assigned OPD consultation"
      },
      {
        id: "AUD-004",
        timestampUTC: "17 Oct 2026, 05:50:03",
        actor: "N. Kamat",
        role: "Supervisor",
        action: "Record merge requested",
        resource: "UHID 889912",
        justification: "Possible duplicate of Kamalbai Deshmukh (UHID 884021)"
      }
    ],

    // Inpatient Ward Beds Matrix (SCR-15)
    beds: [
      { id: "104-A", bedId: "104-A", type: "Stepdown Bed", floor: "Floor 3", ward: "Medical Ward", status: "Available", patientName: null, uhid: null },
      { id: "104-B", bedId: "104-B", type: "Inpatient Bed", floor: "Floor 3", ward: "Medical Ward", status: "Occupied", patientName: "Mr. Suresh Jadhav", uhid: "880312", morse: 65, isolation: "Contact Precaution" },
      { id: "105-A", bedId: "105-A", type: "Inpatient Bed", floor: "Floor 3", ward: "Medical Ward", status: "Available", patientName: null, uhid: null },
      { id: "105-B", bedId: "105-B", type: "Inpatient Bed", floor: "Floor 3", ward: "Medical Ward", status: "Occupied", patientName: "Mrs. Lata Gaikwad", uhid: "879455", morse: 45 },
      { id: "ICU-01", bedId: "ICU-01", type: "ICU Ventilator", floor: "Floor 2", ward: "Intensive Care", status: "Available", patientName: null, uhid: null },
      { id: "ICU-02", bedId: "ICU-02", type: "ICU Cardiac", floor: "Floor 2", ward: "Intensive Care", status: "Occupied", patientName: "Mr. Rajeshwar Patil", uhid: "884150", morse: 70 }
    ],

    // WORM Audit Logs Alias
    auditLogs: [
      {
        id: "AUD-001",
        timestamp: "10:44 AM",
        timestampUTC: "18 Oct 2026, 05:18:40",
        actor: "A. Pawar",
        actorName: "A. Pawar",
        actorRole: "Cashier",
        action: "Payment initiated",
        resource: "INV-OPD-5521",
        details: "Counter payment ₹750 via UPI (DEMO-UPI-8821)",
        hash: "DEMO-HASH-0041"
      },
      {
        id: "AUD-002",
        timestamp: "10:37 AM",
        timestampUTC: "18 Oct 2026, 05:07:15",
        actor: "Dr. S. Mehta",
        actorName: "Dr. S. Mehta",
        actorRole: "Doctor",
        action: "Break-glass access",
        resource: "UHID 884150",
        details: "Emergency care, patient transferred with acute panic potassium",
        hash: "DEMO-HASH-0040"
      },
      {
        id: "AUD-003",
        timestamp: "09:40 AM",
        timestampUTC: "18 Oct 2026, 04:32:12",
        actor: "Dr. R. Rao",
        actorName: "Dr. R. Rao",
        actorRole: "Doctor",
        action: "Viewed record",
        resource: "UHID 884021",
        details: "Assigned OPD consultation",
        hash: "DEMO-HASH-0039"
      }
    ]
  };
}
