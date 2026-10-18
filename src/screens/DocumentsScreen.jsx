import { h } from "preact";
import { useState } from "preact/hooks";
import { appState } from "../core/store.js";
import { currentRoute } from "../core/router.js";
import { Chip } from "../kit/Chip.jsx";
import { Btn } from "../kit/Btn.jsx";
import { dispatch } from "../core/command.js";

export function DocumentsScreen() {
  const state = appState.value;
  const isPendingCallout = currentRoute.value.query.state === "pending" || currentRoute.value.query.frame === "38";

  const [packageItems, setPackageItems] = useState([
    { id: "DOC-1", name: "OPD Consultation & Clinical Summary (Dr. Rajesh Rao)", pages: 2, status: "Ready", included: true },
    { id: "DOC-2", name: "Official Electronic Prescription (Rx-7710)", pages: 1, status: "Ready", included: true },
    { id: "DOC-3", name: "Diagnostic Laboratory Certificate (Electrolytes & Renal Panel)", pages: 1, status: isPendingCallout ? "Pending Verification" : "Ready", included: true },
    { id: "DOC-4", name: "Itemized Multi-Payer Split Tax Invoice (INV-2024-8891)", pages: 1, status: "Ready", included: true },
    { id: "DOC-5", name: "Diabetic Foot Care & Lifestyle Guidance Leaflet (Marathi & English)", pages: 2, status: "Ready", included: true }
  ]);

  const [packageVersion, setPackageVersion] = useState("v1.2 (Signed)");

  const handleAssemblePackage = () => {
    dispatch("ASSEMBLE_DOCUMENT_PACKAGE", {
      uhid: "UHID-2024-00891",
      packageId: "PKG-8812",
      version: packageVersion,
      items: packageItems.filter((i) => i.included)
    });
    window.location.hash = "#/delivery";
  };

  return (
    <div className="panel-scroll" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h1 className="font-h1">Clinical Document &amp; Discharge Package Builder</h1>
            <Chip tone="slate">PKG-8812 &bull; {packageVersion}</Chip>
            {isPendingCallout && <Chip tone="plum">Frame 38: Pending Results Notice Callout</Chip>}
          </div>
          <p className="font-body-sm" style={{ color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
            Multi-source clinical record collation with cryptographic digital seal (SCR-12 / Frames 14, 38)
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Btn
            variant="secondary"
            onClick={() => {
              if (isPendingCallout) {
                window.location.hash = "#/documents";
              } else {
                window.location.hash = "#/documents?frame=38";
              }
            }}
          >
            {isPendingCallout ? "Show Standard Ready (Frame 14)" : "Simulate Pending Callout (Frame 38)"}
          </Btn>
          <Btn variant="primary" icon="inventory_2" onClick={handleAssemblePackage}>
            Seal Package &amp; Send to Delivery Center
          </Btn>
        </div>
      </div>

      {/* Frame 38: Pending Notice Callout */}
      {isPendingCallout && (
        <div
          style={{
            padding: "12px 16px",
            background: "var(--color-operational-plum-bg)",
            border: "1px solid var(--color-operational-plum-border)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span className="material-symbols-outlined" style={{ color: "var(--color-operational-plum)", fontSize: "24px" }}>
              pending_actions
            </span>
            <div>
              <div style={{ fontWeight: "600", color: "var(--color-operational-plum)", fontSize: "14px" }}>
                Provisional Package Notice: 1 Investigation In-Flight
              </div>
              <div className="font-body-sm" style={{ color: "var(--color-text-secondary)" }}>
                Serum Potassium repeat confirmatory run is currently in progress at central analyzer. If delivered now,
                the package will be stamped as "INTERIM / PRELIMINARY" with automatic digital update upon final authorization.
              </div>
            </div>
          </div>
          <Btn size="sm" variant="secondary" onClick={() => (window.location.hash = "#/lab")}>
            Check LIS Accession
          </Btn>
        </div>
      )}

      {/* Split Layout: Left Collation Checklist, Right PDF Preview */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.3fr", gap: "16px" }}>
        {/* Left: Component Checklist */}
        <div className="card" style={{ background: "var(--color-bg-primary)", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="font-subtitle">Collation Items</span>
            <span className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>5 Total Components</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {packageItems.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  padding: "12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border-subtle)",
                  background: item.included ? "var(--color-bg-primary)" : "var(--color-bg-secondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="checkbox"
                    checked={item.included}
                    onChange={(e) => {
                      const next = [...packageItems];
                      next[idx].included = e.target.checked;
                      setPackageItems(next);
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "13px" }}>{item.name}</div>
                    <div className="font-caption" style={{ color: "var(--color-text-secondary)" }}>
                      {item.id} &bull; {item.pages} {item.pages > 1 ? "Pages" : "Page"}
                    </div>
                  </div>
                </div>

                <Chip tone={item.status === "Ready" ? "emerald" : "plum"}>
                  {item.status}
                </Chip>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "auto",
              padding: "12px",
              background: "var(--color-bg-secondary)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <div className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>DIGITAL SIGNATURE</div>
              <div style={{ fontWeight: "600", fontSize: "12px" }}>Dr. Rajesh Rao (Reg #MMC-2011-098)</div>
            </div>
            <Chip tone="emerald" icon="verified">
              Aadhaar eSign Verified
            </Chip>
          </div>
        </div>

        {/* Right: Realistic Simulated A4 PDF Document Preview */}
        <div
          className="card"
          style={{
            background: "#ffffff",
            color: "#1e293b",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            border: "1px solid #e2e8f0",
            minHeight: "520px"
          }}
        >
          {/* Clinic Header */}
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #0f172a", paddingBottom: "12px" }}>
            <div>
              <div style={{ fontSize: "18px", fontWeight: "800", letterSpacing: "0.5px", color: "#0f172a" }}>
                SAMRUDDHI SUPER-SPECIALTY HOSPITAL
              </div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                NABH Accredited Tertiary Center &bull; Station Road, Kolhapur 416001 &bull; Tel: +91 231 268 9000
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#0284c7" }}>OPD DISCHARGE SUMMARY</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>PKG-8812 &bull; 18-Oct-2026</div>
            </div>
          </div>

          {/* Patient Details Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr 1fr",
              gap: "8px",
              background: "#f8fafc",
              padding: "10px",
              borderRadius: "4px",
              fontSize: "12px"
            }}
          >
            <div>Patient: <strong>Kamalbai Deshmukh</strong> (58F)</div>
            <div>UHID: <strong>UHID-2024-00891</strong></div>
            <div>ABHA: <strong>91-4432-8891-2011</strong></div>
            <div>Attending: <strong>Dr. Rajesh Rao (MD)</strong></div>
            <div>Payer: <strong>Star Health TPA</strong></div>
            <div>Allergy: <strong style={{ color: "#dc2626" }}>Penicillin (Severe)</strong></div>
          </div>

          {/* Clinical Synopsis */}
          <div style={{ fontSize: "12px", lineHeight: "1.6", color: "#334155" }}>
            <strong>Diagnosis:</strong> Type 2 Diabetes Mellitus (Uncontrolled, HbA1c 8.6%), Peripheral Neuropathy, Grade 1 Right Heel Blister, Stage 1 HTN.
            <br />
            <strong>Medications Prescribed:</strong>
            <ul style={{ margin: "4px 0 8px 18px", padding: 0 }}>
              <li>Tab. Metformin ER 500 mg &bull; 1-0-1 after meals (30 days)</li>
              <li>Tab. Gliclazide MR 80 mg &bull; 1-0-0 morning before breakfast (30 days)</li>
              <li>Tab. Telmisartan 40 mg &bull; 0-1-0 afternoon (30 days)</li>
            </ul>
            <strong>Investigations:</strong> Serum Potassium: 6.8 mEq/L (Critical - Handled via closed loop), Creatinine: 2.1 mg/dL.
          </div>

          {/* Footer & QR Stamp */}
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              borderTop: "1px solid #e2e8f0",
              paddingTop: "12px",
              fontSize: "11px",
              color: "#64748b"
            }}
          >
            <div>
              <div>Digital Stamp: SHA-256: 88f912c401bb72a</div>
              <div>Certified by DocCare Clinical Suite 3.1</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: "700", color: "#0f172a" }}>Dr. Rajesh Rao, MD</div>
              <div>Consultant Diabetologist</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
