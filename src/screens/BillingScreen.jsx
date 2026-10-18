import { h } from "preact";
import { useState } from "preact/hooks";
import { appState, activeBlockingInterlock } from "../core/store.js";
import { currentRoute } from "../core/router.js";
import { Chip, PayerPill } from "../kit/Chip.jsx";
import { Btn } from "../kit/Btn.jsx";
import { Modal } from "../kit/Modal.jsx";
import { dispatch } from "../core/command.js";

export function BillingScreen() {
  const state = appState.value;
  const isTimeoutBranch = currentRoute.value.query.branch === "timeout" || currentRoute.value.query.frame === "13";
  const isReconciledBranch = currentRoute.value.query.branch === "reconciled" || currentRoute.value.query.frame === "31";

  const [timeoutModalOpen, setTimeoutModalOpen] = useState(isTimeoutBranch);
  const [reconciledModalOpen, setReconciledModalOpen] = useState(isReconciledBranch);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState("UPI / Dynamic QR");
  const [cashTendered, setCashTendered] = useState("500");

  const [invoice, setInvoice] = useState({
    invoiceNo: "INV-2024-8891",
    patientName: "Mrs. Kamalbai Deshmukh",
    uhid: "884021",
    encounterId: "OPD-8843",
    treatingDoctor: "Dr. Rajesh Rao",
    payer: "Star Health Insurance",
    policyNo: "SHI-TPA-992019-2024",
    items: [
      {
        category: "Consultation",
        desc: "OPD Specialist Consultation - Dr. Rajesh Rao",
        code: "CON-01",
        qty: 1,
        rate: 600,
        tpaShare: 500,
        patientShare: 100,
        status: "Approved"
      },
      {
        category: "Laboratory",
        desc: "Serum Electrolytes & Creatinine Profile",
        code: "LAB-ELEC",
        qty: 1,
        rate: 950,
        tpaShare: 950,
        patientShare: 0,
        status: "100% Cashless"
      },
      {
        category: "Pharmacy",
        desc: "OPD Pharmacy Dispense (Rx-7710 Metformin, Gliclazide)",
        code: "PHARM-OPD",
        qty: 1,
        rate: 800,
        tpaShare: 600,
        patientShare: 200,
        status: "Co-pay 25%"
      },
      {
        category: "Procedure",
        desc: "Diabetic Foot Dressing & Ulcer Debridement (Grade 1)",
        code: "PROC-WND",
        qty: 1,
        rate: 450,
        tpaShare: 400,
        patientShare: 50,
        status: "Approved"
      }
    ],
    tpaApprovedTotal: 2450,
    patientCopayTotal: 350,
    grandTotal: 2800,
    status: isReconciledBranch ? "Paid & Reconciled" : isTimeoutBranch ? "Payment Pending" : "Generated"
  });

  const handleSimulateTimeout = () => {
    setPaymentModalOpen(false);
    activeBlockingInterlock.value = "PAYMENT_TIMEOUT";
    setTimeoutModalOpen(true);
  };

  const handleManualReconcile = () => {
    activeBlockingInterlock.value = null;
    setTimeoutModalOpen(false);
    setPaymentModalOpen(false);
    dispatch("RECONCILE_PAYMENT", {
      invoiceNo: invoice.invoiceNo,
      uhid: invoice.uhid,
      utr: "UTR-8819203991",
      amount: invoice.patientCopayTotal
    });
    setInvoice((prev) => ({ ...prev, status: "Paid & Reconciled" }));
    setReconciledModalOpen(true);
  };

  return (
    <div className="panel-scroll" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* 1. Header with Clean Non-Cramped Layout */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          borderBottom: "1px solid var(--color-border-subtle)",
          paddingBottom: "12px"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <h1 className="font-h1" style={{ fontSize: "20px", margin: 0, whiteSpace: "nowrap" }}>
              Cashier Billing &amp; Multi-Payer Split Settlement
            </h1>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "3px 10px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: 600,
                backgroundColor: "#EFF6FF",
                color: "#1E40AF",
                border: "1px solid #BFDBFE",
                whiteSpace: "nowrap"
              }}
            >
              Star Health Insurance (TPA)
            </span>
            <Chip tone="slate">{invoice.invoiceNo}</Chip>
            {isTimeoutBranch && <Chip tone="plum">Frame 13: Gateway Timeout</Chip>}
            {isReconciledBranch && <Chip tone="emerald">Frame 31: Reconciled</Chip>}
          </div>
          <p className="font-body-sm" style={{ color: "var(--color-text-secondary)", margin: 0 }}>
            Real-time cashless pre-auth split &amp; electronic payment reconciliation desk (SCR-11 / Frames 12, 13, 31)
          </p>
        </div>

        {/* Right Header Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          {/* Branch Preview Toggles */}
          <div style={{ display: "flex", background: "var(--color-bg-secondary)", borderRadius: "6px", padding: "2px", border: "1px solid var(--color-border-subtle)" }}>
            <button
              type="button"
              className="btn btn-text"
              style={{ height: "28px", fontSize: "11px", padding: "0 8px", color: "var(--color-text-secondary)" }}
              onClick={() => {
                window.location.hash = "#/billing?branch=timeout";
                setTimeoutModalOpen(true);
              }}
              title="Simulate Payment Gateway Timeout (Frame 13)"
            >
              Timeout (F-13)
            </button>
            <button
              type="button"
              className="btn btn-text"
              style={{ height: "28px", fontSize: "11px", padding: "0 8px", color: "var(--color-clinical-emerald)" }}
              onClick={() => {
                window.location.hash = "#/billing?branch=reconciled";
                setReconciledModalOpen(true);
              }}
              title="Preview Settle & Reconcile (Frame 31)"
            >
              Reconciled (F-31)
            </button>
          </div>

          <Btn
            variant="secondary"
            icon="sell"
            onClick={() => (window.location.hash = "#/adjustments")}
            style={{ height: "34px", fontSize: "12px" }}
          >
            Apply Concession (ADJ-120)
          </Btn>

          <Btn
            variant="primary"
            icon="payments"
            onClick={() => setPaymentModalOpen(true)}
            style={{ height: "34px", fontSize: "12px", fontWeight: 600 }}
          >
            Collect Copay (₹{invoice.patientCopayTotal})
          </Btn>
        </div>
      </div>

      {/* 2. Patient & Pre-Auth Information Ribbon */}
      <div
        className="card"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          background: "var(--color-bg-primary)",
          borderRadius: "8px",
          border: "1px solid var(--color-border-subtle)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "var(--color-primary-100)",
              color: "var(--color-interactive-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "14px"
            }}
          >
            KD
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontWeight: 700, fontSize: "14px", color: "var(--color-text-primary)" }}>
                {invoice.patientName}
              </span>
              <Chip tone="slate">58Y / Female</Chip>
              <span className="font-mono-sm" style={{ color: "var(--color-text-secondary)" }}>
                UHID: {invoice.uhid}
              </span>
              <span className="font-mono-sm" style={{ color: "var(--color-text-secondary)" }}>
                Encounter: {invoice.encounterId}
              </span>
            </div>
            <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", marginTop: "2px" }}>
              Consultant: <strong>{invoice.treatingDoctor}</strong> &bull; Policy No: <strong>{invoice.policyNo}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", textTransform: "uppercase", fontWeight: 600 }}>
              Pre-Auth Clearance
            </div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-clinical-emerald)" }}>
              ₹2,450 Approved (87.5%)
            </div>
          </div>
          <span className="material-symbols-outlined" style={{ color: "var(--color-clinical-emerald)", fontSize: "28px" }}>
            verified_user
          </span>
        </div>
      </div>

      {/* 3. Split Summary Cards (KPI Cards) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
        {/* Card 1: TPA Share */}
        <div
          className="card"
          style={{
            padding: "16px 18px",
            background: "var(--color-bg-primary)",
            borderRadius: "8px",
            border: "1px solid var(--color-border-subtle)",
            borderLeft: "4px solid var(--color-interactive-primary)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "var(--color-text-tertiary)", textTransform: "uppercase" }}>
              TPA / Insurance Share
            </span>
            <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "var(--color-interactive-primary)" }}>
              health_and_safety
            </span>
          </div>
          <div className="font-h1" style={{ fontSize: "26px", color: "var(--color-interactive-primary)", margin: "8px 0 4px" }}>
            ₹{invoice.tpaApprovedTotal.toLocaleString()}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--color-clinical-emerald)", fontWeight: 500 }}>
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>check_circle</span>
            Direct Cashless Pre-Auth Approved (87.5%)
          </div>
        </div>

        {/* Card 2: Patient Copay */}
        <div
          className="card"
          style={{
            padding: "16px 18px",
            background: "var(--color-bg-primary)",
            borderRadius: "8px",
            border: "1px solid var(--color-border-subtle)",
            borderLeft: "4px solid var(--color-operational-plum)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "var(--color-text-tertiary)", textTransform: "uppercase" }}>
              Patient Copay (Out-Of-Pocket)
            </span>
            <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "var(--color-operational-plum)" }}>
              account_balance_wallet
            </span>
          </div>
          <div className="font-h1" style={{ fontSize: "26px", color: "var(--color-operational-plum)", margin: "8px 0 4px" }}>
            ₹{invoice.patientCopayTotal.toLocaleString()}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--color-text-secondary)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>qr_code_2</span>
            Payable via UPI / Cash / POS Card (12.5%)
          </div>
        </div>

        {/* Card 3: Total Invoice Value */}
        <div
          className="card"
          style={{
            padding: "16px 18px",
            background: "var(--color-bg-primary)",
            borderRadius: "8px",
            border: "1px solid var(--color-border-subtle)",
            borderLeft: "4px solid var(--color-border-strong)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "var(--color-text-tertiary)", textTransform: "uppercase" }}>
              Total Invoice Value
            </span>
            <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "var(--color-text-secondary)" }}>
              receipt_long
            </span>
          </div>
          <div className="font-h1" style={{ fontSize: "26px", color: "var(--color-text-primary)", margin: "8px 0 4px" }}>
            ₹{invoice.grandTotal.toLocaleString()}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--color-text-secondary)" }}>
            Status: <strong style={{ color: invoice.status === "Paid & Reconciled" ? "var(--color-clinical-emerald)" : "var(--color-interactive-primary)" }}>{invoice.status}</strong>
          </div>
        </div>
      </div>

      {/* 4. Itemized Split Table */}
      <div
        className="card"
        style={{
          background: "var(--color-bg-primary)",
          borderRadius: "8px",
          border: "1px solid var(--color-border-subtle)",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid var(--color-border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontWeight: 700, fontSize: "14px" }}>
              Itemized Breakdown &amp; Payer Responsibility Ledger
            </span>
            <Chip tone="slate">4 Billable Items</Chip>
          </div>
          <span style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
            Tariff Standard: <strong>CGHS / NABH Rule Matrix</strong>
          </span>
        </div>

        <table className="table-base" style={{ margin: 0 }}>
          <thead>
            <tr style={{ background: "var(--color-bg-secondary)" }}>
              <th style={{ padding: "10px 16px", fontSize: "12px" }}>Service / Item Description</th>
              <th style={{ padding: "10px 16px", fontSize: "12px" }}>Category</th>
              <th style={{ padding: "10px 16px", fontSize: "12px" }}>Tariff Code</th>
              <th style={{ padding: "10px 16px", fontSize: "12px", textAlign: "center" }}>Qty</th>
              <th style={{ padding: "10px 16px", fontSize: "12px", textAlign: "right" }}>Gross Amount</th>
              <th style={{ padding: "10px 16px", fontSize: "12px", textAlign: "right" }}>TPA Borne</th>
              <th style={{ padding: "10px 16px", fontSize: "12px", textAlign: "right" }}>Patient Copay</th>
              <th style={{ padding: "10px 16px", fontSize: "12px", textAlign: "center" }}>Pre-Auth Rule</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
                <td style={{ padding: "12px 16px" }}>
                  <strong style={{ fontSize: "13px" }}>{item.desc}</strong>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: 600,
                      background: "var(--color-bg-secondary)",
                      color: "var(--color-text-secondary)",
                      border: "1px solid var(--color-border-subtle)"
                    }}
                  >
                    {item.category}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span className="font-mono-sm" style={{ color: "var(--color-text-muted)" }}>{item.code}</span>
                </td>
                <td style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600 }}>{item.qty}</td>
                <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600 }}>₹{item.rate}</td>
                <td style={{ padding: "12px 16px", textAlign: "right", color: "var(--color-interactive-primary)", fontWeight: 700 }}>
                  ₹{item.tpaShare}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "right", color: "var(--color-operational-plum)", fontWeight: 700 }}>
                  ₹{item.patientShare}
                </td>
                <td style={{ padding: "12px 16px", textAlign: "center" }}>
                  <Chip tone={item.patientShare === 0 ? "emerald" : "slate"}>
                    {item.status}
                  </Chip>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: "var(--color-bg-secondary)", borderTop: "2px solid var(--color-border)" }}>
              <td colSpan={4} style={{ padding: "14px 16px", fontWeight: 700, fontSize: "13px" }}>
                Consolidated Net Payable
              </td>
              <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 800, fontSize: "14px" }}>
                ₹{invoice.grandTotal}
              </td>
              <td style={{ padding: "14px 16px", textAlign: "right", color: "var(--color-interactive-primary)", fontWeight: 800, fontSize: "14px" }}>
                ₹{invoice.tpaApprovedTotal}
              </td>
              <td style={{ padding: "14px 16px", textAlign: "right", color: "var(--color-operational-plum)", fontWeight: 800, fontSize: "14px" }}>
                ₹{invoice.patientCopayTotal}
              </td>
              <td style={{ padding: "14px 16px", textAlign: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--color-clinical-emerald)" }}>
                  Split Balanced
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* 5. Payment Modal (Unified Copay Collection) */}
      {paymentModalOpen && (
        <Modal
          title={`Collect Patient Copay: ₹${invoice.patientCopayTotal}`}
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          actions={
            <div style={{ display: "flex", gap: "10px", width: "100%", justifyContent: "space-between" }}>
              <Btn
                variant="secondary"
                onClick={() => setPaymentModalOpen(false)}
              >
                Cancel
              </Btn>
              <div style={{ display: "flex", gap: "8px" }}>
                <Btn
                  variant="secondary"
                  onClick={handleSimulateTimeout}
                >
                  Simulate Gateway Timeout (F-13)
                </Btn>
                <Btn
                  variant="primary"
                  icon="check"
                  onClick={handleManualReconcile}
                >
                  Confirm &amp; Settle Ledger (₹{invoice.patientCopayTotal})
                </Btn>
              </div>
            </div>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Payment Method Selector */}
            <div style={{ display: "flex", gap: "8px" }}>
              {["UPI / Dynamic QR", "Cash Counter", "POS Card Terminal"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPaymentMode(mode)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "6px",
                    border: paymentMode === mode ? "2px solid var(--color-interactive-primary)" : "1px solid var(--color-border)",
                    background: paymentMode === mode ? "var(--color-primary-100)" : "transparent",
                    color: paymentMode === mode ? "var(--color-interactive-primary)" : "var(--color-text-primary)",
                    fontWeight: paymentMode === mode ? 700 : 500,
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                    {mode.startsWith("UPI") ? "qr_code_2" : mode.startsWith("Cash") ? "payments" : "credit_card"}
                  </span>
                  {mode}
                </button>
              ))}
            </div>

            {/* Mode-Specific Panel */}
            {paymentMode === "UPI / Dynamic QR" ? (
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                  padding: "16px",
                  background: "var(--color-bg-secondary)",
                  borderRadius: "8px"
                }}
              >
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    background: "#FFF",
                    borderRadius: "8px",
                    padding: "8px",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "84px", color: "#1E293B" }}>
                    qr_code_2
                  </span>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "var(--color-interactive-primary)" }}>
                    Scan &amp; Pay ₹350
                  </div>
                </div>
                <div style={{ flex: 1, fontSize: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div>Merchant: <strong>Samruddhi Hospital Central Cashier Desk</strong></div>
                  <div>VPA: <strong>samruddhi.cashier@hdfcbank</strong></div>
                  <div>Invoice Ref: <strong>{invoice.invoiceNo}</strong></div>
                  <div>Amount: <strong style={{ fontSize: "16px", color: "var(--color-operational-plum)" }}>₹350.00</strong></div>
                  <div style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>
                    Supported: Google Pay, PhonePe, Paytm, BHIM UPI
                  </div>
                </div>
              </div>
            ) : paymentMode === "Cash Counter" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "16px", background: "var(--color-bg-secondary)", borderRadius: "8px" }}>
                <div>Total Due: <strong>₹350.00</strong></div>
                <div className="field-group">
                  <label className="field-label">Cash Tendered (₹)</label>
                  <input
                    type="number"
                    className="field-input"
                    value={cashTendered}
                    onInput={(e) => setCashTendered(e.target.value)}
                  />
                </div>
                <div style={{ fontSize: "13px", color: "var(--color-clinical-emerald)", fontWeight: 700 }}>
                  Change to Return: ₹{Math.max(0, (parseFloat(cashTendered) || 0) - 350)}
                </div>
              </div>
            ) : (
              <div style={{ padding: "16px", background: "var(--color-bg-secondary)", borderRadius: "8px", fontSize: "12px" }}>
                <div>Terminal: <strong>HDFC POS Desk 02</strong></div>
                <div>Swipe / Insert / Tap patient debit or credit card for <strong>₹350.00</strong>.</div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Frame 13: Gateway Timeout Branch 1 Modal */}
      {timeoutModalOpen && (
        <Modal
          title="Payment Gateway Status: Transaction Pending (Frame 13)"
          open={timeoutModalOpen}
          isBlocking={true}
          actions={
            <div style={{ display: "flex", gap: "10px" }}>
              <Btn
                variant="secondary"
                onClick={() => {
                  activeBlockingInterlock.value = null;
                  setTimeoutModalOpen(false);
                }}
              >
                Cancel &amp; Select Different Method
              </Btn>
              <Btn
                variant="primary"
                icon="sync"
                onClick={handleManualReconcile}
              >
                Re-Query UTR &amp; Settle Ledger
              </Btn>
            </div>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div
              style={{
                padding: "12px",
                background: "var(--color-operational-plum-bg)",
                border: "1px solid var(--color-operational-plum-border)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                gap: "10px"
              }}
            >
              <span className="material-symbols-outlined" style={{ color: "var(--color-operational-plum)" }}>
                hourglass_top
              </span>
              <div style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
                <strong style={{ color: "var(--color-operational-plum)" }}>Gateway Response Awaited:</strong> The
                UPI aggregator has not returned an instant HTTP 200 confirmation. Banking settlement window is 60
                seconds. Do not issue final discharge clearance until transaction is confirmed or reconciled.
              </div>
            </div>

            <div
              style={{
                padding: "12px",
                borderRadius: "var(--radius-md)",
                background: "var(--color-bg-secondary)",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                fontSize: "12px"
              }}
            >
              <div>Reference Ref: <strong>UPI-PG-88192</strong></div>
              <div>Amount: <strong>₹{invoice.patientCopayTotal}.00</strong></div>
              <div>Payer VPA: <strong>kamalbai@okaxis</strong></div>
              <div>Elapsed Time: <strong>48 seconds</strong></div>
            </div>
          </div>
        </Modal>
      )}

      {/* Frame 31: Reconciled Branch 2 Modal */}
      {reconciledModalOpen && (
        <Modal
          title="Settlement Complete: Invoice Zero-Balanced (Frame 31)"
          open={reconciledModalOpen}
          onClose={() => setReconciledModalOpen(false)}
          actions={
            <div style={{ display: "flex", gap: "10px" }}>
              <Btn variant="secondary" icon="print" onClick={() => window.print()}>
                Print Dual-Channel Tax Receipt
              </Btn>
              <Btn
                variant="primary"
                icon="arrow_forward"
                onClick={() => {
                  setReconciledModalOpen(false);
                  window.location.hash = "#/documents";
                }}
              >
                Proceed to Document Assembly (Frame 14)
              </Btn>
            </div>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div
              style={{
                padding: "12px",
                background: "var(--color-emerald-50)",
                border: "1px solid var(--color-clinical-emerald)",
                borderRadius: "var(--radius-md)",
                display: "flex",
                gap: "10px"
              }}
            >
              <span className="material-symbols-outlined" style={{ color: "var(--color-clinical-emerald)" }}>
                check_circle
              </span>
              <div style={{ fontSize: "12px", color: "var(--color-emerald-700)" }}>
                <strong>Reconciliation Verified:</strong> Transaction UTR-8819203991 confirmed by HDFC Merchant
                Switch. Patient copay ₹350.00 credited. Outstanding balance: ₹0.00.
              </div>
            </div>

            <div style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>
              Discharge billing clearance token issued. Digital receipts are ready for WhatsApp and ABHA Health Locker
              transmission.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
