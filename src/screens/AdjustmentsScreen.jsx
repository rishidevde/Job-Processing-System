import { h } from "preact";
import { useState } from "preact/hooks";
import { appState } from "../core/store.js";
import { Chip } from "../kit/Chip.jsx";
import { Btn } from "../kit/Btn.jsx";
import { Field } from "../kit/Field.jsx";
import { dispatch } from "../core/command.js";

export function AdjustmentsScreen() {
  const state = appState.value;

  const [form, setForm] = useState({
    invoiceNo: "INV-2024-8891",
    patientName: "Kamalbai Deshmukh (UHID-2024-00891)",
    adjustmentCode: "ADJ-120",
    adjustmentType: "Senior Citizen Concession (Flat Discount)",
    discountAmount: "100",
    supervisorPin: "",
    justification: "Patient is a 58-year-old senior citizen requesting pharmacy copay relief on chronic maintenance medications."
  });

  const [appliedAdjustments, setAppliedAdjustments] = useState([
    {
      id: "ADJ-119",
      invoiceNo: "INV-2024-8884",
      patient: "Suresh Jadhav",
      amount: "₹250",
      type: "BPL / Ayushman Co-pay Waiver",
      authorizedBy: "Dr. Sandeep (Admin)",
      time: "09:30 AM"
    }
  ]);

  const [error, setError] = useState("");

  const handleApplyAdjustment = (e) => {
    e.preventDefault();
    if (form.supervisorPin !== "4821" && form.supervisorPin !== "1234") {
      setError("Invalid Supervisor Authorization PIN. Authorized PINs: 4821 or 1234.");
      return;
    }

    const newAdj = {
      id: form.adjustmentCode,
      invoiceNo: form.invoiceNo,
      patient: form.patientName,
      amount: `₹${form.discountAmount}`,
      type: form.adjustmentType,
      authorizedBy: "Dr. Sandeep (Admin PIN: Verified)",
      time: "Just now"
    };

    setAppliedAdjustments([newAdj, ...appliedAdjustments]);
    dispatch("APPLY_ADJUSTMENT", {
      invoiceNo: form.invoiceNo,
      discount: parseInt(form.discountAmount) || 100,
      code: form.adjustmentCode,
      justification: form.justification
    });

    setError("");
    window.location.hash = "#/billing";
  };

  return (
    <div className="panel-scroll" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h1 className="font-h1">Billing Adjustments &amp; Concessions Ledger</h1>
            <Chip tone="slate">SCR-19 / Frame 21</Chip>
          </div>
          <p className="font-body-sm" style={{ color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
            Governance-controlled discounts with mandatory supervisor PIN authorization &amp; audit logging
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Btn variant="secondary" icon="arrow_back" onClick={() => (window.location.hash = "#/billing")}>
            Back to Billing
          </Btn>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px" }}>
        {/* Form Card */}
        <div className="card" style={{ background: "var(--color-bg-primary)", display: "flex", flexDirection: "column", gap: "16px" }}>
          <span className="font-subtitle">Issue New Concession / Discount Voucher</span>

          {error && (
            <div
              style={{
                padding: "10px",
                borderRadius: "var(--radius-md)",
                background: "var(--color-operational-plum-bg)",
                border: "1px solid var(--color-operational-plum-border)",
                color: "var(--color-operational-plum)",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                warning
              </span>
              {error}
            </div>
          )}

          <form onSubmit={handleApplyAdjustment} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Field
                label="Target Invoice"
                disabled
                value={form.invoiceNo}
              />
              <Field
                label="Beneficiary Patient"
                disabled
                value={form.patientName}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "12px" }}>
              <div>
                <label className="font-caption" style={{ fontWeight: "600", display: "block", marginBottom: "4px" }}>
                  Concession Category
                </label>
                <select
                  className="input-base"
                  style={{ width: "100%" }}
                  value={form.adjustmentType}
                  onChange={(e) => setForm({ ...form, adjustmentType: e.target.value })}
                >
                  <option value="Senior Citizen Concession (Flat Discount)">
                    Senior Citizen Concession (Flat Discount ₹100)
                  </option>
                  <option value="BPL / Economic Hardship Relief">
                    BPL / Economic Hardship Relief
                  </option>
                  <option value="Hospital Employee Welfare Scheme">
                    Hospital Employee Welfare Scheme
                  </option>
                  <option value="Service Discrepancy Good-will Credit">
                    Service Discrepancy Good-will Credit
                  </option>
                </select>
              </div>

              <Field
                label="Discount Amount (₹)"
                required
                type="number"
                value={form.discountAmount}
                onChange={(e) => setForm({ ...form, discountAmount: e.target.value })}
              />
            </div>

            <Field
              label="Mandatory Supervisor PIN (Hint: 4821)"
              required
              type="password"
              placeholder="Enter 4-digit administrative signoff PIN"
              value={form.supervisorPin}
              onChange={(e) => setForm({ ...form, supervisorPin: e.target.value })}
            />

            <div>
              <label className="font-caption" style={{ fontWeight: "600", display: "block", marginBottom: "4px" }}>
                Audit Justification Note
              </label>
              <textarea
                className="input-base"
                rows={2}
                style={{ width: "100%", resize: "vertical" }}
                value={form.justification}
                onInput={(e) => setForm({ ...form, justification: e.target.value })}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "6px" }}>
              <Btn type="submit" variant="primary" icon="check">
                Authorize &amp; Apply ADJ-120
              </Btn>
            </div>
          </form>
        </div>

        {/* Adjustments Log */}
        <div className="card" style={{ background: "var(--color-bg-primary)", display: "flex", flexDirection: "column", gap: "12px" }}>
          <span className="font-subtitle">Audit Verified Adjustments Today</span>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {appliedAdjustments.map((adj) => (
              <div
                key={adj.id}
                style={{
                  padding: "10px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border-subtle)",
                  background: "var(--color-bg-secondary)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: "600" }}>{adj.id} &bull; {adj.patient}</span>
                  <span style={{ fontWeight: "700", color: "var(--color-operational-plum)" }}>{adj.amount}</span>
                </div>
                <div className="font-caption" style={{ color: "var(--color-text-secondary)" }}>
                  {adj.type} &bull; Authorized by: <strong>{adj.authorizedBy}</strong>
                </div>
                <div className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>
                  Invoice: {adj.invoiceNo} &bull; Stamped: {adj.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
