import { h } from "preact";
import { useState } from "preact/hooks";
import { appState, activeBlockingInterlock } from "../core/store.js";
import { currentRoute } from "../core/router.js";
import { Chip } from "../kit/Chip.jsx";
import { Btn } from "../kit/Btn.jsx";
import { Field } from "../kit/Field.jsx";
import { Modal, Drawer } from "../kit/Modal.jsx";
import { PatientStrip } from "../kit/PatientStrip.jsx";
import { dispatch } from "../core/command.js";

export function WorkspaceScreen() {
  const state = appState.value;
  const uhid = currentRoute.value.query.uhid || "884021";
  const patient =
    (state.patients && (state.patients[uhid] || Object.values(state.patients).find((p) => p.uhid === uhid))) || {
      uhid: "884021",
      name: "Mrs. Kamalbai Deshmukh",
      age: 58,
      gender: "Female",
      payer: "TPA",
      attending: "Dr. R. Rao",
      allergies: ["Penicillin (Severe anaphylaxis)"]
    };

  // Specific Frame Overrides from query params
  const frameQuery = currentRoute.value.query.frame;
  const showOfflineBanner = frameQuery === "37" || currentRoute.value.query.offline === "true";

  // Modals & Drawers state
  const [stockOutModalOpen, setStockOutModalOpen] = useState(frameQuery === "08");
  const [provenanceDrawerOpen, setProvenanceDrawerOpen] = useState(frameQuery === "09");
  const [allergyModalOpen, setAllergyModalOpen] = useState(frameQuery === "28");
  const [closureModalOpen, setClosureModalOpen] = useState(frameQuery === "35");
  const [activeTab, setActiveTab] = useState("clinical");

  // Clinical Notes State
  const [notes, setNotes] = useState({
    subjective:
      "Patient presents with uncontrolled polydipsia, fatigue, and right heel superficial blister for 10 days. Reports adherence to oral antidiabetic agents is irregular.",
    objective:
      "BP: 148/92 mmHg, Pulse: 88 bpm. RBS: 242 mg/dL. Right foot: 1.5cm superficial erosion over medial heel, no cellulitis, peripheral pulses palpable, monofilament sensation diminished in stocking distribution.",
    assessment:
      "1. Type 2 Diabetes Mellitus with Poor Glycemic Control (HbA1c 8.6%)\n2. Diabetic Peripheral Neuropathy with Grade 1 Neuropathic Blister\n3. Stage 1 Essential Hypertension",
    plan:
      "Intensify glycemic therapy. Wound dressing daily with hydrogel. Order Serum Electrolytes, Creatinine, Urine Microalbumin. Diabetic foot care counseling."
  });

  // Current Prescription items
  const [rxList, setRxList] = useState([
    {
      drug: "Metformin ER",
      dose: "500 mg",
      freq: "1-0-1 (After meals)",
      duration: "30 days",
      stock: "120 in stock",
      status: "Available"
    },
    {
      drug: "Sitagliptin",
      dose: "50 mg",
      freq: "1-0-0 (Morning)",
      duration: "30 days",
      stock: "45 in stock",
      status: "Available"
    },
    {
      drug: "Telmisartan",
      dose: "40 mg",
      freq: "0-1-0 (Afternoon)",
      duration: "30 days",
      stock: "90 in stock",
      status: "Available"
    }
  ]);

  const [searchDrug, setSearchDrug] = useState("");

  // Handle Prescription Actions
  const handleAddStockOutDrug = () => {
    // Triggers Stock-out Decision Dialog (Frame 08)
    setStockOutModalOpen(true);
  };

  const handleSimulateAllergyStop = () => {
    // Triggers Allergy Interlock Modal (Frame 28)
    activeBlockingInterlock.value = "ALLERGY_PENICILLIN";
    setAllergyModalOpen(true);
  };

  const handleSubstituteDrug = (substitute) => {
    setRxList((prev) => [
      ...prev,
      {
        drug: substitute.name,
        dose: substitute.dose,
        freq: "1-0-1",
        duration: "30 days",
        stock: substitute.stock,
        status: "Substituted"
      }
    ]);
    setStockOutModalOpen(false);
    dispatch("DRUG_SUBSTITUTED", { original: "Glimepiride 2mg", substitute });
  };

  const handleOrderLab = (testName) => {
    dispatch("CREATE_ORDER", {
      orderId: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      uhid: patient.uhid,
      patientName: patient.name,
      test: testName,
      status: "Ordered",
      priority: "Routine",
      orderedAt: "Just now"
    });
  };

  const handleAttemptCloseEncounter = () => {
    // Check if critical items pending (Frame 35)
    activeBlockingInterlock.value = "CLOSURE_BLOCKER";
    setClosureModalOpen(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "8px" }}>
      {/* Offline Mode Banner (Frame 37) */}
      {showOfflineBanner && (
        <div
          style={{
            background: "var(--color-operational-plum-bg)",
            border: "1px solid var(--color-operational-plum-border)",
            padding: "8px 16px",
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ color: "var(--color-operational-plum)" }}>
              wifi_off
            </span>
            <span className="font-subtitle-sm" style={{ color: "var(--color-operational-plum)" }}>
              Local Cache Mode &bull; Network Offline
            </span>
            <span className="font-body-sm" style={{ color: "var(--color-text-secondary)" }}>
              All clinical notes and orders are securely persisted in local encrypted storage. Auto-reconnect active.
            </span>
          </div>
          <Btn
            size="sm"
            variant="secondary"
            onClick={() => (window.location.hash = "#/downtime")}
          >
            Review Sync Reconnect Queue
          </Btn>
        </div>
      )}

      {/* Clinical Consultation Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="font-subtitle-sm">Doctor Consultation Desk</span>
          <Chip tone="slate">Dr. R. Rao &bull; OPD Room 4</Chip>
          <Chip tone="red" icon="warning">Allergy: Penicillin</Chip>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Btn
            size="sm"
            variant="secondary"
            icon="inventory_2"
            onClick={() => setProvenanceDrawerOpen(true)}
          >
            HbA1c Provenance (Frame 09)
          </Btn>
          <Btn
            size="sm"
            variant="secondary"
            icon="lock"
            onClick={handleSimulateAllergyStop}
          >
            Test Allergy Interlock (Frame 28)
          </Btn>
          <Btn
            size="sm"
            variant="primary"
            icon="task_alt"
            onClick={handleAttemptCloseEncounter}
          >
            Sign &amp; Close Encounter (Frame 22/35)
          </Btn>
        </div>
      </div>

      {/* 3-Panel Consultation Desk (Frame 07) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr 380px",
          gap: "12px",
          flex: 1,
          overflow: "hidden"
        }}
      >
        {/* Panel 1: Patient Chart, Longitudinal History & Diagnostic Staging */}
        <div
          className="card panel-scroll"
          style={{
            background: "var(--color-bg-primary)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            padding: "14px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="font-subtitle-sm">Longitudinal History</span>
            <Chip tone="slate">3 Prior Visits</Chip>
          </div>

          {/* Vitals Summary Card */}
          <div
            style={{
              padding: "10px",
              background: "var(--color-bg-secondary)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border-subtle)"
            }}
          >
            <div className="font-caption" style={{ color: "var(--color-text-tertiary)", marginBottom: "4px" }}>
              TODAY'S TRIAGE (09:12 AM)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "12px" }}>
              <div>BP: <strong style={{ color: "var(--color-clinical-amber)" }}>148/92</strong></div>
              <div>Pulse: <strong>88 bpm</strong></div>
              <div>RBS: <strong style={{ color: "var(--color-clinical-red)" }}>242 mg/dL</strong></div>
              <div>Temp: <strong>98.4°F</strong></div>
            </div>
          </div>

          {/* Historical Diagnostics with Provenance Triggers */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>
              LABORATORY PROFILE
            </span>

            <div
              onClick={() => setProvenanceDrawerOpen(true)}
              style={{
                cursor: "pointer",
                padding: "8px 10px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border-subtle)",
                background: "var(--color-bg-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div>
                <div style={{ fontWeight: "600", fontSize: "12px" }}>HbA1c Glycated</div>
                <div className="font-caption" style={{ color: "var(--color-text-secondary)" }}>
                  City Lab &bull; Today 08:45 AM
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span className="font-subtitle-sm" style={{ color: "var(--color-clinical-red)" }}>
                  8.6 %
                </span>
                <span className="material-symbols-outlined" style={{ fontSize: "14px", verticalAlign: "middle", marginLeft: "4px" }}>
                  open_in_new
                </span>
              </div>
            </div>

            <div
              style={{
                padding: "8px 10px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border-subtle)",
                background: "var(--color-bg-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div>
                <div style={{ fontWeight: "600", fontSize: "12px" }}>Serum Potassium (K+)</div>
                <div className="font-caption" style={{ color: "var(--color-text-secondary)" }}>
                  Dr. Rao LIS &bull; In-Flight
                </div>
              </div>
              <Chip tone="red">6.8 mEq/L (Critical)</Chip>
            </div>
          </div>

          {/* Chronic Conditions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>
              CHRONIC PROBLEM LIST
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              <Chip tone="slate">Type 2 DM (12y)</Chip>
              <Chip tone="slate">Hypertension (5y)</Chip>
              <Chip tone="slate">Peripheral Neuropathy</Chip>
              <Chip tone="red">Severe Penicillin Allergy</Chip>
            </div>
          </div>

          {/* Quick Order Lab Buttons */}
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
            <span className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>
              1-CLICK STAT LAB ORDER
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              <Btn size="sm" variant="secondary" onClick={() => handleOrderLab("Serum Electrolytes")}>
                + Electrolytes
              </Btn>
              <Btn size="sm" variant="secondary" onClick={() => handleOrderLab("Serum Creatinine")}>
                + Creatinine
              </Btn>
              <Btn size="sm" variant="secondary" onClick={() => handleOrderLab("Urine Microalbumin")}>
                + Microalbumin
              </Btn>
              <Btn size="sm" variant="secondary" onClick={() => handleOrderLab("Complete Blood Count")}>
                + CBC
              </Btn>
            </div>
          </div>
        </div>

        {/* Panel 2: Clinical SOAP Documentation Composer */}
        <div
          className="card panel-scroll"
          style={{
            background: "var(--color-bg-primary)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "16px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="font-subtitle">Doctor Clinical Note (SOAP)</span>
              <Chip tone="emerald">Auto-Saved 10s ago</Chip>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <Btn
                size="sm"
                variant="secondary"
                icon="bolt"
                onClick={() =>
                  setNotes((prev) => ({
                    ...prev,
                    plan: prev.plan + "\nAdded foot ulcer dressing protocol with betadine and non-adherent dressing."
                  }))
                }
              >
                Insert Foot Protocol
              </Btn>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div>
              <label className="font-caption" style={{ fontWeight: "600", color: "var(--color-text-secondary)" }}>
                SUBJECTIVE (Symptoms &amp; Patient Report)
              </label>
              <textarea
                className="input-base"
                rows={3}
                style={{ width: "100%", marginTop: "4px", resize: "vertical" }}
                value={notes.subjective}
                onInput={(e) => setNotes({ ...notes, subjective: e.target.value })}
              />
            </div>

            <div>
              <label className="font-caption" style={{ fontWeight: "600", color: "var(--color-text-secondary)" }}>
                OBJECTIVE (Vitals, Physical Findings &amp; Examination)
              </label>
              <textarea
                className="input-base"
                rows={3}
                style={{ width: "100%", marginTop: "4px", resize: "vertical" }}
                value={notes.objective}
                onInput={(e) => setNotes({ ...notes, objective: e.target.value })}
              />
            </div>

            <div>
              <label className="font-caption" style={{ fontWeight: "600", color: "var(--color-text-secondary)" }}>
                ASSESSMENT (Differential &amp; Working Diagnoses)
              </label>
              <textarea
                className="input-base"
                rows={3}
                style={{ width: "100%", marginTop: "4px", resize: "vertical" }}
                value={notes.assessment}
                onInput={(e) => setNotes({ ...notes, assessment: e.target.value })}
              />
            </div>

            <div>
              <label className="font-caption" style={{ fontWeight: "600", color: "var(--color-text-secondary)" }}>
                PLAN (Medications, Referrals, Inpatient &amp; Follow-up)
              </label>
              <textarea
                className="input-base"
                rows={3}
                style={{ width: "100%", marginTop: "4px", resize: "vertical" }}
                value={notes.plan}
                onInput={(e) => setNotes({ ...notes, plan: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Panel 3: Rx Composer & Formulary Availability */}
        <div
          className="card panel-scroll"
          style={{
            background: "var(--color-bg-primary)",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "14px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="font-subtitle-sm">Electronic Prescription (Rx)</span>
            <Chip tone="slate">RX-7710</Chip>
          </div>

          {/* Quick Formulary Search */}
          <div style={{ display: "flex", gap: "6px" }}>
            <input
              className="input-base"
              placeholder="Search Formulary / Drug..."
              style={{ flex: 1, fontSize: "12px" }}
              value={searchDrug}
              onInput={(e) => setSearchDrug(e.target.value)}
            />
            <Btn size="sm" variant="secondary" icon="add" onClick={handleAddStockOutDrug}>
              Simulate Stock-Out
            </Btn>
          </div>

          {/* Active Drugs List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
            {rxList.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: "10px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border-subtle)",
                  background: item.status === "Substituted" ? "var(--color-bg-secondary)" : "var(--color-bg-primary)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "600", fontSize: "13px" }}>{item.drug} {item.dose}</span>
                  <Chip tone={item.status === "Substituted" ? "plum" : "emerald"}>
                    {item.status}
                  </Chip>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--color-text-secondary)" }}>
                  <span>Freq: {item.freq}</span>
                  <span>Duration: {item.duration}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                  <span className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>
                    {item.stock}
                  </span>
                  <Btn
                    size="sm"
                    variant="ghost"
                    icon="delete"
                    onClick={() => setRxList(rxList.filter((_, i) => i !== idx))}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Prescription Actions */}
          <div style={{ borderTop: "1px solid var(--color-border-subtle)", paddingTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <Btn
              variant="secondary"
              icon="medication"
              onClick={handleSimulateAllergyStop}
            >
              Add Penicillin (Test Safety Stop)
            </Btn>
            <Btn
              variant="primary"
              icon="send"
              onClick={() => {
                dispatch("PRESCRIBE_MEDICATION", {
                  uhid: patient.uhid,
                  rxId: "RX-7710",
                  items: rxList
                });
              }}
            >
              Transmit Rx to OPD Pharmacy
            </Btn>
          </div>
        </div>
      </div>

      {/* Frame 08: Stock-Out Decision Dialog Modal */}
      {stockOutModalOpen && (
        <Modal
          title="Stock-Out Alert: Glimepiride 2mg Tablets"
          open={stockOutModalOpen}
          onClose={() => setStockOutModalOpen(false)}
          actions={
            <Btn variant="secondary" onClick={() => setStockOutModalOpen(false)}>
              Keep Unfulfilled
            </Btn>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div
              style={{
                padding: "10px 12px",
                background: "var(--color-operational-plum-bg)",
                border: "1px solid var(--color-operational-plum-border)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                gap: "10px"
              }}
            >
              <span className="material-symbols-outlined" style={{ color: "var(--color-operational-plum)" }}>
                inventory_2
              </span>
              <div style={{ fontSize: "13px" }}>
                <strong>Current Formulary Balance: 0 Units</strong> at OPD Main Dispensary.
                <br />
                <span style={{ color: "var(--color-text-secondary)", fontSize: "12px" }}>
                  Satellite IPD Pharmacy has 14 units (Batch #GL-991). Select action below:
                </span>
              </div>
            </div>

            <div className="font-subtitle-sm">Recommended Therapeutic Substitutes</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border-subtle)",
                  background: "var(--color-bg-secondary)"
                }}
              >
                <div>
                  <div style={{ fontWeight: "600", fontSize: "13px" }}>Gliclazide 80 mg MR</div>
                  <div className="font-caption" style={{ color: "var(--color-text-secondary)" }}>
                    Equivalent Sulfonylurea &bull; 240 units available in OPD dispensary
                  </div>
                </div>
                <Btn
                  size="sm"
                  variant="primary"
                  onClick={() =>
                    handleSubstituteDrug({
                      name: "Gliclazide MR",
                      dose: "80 mg",
                      stock: "240 in stock"
                    })
                  }
                >
                  Switch to Gliclazide
                </Btn>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border-subtle)",
                  background: "var(--color-bg-secondary)"
                }}
              >
                <div>
                  <div style={{ fontWeight: "600", fontSize: "13px" }}>Teneligliptin 20 mg</div>
                  <div className="font-caption" style={{ color: "var(--color-text-secondary)" }}>
                    DPP-4 Inhibitor &bull; 180 units available in OPD dispensary
                  </div>
                </div>
                <Btn
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    handleSubstituteDrug({
                      name: "Teneligliptin",
                      dose: "20 mg",
                      stock: "180 in stock"
                    })
                  }
                >
                  Switch to Teneligliptin
                </Btn>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Frame 09: Data Provenance Slide-over Drawer */}
      {provenanceDrawerOpen && (
        <Drawer
          title="Diagnostic Data Provenance &amp; Verification"
          open={provenanceDrawerOpen}
          onClose={() => setProvenanceDrawerOpen(false)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                padding: "12px",
                background: "var(--color-bg-secondary)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border-subtle)"
              }}
            >
              <div className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>
                INGESTION TARGET
              </div>
              <div className="font-subtitle" style={{ marginTop: "4px" }}>
                HbA1c Glycated Hemoglobin: 8.6 %
              </div>
              <div className="font-body-sm" style={{ color: "var(--color-text-secondary)" }}>
                Reference Range: &lt; 5.7% (Normal), 5.7 - 6.4% (Prediabetes), &gt; 6.5% (Diabetes)
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <span className="font-subtitle-sm">Cryptographic Verification Chain</span>

              <div style={{ display: "flex", gap: "10px" }}>
                <span className="material-symbols-outlined" style={{ color: "var(--color-clinical-emerald)" }}>
                  check_circle
                </span>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "12px" }}>Source Laboratory</div>
                  <div style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
                    City Diagnostic Center Pvt Ltd, NABL Accr. #M-8910
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <span className="material-symbols-outlined" style={{ color: "var(--color-clinical-emerald)" }}>
                  verified
                </span>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "12px" }}>Signoff Pathologist</div>
                  <div style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
                    Dr. V. Kulkarni, MD Pathology (Reg. #MMC-2009-0812)
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <span className="material-symbols-outlined" style={{ color: "var(--color-interactive-primary)" }}>
                  fingerprint
                </span>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "12px" }}>ABHA Document CID / Hash</div>
                  <div className="font-mono-sm" style={{ fontSize: "10px", wordBreak: "break-all" }}>
                    SHA-256: e82f1b74a3821035bda51893129840c9d74880a1c3
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "auto" }}>
              <Btn
                fullWidth
                variant="primary"
                icon="print"
                onClick={() => window.print()}
              >
                Print Certified Lab Ingestion Slip
              </Btn>
            </div>
          </div>
        </Drawer>
      )}

      {/* Frame 28: Allergy Hard-Stop Blocking Interlock Modal */}
      {allergyModalOpen && (
        <Modal
          title="CRITICAL SAFETY INTERLOCK: Penicillin Hypersensitivity"
          open={allergyModalOpen}
          isBlocking={true}
          actions={
            <div style={{ display: "flex", gap: "10px" }}>
              <Btn
                variant="secondary"
                onClick={() => {
                  activeBlockingInterlock.value = null;
                  setAllergyModalOpen(false);
                }}
              >
                Cancel &amp; Discard Amoxicillin
              </Btn>
              <Btn
                variant="primary"
                onClick={() => {
                  activeBlockingInterlock.value = null;
                  setAllergyModalOpen(false);
                  handleSubstituteDrug({
                    name: "Azithromycin",
                    dose: "500 mg",
                    stock: "140 in stock"
                  });
                }}
              >
                Switch to Safe Non-Beta-Lactam (Azithromycin)
              </Btn>
            </div>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div
              style={{
                padding: "12px",
                background: "var(--color-red-50)",
                border: "2px solid var(--color-clinical-red)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                gap: "12px"
              }}
            >
              <span className="material-symbols-outlined" style={{ color: "var(--color-clinical-red)", fontSize: "28px" }}>
                gpp_bad
              </span>
              <div>
                <div style={{ color: "var(--color-clinical-red)", fontWeight: "700", fontSize: "14px" }}>
                  HARD STOP: Anaphylaxis Risk Detected
                </div>
                <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", marginTop: "4px" }}>
                  Patient <strong>Kamalbai Deshmukh</strong> has a documented severe anaphylactic reaction to
                  Penicillin derivatives. Amoxicillin-Clavulanate is strictly contraindicated.
                </div>
              </div>
            </div>

            <div className="font-subtitle-sm">Alternative First-Line Options</div>
            <div style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
              Recommended macro-antimicrobials: <strong>Azithromycin 500mg</strong> or <strong>Ciprofloxacin 500mg</strong>.
            </div>
          </div>
        </Modal>
      )}

      {/* Frame 35: Encounter Closure Blocker Interlock */}
      {closureModalOpen && (
        <Modal
          title="Encounter Sign-off Blocked"
          open={closureModalOpen}
          isBlocking={true}
          actions={
            <div style={{ display: "flex", gap: "10px" }}>
              <Btn
                variant="secondary"
                onClick={() => {
                  activeBlockingInterlock.value = null;
                  setClosureModalOpen(false);
                }}
              >
                Return to Workspace
              </Btn>
              <Btn
                variant="primary"
                onClick={() => {
                  activeBlockingInterlock.value = null;
                  setClosureModalOpen(false);
                  window.location.hash = "#/critical";
                }}
              >
                Acknowledge in Critical Desk (Frame 34)
              </Btn>
            </div>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
                notification_important
              </span>
              <div>
                <strong style={{ color: "var(--color-clinical-red)" }}>
                  Unacknowledged Panic Lab Result
                </strong>
                <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", marginTop: "2px" }}>
                  Serum Potassium (K+) result is <strong>6.8 mEq/L (Critical Panic High)</strong>. Mandatory verbal
                  read-back barrier must be completed before outpatient discharge.
                </div>
              </div>
            </div>

            <div style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
              All clinical risk findings must be stamped with attending physician confirmation prior to issuing the
              discharge package and electronic prescription.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
