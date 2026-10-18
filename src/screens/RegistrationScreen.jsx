import { h } from "preact";
import { useState } from "preact/hooks";
import { appState } from "../core/store.js";
import { currentRoute } from "../core/router.js";
import { Chip } from "../kit/Chip.jsx";
import { Btn } from "../kit/Btn.jsx";
import { Field } from "../kit/Field.jsx";
import { dispatch } from "../core/command.js";

export function RegistrationScreen() {
  const state = appState.value;
  const isErrorState = currentRoute.value.query.state === "error";

  const [form, setForm] = useState({
    name: "Kamalbai Deshmukh",
    age: "58",
    gender: "Female",
    phone: "9823012345",
    abhaId: "91-4432-8891-2011",
    aadhaarLast4: "4821",
    address: "Flat 402, Shivneri Heights, Pune Road, Kolhapur",
    guardianName: "Sanjay Deshmukh",
    guardianRelation: "Son",
    payerType: "TPA",
    tpaName: "Star Health Insurance",
    policyNo: "SH-2024-88912",
    bloodGroup: "B+",
    allergies: "Penicillin (Severe anaphylaxis)",
    referralDoctor: "Dr. A. K. Joshi (Rural Clinic)",
    department: "Internal Medicine / Diabetology",
    attendingDoctor: "Dr. Rajesh Rao",
    ocrConfidence: "98.4%",
    documentType: "City Lab Diagnostic Report & Referral Slip"
  });

  const [errors, setErrors] = useState(
    isErrorState
      ? {
          phone: "Phone number already associated with duplicate UHID-2024-00142",
          guardianName: "Guardian authorization signature missing on intake scan",
          policyNo: "Pre-auth authorization cap pending TPA desk confirmation"
        }
      : {}
  );

  const [ocrApplied, setOcrApplied] = useState(true);

  const handleFieldChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      return;
    }

    const patCount = Object.keys(state.patients || {}).length;
    const newPatient = {
      uhid: String(884025 + patCount),
      name: form.name,
      age: parseInt(form.age) || 58,
      sex: form.gender.startsWith("F") ? "F" : "M",
      phone: form.phone,
      abha: form.abhaId,
      payer: form.payerType === "TPA" ? "Star Health TPA" : form.payerType,
      allergies: form.allergies ? [form.allergies] : ["None known"],
      fallRisk: "Low",
      attending: form.attendingDoctor,
      status: "Registered",
      department: form.department,
      registeredAt: "Just now"
    };

    dispatch("REGISTER_PATIENT", { patient: newPatient });
    window.location.hash = `#/triage?uhid=${newPatient.uhid}`;
  };

  return (
    <div className="panel-scroll" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h1 className="font-h1">Patient Intake &amp; Registration</h1>
            <Chip tone="slate" icon="document_scanner">
              OCR Smart Extractor
            </Chip>
            {isErrorState && (
              <Chip tone="plum" icon="error">
                Frame 27: Validation Error View
              </Chip>
            )}
          </div>
          <p className="font-body-sm" style={{ color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
            OCR auto-extract staging with dual-panel verification &amp; deduplication check
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Btn
            variant="secondary"
            onClick={() => {
              if (isErrorState) {
                window.location.hash = "#/registration";
              } else {
                window.location.hash = "#/registration?state=error";
              }
            }}
          >
            {isErrorState ? "Show Valid Form (Frame 05)" : "Preview Errors (Frame 27)"}
          </Btn>
          <Btn variant="secondary" icon="arrow_back" onClick={() => (window.location.hash = "#/queue")}>
            Back to Queue
          </Btn>
        </div>
      </div>

      {/* Split Workspace: Left OCR Scan vs Right Canonical Registry Form */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "380px 1fr",
          gap: "16px",
          minHeight: "calc(100vh - 180px)"
        }}
      >
        {/* Left Side: OCR Document Staging */}
        <div
          className="card"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            background: "var(--color-bg-primary)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="material-symbols-outlined" style={{ color: "var(--color-interactive-primary)" }}>
                description
              </span>
              <span className="font-subtitle-sm">OCR Source Document</span>
            </div>
            <Chip tone="emerald" icon="check_circle">
              {form.ocrConfidence} Match
            </Chip>
          </div>

          <div
            style={{
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border-subtle)",
              background: "var(--color-bg-secondary)",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--color-text-tertiary)" }}>
              <span>SOURCE: CITY LAB PVT LTD</span>
              <span>DATE: 18-OCT-2026</span>
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "12px",
                lineHeight: "1.6",
                background: "var(--color-bg-primary)",
                padding: "10px",
                borderRadius: "var(--radius-sm)",
                border: "1px dashed var(--color-border-subtle)",
                color: "var(--color-text-secondary)"
              }}
            >
              <div>PATIENT: DESHMUKH, KAMALBAI S.</div>
              <div>AGE/SEX: 58 YRS / FEMALE</div>
              <div>REF BY: DR. A. K. JOSHI</div>
              <div style={{ borderTop: "1px solid var(--color-border-subtle)", margin: "6px 0", paddingTop: "4px" }}>
                TEST REPORT:
                <br />
                - HbA1c Glycated: <strong style={{ color: "var(--color-text-primary)" }}>8.6 %</strong> (High)
                <br />
                - Fasting Blood Sugar: <strong style={{ color: "var(--color-text-primary)" }}>184 mg/dL</strong>
                <br />- Post Prandial: <strong>262 mg/dL</strong>
              </div>
              <div style={{ color: "var(--color-clinical-red)", fontSize: "11px", fontWeight: "600" }}>
                ALERT: Known severe Penicillin hypersensitivity
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12px" }}>
              <span style={{ color: "var(--color-text-secondary)" }}>Extracted: 8 Attributes</span>
              <Btn
                size="sm"
                variant={ocrApplied ? "secondary" : "primary"}
                onClick={() => setOcrApplied(!ocrApplied)}
              >
                {ocrApplied ? "Re-Scan Document" : "Apply OCR Values"}
              </Btn>
            </div>
          </div>

          {/* Deduplication Warning Box */}
          <div
            style={{
              padding: "12px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-operational-plum-border)",
              background: "var(--color-operational-plum-bg)",
              display: "flex",
              flexDirection: "column",
              gap: "6px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--color-operational-plum)" }}>
                content_copy
              </span>
              <span className="font-subtitle-sm" style={{ color: "var(--color-operational-plum)" }}>
                Probable Duplicate (91%)
              </span>
            </div>
            <p className="font-body-sm" style={{ margin: 0, color: "var(--color-text-secondary)" }}>
              Patient Kamalbai Patil (UHID-2024-00142, 58F) shares same address &amp; phone.
            </p>
            <div style={{ marginTop: "4px" }}>
              <Btn
                size="sm"
                variant="secondary"
                icon="compare_arrows"
                onClick={() => (window.location.hash = "#/corrections")}
              >
                Review in Duplicate Desk
              </Btn>
            </div>
          </div>
        </div>

        {/* Right Side: Structured Form */}
        <div
          className="card"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            background: "var(--color-bg-primary)"
          }}
        >
          {isErrorState && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                background: "var(--color-operational-plum-bg)",
                border: "1px solid var(--color-operational-plum-border)",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
            >
              <span className="material-symbols-outlined" style={{ color: "var(--color-operational-plum)" }}>
                warning
              </span>
              <div style={{ flex: 1 }}>
                <div className="font-subtitle-sm" style={{ color: "var(--color-operational-plum)" }}>
                  Mandatory Validation Incomplete
                </div>
                <div className="font-body-sm" style={{ color: "var(--color-text-secondary)" }}>
                  Please resolve the highlighted fields before issuing UHID registration card.
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Section 1: Demographics */}
            <div>
              <div
                className="font-subtitle-sm"
                style={{
                  borderBottom: "1px solid var(--color-border-subtle)",
                  paddingBottom: "6px",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                  person
                </span>
                1. Patient Demographics &amp; Contact
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 2fr", gap: "12px" }}>
                <Field
                  label="Full Name (as per Govt ID)"
                  required
                  value={form.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                />
                <Field
                  label="Age"
                  required
                  type="number"
                  value={form.age}
                  onChange={(e) => handleFieldChange("age", e.target.value)}
                />
                <Field
                  label="Gender"
                  required
                  value={form.gender}
                  onChange={(e) => handleFieldChange("gender", e.target.value)}
                />
                <Field
                  label="Primary Mobile Phone"
                  required
                  value={form.phone}
                  error={errors.phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px" }}>
                <Field
                  label="Residential Address"
                  value={form.address}
                  onChange={(e) => handleFieldChange("address", e.target.value)}
                />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <Field
                    label="Guardian / Accompanying Person"
                    value={form.guardianName}
                    error={errors.guardianName}
                    onChange={(e) => handleFieldChange("guardianName", e.target.value)}
                  />
                  <Field
                    label="Relationship"
                    value={form.guardianRelation}
                    onChange={(e) => handleFieldChange("guardianRelation", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: National Health ID & Payer */}
            <div>
              <div
                className="font-subtitle-sm"
                style={{
                  borderBottom: "1px solid var(--color-border-subtle)",
                  paddingBottom: "6px",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                  badge
                </span>
                2. ABHA Digital Health ID &amp; Payer Tier
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1.5fr", gap: "12px" }}>
                <Field
                  label="ABHA Health ID (NDHM)"
                  value={form.abhaId}
                  onChange={(e) => handleFieldChange("abhaId", e.target.value)}
                />
                <Field
                  label="Aadhaar Last 4"
                  value={form.aadhaarLast4}
                  onChange={(e) => handleFieldChange("aadhaarLast4", e.target.value)}
                />
                <Field
                  label="Payer Category"
                  value={form.payerType}
                  onChange={(e) => handleFieldChange("payerType", e.target.value)}
                />
                <Field
                  label="TPA Policy No."
                  value={form.policyNo}
                  error={errors.policyNo}
                  onChange={(e) => handleFieldChange("policyNo", e.target.value)}
                />
              </div>
            </div>

            {/* Section 3: Clinical Flags & Encounter Allocation */}
            <div>
              <div
                className="font-subtitle-sm"
                style={{
                  borderBottom: "1px solid var(--color-border-subtle)",
                  paddingBottom: "6px",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                  clinical_notes
                </span>
                3. Clinical Flags &amp; Triage Assignment
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <Field
                  label="Known Allergies (Flagged in Red)"
                  value={form.allergies}
                  onChange={(e) => handleFieldChange("allergies", e.target.value)}
                />
                <Field
                  label="Target Department"
                  value={form.department}
                  onChange={(e) => handleFieldChange("department", e.target.value)}
                />
                <Field
                  label="Consulting Physician"
                  value={form.attendingDoctor}
                  onChange={(e) => handleFieldChange("attendingDoctor", e.target.value)}
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: "1px solid var(--color-border-subtle)",
                paddingTop: "16px",
                marginTop: "auto"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "var(--color-clinical-emerald)" }}>
                  verified_user
                </span>
                <span className="font-body-sm" style={{ color: "var(--color-text-secondary)" }}>
                  ABHA Consent M1 Verified &amp; Stamped
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Btn type="button" variant="secondary" onClick={() => (window.location.hash = "#/queue")}>
                  Cancel
                </Btn>
                <Btn type="submit" variant="primary" icon="check">
                  Complete Registration &amp; Open Triage
                </Btn>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
