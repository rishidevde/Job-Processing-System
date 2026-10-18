import { h } from "preact";
import { useState } from "preact/hooks";
import { appState } from "../core/store.js";
import { currentRoute } from "../core/router.js";
import { Chip } from "../kit/Chip.jsx";
import { Btn } from "../kit/Btn.jsx";
import { DataTable } from "../kit/DataTable.jsx";
import { Modal } from "../kit/Modal.jsx";
import { dispatch } from "../core/command.js";

export function PharmacyScreen() {
  const state = appState.value;
  const isDispenseQuery = currentRoute.value.query.dispense === "true" || currentRoute.value.query.frame === "30";

  const rawRx = state.prescriptions || {};
  const rxList = (Array.isArray(rawRx) ? rawRx : Object.values(rawRx)).map((r) => ({
    ...r,
    rxId: r.id || r.rxId || "RX-7710",
    patientName: r.patientName || (state.patients && state.patients[r.uhid]?.name) || "Mrs. Kamalbai Deshmukh",
    doctor: r.doctor || "Dr. R. Rao",
    items: (r.items || []).map((it) => ({
      ...it,
      drug: it.drug || it.medicine || "Telmisartan",
      dose: it.dose || "40 mg",
      status: it.status || "Available"
    })),
    status: r.status || "Transmitted"
  }));

  const [dispenseModalOpen, setDispenseModalOpen] = useState(isDispenseQuery);
  const [selectedRx, setSelectedRx] = useState(rxList[0] || null);

  const [dispenseChecklist, setDispenseChecklist] = useState({
    patientIdentityVerified: true,
    allergiesChecked: true,
    batchFefoVerified: true,
    counselingCompleted: false
  });

  const [selectedBatch, setSelectedBatch] = useState("TL3890 (Exp: 12/2026)");

  const handleConfirmDispense = () => {
    dispatch("DISPENSE_PRESCRIPTION", {
      rxId: selectedRx ? selectedRx.rxId : "RX-7710",
      uhid: selectedRx ? selectedRx.uhid : "UHID-2024-00891",
      batch: selectedBatch
    });
    setDispenseModalOpen(false);
  };

  const columns = [
    {
      key: "rxId",
      header: "Rx Number",
      render: (val) => <span className="font-mono-sm">{val}</span>
    },
    {
      key: "patientName",
      header: "Patient",
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: "600", fontSize: "13px" }}>{val}</div>
          <div className="font-caption" style={{ color: "var(--color-text-secondary)" }}>
            {row.uhid}
          </div>
        </div>
      )
    },
    {
      key: "doctor",
      header: "Prescribing Physician",
      render: (val) => val
    },
    {
      key: "items",
      header: "Prescribed Items",
      render: (val) => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {val.map((item, idx) => (
            <Chip key={idx} tone={item.status === "Substituted" ? "plum" : "slate"}>
              {item.drug} ({item.dose})
            </Chip>
          ))}
        </div>
      )
    },
    {
      key: "status",
      header: "Dispense State",
      render: (val) => {
        const toneMap = {
          Transmitted: "amber",
          Clarification: "plum",
          Dispensed: "emerald"
        };
        return <Chip tone={toneMap[val] || "slate"}>{val}</Chip>;
      }
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, row) => (
        <div style={{ display: "flex", gap: "6px" }}>
          <Btn
            size="sm"
            variant="primary"
            onClick={() => {
              setSelectedRx(row);
              setDispenseModalOpen(true);
            }}
          >
            FEFO Dispense (Frame 30)
          </Btn>
          <Btn
            size="sm"
            variant="secondary"
            onClick={() => (window.location.hash = "#/clarifications")}
          >
            Clarification
          </Btn>
        </div>
      )
    }
  ];

  return (
    <div className="panel-scroll" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h1 className="font-h1">OPD Pharmacy Dispensing &amp; FEFO Inventory</h1>
            <Chip tone="slate">OPD Central Dispensary</Chip>
            {isDispenseQuery && <Chip tone="emerald">Frame 30: Barcode Verification</Chip>}
          </div>
          <p className="font-body-sm" style={{ color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
            First-Expiry First-Out (FEFO) automated lot allocation &amp; double-check barcode verification
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Btn
            variant="secondary"
            onClick={() => {
              if (isDispenseQuery) {
                window.location.hash = "#/pharmacy";
                setDispenseModalOpen(false);
              } else {
                window.location.hash = "#/pharmacy?frame=30";
                setDispenseModalOpen(true);
              }
            }}
          >
            {isDispenseQuery ? "Show Queue (Frame 11)" : "Simulate Dispense Modal (Frame 30)"}
          </Btn>
          <Btn variant="secondary" icon="inventory_2" onClick={() => (window.location.hash = "#/clarifications")}>
            Prescriber Clarifications Desk
          </Btn>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
        <div className="card" style={{ padding: "12px", background: "var(--color-bg-primary)" }}>
          <div className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>PENDING DISPENSE</div>
          <div className="font-h2" style={{ color: "var(--color-interactive-primary)", marginTop: "4px" }}>
            {rxList.filter((p) => p.status === "Transmitted" || p.status === "Signed").length}
          </div>
        </div>
        <div className="card" style={{ padding: "12px", background: "var(--color-bg-primary)" }}>
          <div className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>ACTIVE CLARIFICATIONS</div>
          <div className="font-h2" style={{ color: "var(--color-operational-plum)", marginTop: "4px" }}>
            1
          </div>
        </div>
        <div className="card" style={{ padding: "12px", background: "var(--color-bg-primary)" }}>
          <div className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>DISPENSED TODAY</div>
          <div className="font-h2" style={{ color: "var(--color-clinical-emerald)", marginTop: "4px" }}>
            48
          </div>
        </div>
        <div className="card" style={{ padding: "12px", background: "var(--color-bg-primary)" }}>
          <div className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>FEFO COMPLIANCE</div>
          <div className="font-h2" style={{ color: "var(--color-interactive-primary)", marginTop: "4px" }}>
            99.2%
          </div>
        </div>
      </div>

      {/* Prescriptions Queue */}
      <DataTable
        columns={columns}
        data={rxList}
        emptyMessage="No pending prescriptions in pharmacy queue."
      />

      {/* Frame 30: Dispensing & FEFO Verification Modal */}
      {dispenseModalOpen && (
        <Modal
          title="FEFO Dispensing &amp; Patient Safety Double-Check (Frame 30)"
          open={dispenseModalOpen}
          onClose={() => setDispenseModalOpen(false)}
          actions={
            <div style={{ display: "flex", gap: "10px" }}>
              <Btn variant="secondary" onClick={() => setDispenseModalOpen(false)}>
                Hold Order
              </Btn>
              <Btn
                variant="primary"
                icon="verified"
                disabled={!dispenseChecklist.patientIdentityVerified || !dispenseChecklist.allergiesChecked}
                onClick={handleConfirmDispense}
              >
                Stamp Dispense &amp; Print Auxiliary Labels
              </Btn>
            </div>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div
              style={{
                padding: "12px",
                background: "var(--color-bg-secondary)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border-subtle)",
                display: "flex",
                justifyContent: "space-between"
              }}
            >
              <div>
                <div style={{ fontWeight: "600", fontSize: "14px" }}>
                  {selectedRx ? selectedRx.patientName : "Kamalbai Deshmukh"}
                </div>
                <div className="font-caption" style={{ color: "var(--color-text-secondary)" }}>
                  UHID: {selectedRx ? selectedRx.uhid : "UHID-2024-00891"} &bull; Prescribed by Dr. Rajesh Rao
                </div>
              </div>
              <Chip tone="red" icon="warning">
                Allergy: Penicillin
              </Chip>
            </div>

            <div>
              <label className="font-caption" style={{ fontWeight: "600", display: "block", marginBottom: "6px" }}>
                Active Batch (FEFO First-Expiry Allocation)
              </label>
              <select
                className="input-base"
                style={{ width: "100%" }}
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
              >
                <option value="TL3890 (Exp: 12/2026)">
                  Batch TL3890 &bull; Expiry: Dec 2026 (Earliest - Preferred FEFO)
                </option>
                <option value="TL4012 (Exp: 04/2027)">
                  Batch TL4012 &bull; Expiry: Apr 2027 (Secondary)
                </option>
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span className="font-caption" style={{ fontWeight: "600" }}>Mandatory Dispensing Double-Check</span>

              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={dispenseChecklist.patientIdentityVerified}
                  onChange={(e) =>
                    setDispenseChecklist({ ...dispenseChecklist, patientIdentityVerified: e.target.checked })
                  }
                />
                <span>Two-factor patient identity verified (Full name &amp; Year of birth / UHID barcode)</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={dispenseChecklist.allergiesChecked}
                  onChange={(e) =>
                    setDispenseChecklist({ ...dispenseChecklist, allergiesChecked: e.target.checked })
                  }
                />
                <span>Cross-checked against Penicillin allergy (No beta-lactam derivatives present)</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={dispenseChecklist.counselingCompleted}
                  onChange={(e) =>
                    setDispenseChecklist({ ...dispenseChecklist, counselingCompleted: e.target.checked })
                  }
                />
                <span>Pharmacist counseling provided: Hypoglycemia symptoms &amp; take Metformin with meals</span>
              </label>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
