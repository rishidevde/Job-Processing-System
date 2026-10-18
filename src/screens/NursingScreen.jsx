import { h } from "preact";
import { useState } from "preact/hooks";
import { appState } from "../core/store.js";
import { currentRoute } from "../core/router.js";
import { Chip } from "../kit/Chip.jsx";
import { Btn } from "../kit/Btn.jsx";
import { Drawer } from "../kit/Modal.jsx";
import { dispatch } from "../core/command.js";

export function NursingScreen() {
  const state = appState.value;
  const isSbarFrame = currentRoute.value.query.sbar === "true" || currentRoute.value.query.frame === "33";

  const [sbarDrawerOpen, setSbarDrawerOpen] = useState(isSbarFrame);
  const [selectedBed, setSelectedBed] = useState(null);

  const [sbar, setSbar] = useState({
    situation: "Patient Kamalbai Deshmukh (58F) admitted from OPD Room 12 with uncontrolled hyperglycemia (RBS 242 mg/dL), critical hyperkalemia (K+ 6.8 mEq/L) and infected right heel ulcer.",
    background: "Known Type 2 Diabetes (12 years) on irregular oral medications, hypertension (5 years). Documented severe anaphylactic allergy to Penicillin.",
    assessment: "Currently in Bed 04. Vitals: BP 142/88, Pulse 84 bpm regular. Calcium Gluconate 10% IV infused. High Morse fall risk score (65) and contact precautions active for wound culture.",
    recommendation: "Maintain telemetry cardiac monitoring. Hourly blood glucose checks. Repeat STAT Serum Potassium at 11:30 AM. Strictly avoid any beta-lactam antimicrobials."
  });

  const beds = state.beds || [
    { bedId: "BED-01", ward: "Medical Ward", patientName: "Ramesh Patil", uhid: "UHID-2024-00142", status: "Occupied", morse: 25, isolation: null },
    { bedId: "BED-02", ward: "Medical Ward", patientName: "Sanjay More", uhid: "UHID-2024-00311", status: "Occupied", morse: 15, isolation: null },
    { bedId: "BED-03", ward: "Medical Ward", patientName: null, uhid: null, status: "Available", morse: null, isolation: null },
    {
      bedId: "BED-04",
      ward: "Medical Ward",
      patientName: "Kamalbai Deshmukh",
      uhid: "UHID-2024-00891",
      status: "Occupied",
      morse: 65,
      isolation: "Contact Isolation",
      allergy: "Penicillin",
      attending: "Dr. Rajesh Rao"
    },
    { bedId: "BED-05", ward: "Medical Ward", patientName: null, uhid: null, status: "Cleaning", morse: null, isolation: null },
    { bedId: "BED-06", ward: "Medical Ward", patientName: "Anita Kulkarni", uhid: "UHID-2024-00650", status: "Occupied", morse: 30, isolation: null }
  ];

  const handleSaveSbar = () => {
    dispatch("UPDATE_SBAR_HANDOVER", {
      uhid: "UHID-2024-00891",
      bedId: "BED-04",
      sbar
    });
    setSbarDrawerOpen(false);
  };

  return (
    <div className="panel-scroll" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h1 className="font-h1">Ward Bed Matrix &amp; Nursing Station</h1>
            <Chip tone="slate">Medical Ward A (Floor 3)</Chip>
            {isSbarFrame && <Chip tone="amber">Frame 33: SBAR Clinical Handover</Chip>}
          </div>
          <p className="font-body-sm" style={{ color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
            Real-time inpatient occupancy, fall risk stratification &amp; closed-loop shift handover (SCR-15 / Frames 17, 33)
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Btn
            variant="secondary"
            onClick={() => {
              if (isSbarFrame) {
                window.location.hash = "#/nursing";
                setSbarDrawerOpen(false);
              } else {
                window.location.hash = "#/nursing?frame=33";
                setSbarDrawerOpen(true);
              }
            }}
          >
            {isSbarFrame ? "Show Ward Matrix (Frame 17)" : "Open SBAR Handover (Frame 33)"}
          </Btn>
          <Btn
            variant="primary"
            icon="assignment"
            onClick={() => setSbarDrawerOpen(true)}
          >
            Shift Handover Pad (SBAR)
          </Btn>
        </div>
      </div>

      {/* Ward Occupancy KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
        <div className="card" style={{ padding: "12px", background: "var(--color-bg-primary)" }}>
          <div className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>TOTAL BEDS</div>
          <div className="font-h2" style={{ marginTop: "4px" }}>6</div>
        </div>
        <div className="card" style={{ padding: "12px", background: "var(--color-bg-primary)" }}>
          <div className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>OCCUPIED</div>
          <div className="font-h2" style={{ color: "var(--color-interactive-primary)", marginTop: "4px" }}>4</div>
        </div>
        <div className="card" style={{ padding: "12px", background: "var(--color-bg-primary)" }}>
          <div className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>VACANT &bull; READY</div>
          <div className="font-h2" style={{ color: "var(--color-clinical-emerald)", marginTop: "4px" }}>1</div>
        </div>
        <div className="card" style={{ padding: "12px", background: "var(--color-bg-primary)" }}>
          <div className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>HIGH FALL RISK (MORSE &gt; 45)</div>
          <div className="font-h2" style={{ color: "var(--color-clinical-amber)", marginTop: "4px" }}>1</div>
        </div>
      </div>

      {/* Interactive Bed Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        {beds.map((b) => (
          <div
            key={b.bedId}
            className="card"
            style={{
              background: "var(--color-bg-primary)",
              border: b.bedId === "BED-04" ? "2px solid var(--color-clinical-amber)" : "1px solid var(--color-border-subtle)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              padding: "16px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="material-symbols-outlined" style={{ color: "var(--color-interactive-primary)" }}>
                  single_bed
                </span>
                <span className="font-subtitle">{b.bedId}</span>
              </div>
              <Chip tone={b.status === "Occupied" ? "blue" : b.status === "Available" ? "emerald" : "slate"}>
                {b.status}
              </Chip>
            </div>

            {b.status === "Occupied" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ fontWeight: "700", fontSize: "14px" }}>{b.patientName}</div>
                <div className="font-caption" style={{ color: "var(--color-text-secondary)" }}>
                  {b.uhid} &bull; Attending: {b.attending || "Dr. S. Patil"}
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}>
                  {b.morse && (
                    <Chip tone={b.morse >= 45 ? "amber" : "slate"} icon="airline_seat_recline_extra">
                      Morse: {b.morse} {b.morse >= 45 ? "(High Risk)" : ""}
                    </Chip>
                  )}
                  {b.isolation && (
                    <Chip tone="amber" icon="masks">
                      {b.isolation}
                    </Chip>
                  )}
                  {b.allergy && (
                    <Chip tone="red" icon="warning">
                      Allergy: {b.allergy}
                    </Chip>
                  )}
                </div>

                <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                  <Btn
                    size="sm"
                    variant="secondary"
                    icon="clinical_notes"
                    onClick={() => {
                      setSelectedBed(b);
                      setSbarDrawerOpen(true);
                    }}
                  >
                    View SBAR
                  </Btn>
                  <Btn
                    size="sm"
                    variant="ghost"
                    icon="monitoring"
                    onClick={() => (window.location.hash = `#/triage?uhid=${b.uhid}`)}
                  >
                    Vitals
                  </Btn>
                </div>
              </div>
            ) : (
              <div style={{ padding: "20px 0", textAlign: "center", color: "var(--color-text-tertiary)" }}>
                Bed Vacant &bull; Ready for Patient Allocation
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Frame 33: SBAR Handover Drawer */}
      {sbarDrawerOpen && (
        <Drawer
          title="Clinical Shift Handover (SBAR Protocol - Frame 33)"
          open={sbarDrawerOpen}
          onClose={() => setSbarDrawerOpen(false)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                padding: "12px",
                borderRadius: "var(--radius-md)",
                background: "var(--color-bg-secondary)",
                border: "1px solid var(--color-border-subtle)"
              }}
            >
              <div style={{ fontWeight: "600", fontSize: "14px" }}>
                Kamalbai Deshmukh (58F) &bull; Bed 04
              </div>
              <div className="font-caption" style={{ color: "var(--color-text-secondary)" }}>
                Attending: Dr. Rajesh Rao &bull; Admitted: 10:15 AM
              </div>
            </div>

            <div>
              <label className="font-caption" style={{ fontWeight: "700", color: "var(--color-interactive-primary)", display: "block", marginBottom: "4px" }}>
                S - SITUATION
              </label>
              <textarea
                className="input-base"
                rows={3}
                style={{ width: "100%", resize: "vertical" }}
                value={sbar.situation}
                onInput={(e) => setSbar({ ...sbar, situation: e.target.value })}
              />
            </div>

            <div>
              <label className="font-caption" style={{ fontWeight: "700", color: "var(--color-interactive-primary)", display: "block", marginBottom: "4px" }}>
                B - BACKGROUND
              </label>
              <textarea
                className="input-base"
                rows={3}
                style={{ width: "100%", resize: "vertical" }}
                value={sbar.background}
                onInput={(e) => setSbar({ ...sbar, background: e.target.value })}
              />
            </div>

            <div>
              <label className="font-caption" style={{ fontWeight: "700", color: "var(--color-interactive-primary)", display: "block", marginBottom: "4px" }}>
                A - ASSESSMENT
              </label>
              <textarea
                className="input-base"
                rows={3}
                style={{ width: "100%", resize: "vertical" }}
                value={sbar.assessment}
                onInput={(e) => setSbar({ ...sbar, assessment: e.target.value })}
              />
            </div>

            <div>
              <label className="font-caption" style={{ fontWeight: "700", color: "var(--color-interactive-primary)", display: "block", marginBottom: "4px" }}>
                R - RECOMMENDATION
              </label>
              <textarea
                className="input-base"
                rows={3}
                style={{ width: "100%", resize: "vertical" }}
                value={sbar.recommendation}
                onInput={(e) => setSbar({ ...sbar, recommendation: e.target.value })}
              />
            </div>

            <div style={{ marginTop: "auto" }}>
              <Btn fullWidth variant="primary" icon="check" onClick={handleSaveSbar}>
                Sign Handover &amp; Transfer Custody
              </Btn>
            </div>
          </div>
        </Drawer>
      )}
    </div>
  );
}
