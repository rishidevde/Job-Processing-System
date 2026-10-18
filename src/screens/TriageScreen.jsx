import { h } from "preact";
import { useState } from "preact/hooks";
import { appState } from "../core/store.js";
import { currentRoute } from "../core/router.js";
import { Chip } from "../kit/Chip.jsx";
import { Btn } from "../kit/Btn.jsx";
import { Field } from "../kit/Field.jsx";
import { dispatch } from "../core/command.js";
import { TrendChart } from "../kit/TrendChart.jsx";

export function TriageScreen() {
  const state = appState.value;
  const uhid = currentRoute.value.query.uhid || "884021";
  const patient =
    (state.patients && (state.patients[uhid] || Object.values(state.patients).find((p) => p.uhid === uhid))) || {
      uhid: "884021",
      name: "Mrs. Kamalbai Deshmukh",
      age: 58,
      sex: "F",
      payer: "TPA",
      attending: "Dr. R. Rao",
      allergies: ["Penicillin"]
    };

  const [vitals, setVitals] = useState({
    bpSystolic: "148",
    bpDiastolic: "92",
    pulse: "88",
    spo2: "98",
    temp: "98.4",
    weight: "68.2",
    height: "158",
    rbs: "242",
    painScore: "2",
    triageCategory: "Priority 2 (Urgent)",
    morseScore: "45",
    fallRiskLevel: "Moderate",
    chiefComplaint: "Severe polydipsia, chronic fatigue and unhealed right foot blister for 10 days"
  });

  const bmi = (
    parseFloat(vitals.weight) /
    Math.pow(parseFloat(vitals.height) / 100, 2)
  ).toFixed(1);

  const homeGlucoseReadings = [
    { day: "Oct 12", fasting: 172, pp: 238 },
    { day: "Oct 13", fasting: 184, pp: 255 },
    { day: "Oct 14", fasting: 168, pp: 242 },
    { day: "Oct 15", fasting: 195, pp: 268 },
    { day: "Oct 16", fasting: 180, pp: 250 },
    { day: "Oct 17", fasting: 188, pp: 262 },
    { day: "Today", fasting: 184, pp: 242 }
  ];

  const handleSaveTriage = (e) => {
    e.preventDefault();
    dispatch("SAVE_VITALS", {
      uhid: patient.uhid,
      vitals: {
        bp: `${vitals.bpSystolic}/${vitals.bpDiastolic}`,
        pulse: vitals.pulse,
        spo2: `${vitals.spo2}%`,
        rbs: `${vitals.rbs} mg/dL`,
        bmi,
        fallRisk: vitals.fallRiskLevel,
        triageCategory: vitals.triageCategory
      }
    });
    window.location.hash = `#/workspace?uhid=${patient.uhid}`;
  };

  return (
    <div className="panel-scroll" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h1 className="font-h1">OPD Nursing Triage &amp; Vitals Assessment</h1>
            <Chip tone="amber" icon="priority_high">
              Priority 2 (Urgent)
            </Chip>
            <Chip tone="amber" icon="airline_seat_recline_extra">
              Morse: {vitals.morseScore} (Moderate Fall Risk)
            </Chip>
          </div>
          <p className="font-body-sm" style={{ color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
            Vital signs capture, fall risk stratification &amp; home glycemic trend ingestion
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Btn variant="secondary" icon="arrow_back" onClick={() => (window.location.hash = "#/queue")}>
            Queue
          </Btn>
          <Btn variant="primary" icon="send" onClick={handleSaveTriage}>
            Push to Dr. Rao Desk
          </Btn>
        </div>
      </div>

      {/* 2-Column Grid: Left Vitals Form, Right 7-Day Glucose Log & Sparkline */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px" }}>
        {/* Left: Vitals Inputs */}
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "16px", background: "var(--color-bg-primary)" }}>
          <div className="font-subtitle-sm" style={{ borderBottom: "1px solid var(--color-border-subtle)", paddingBottom: "8px" }}>
            Real-time Clinical Measurements
          </div>

          <form onSubmit={handleSaveTriage} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <div>
                <Field
                  label="Blood Pressure (Systolic)"
                  value={vitals.bpSystolic}
                  suffix="mmHg"
                  onChange={(e) => setVitals({ ...vitals, bpSystolic: e.target.value })}
                />
                <span className="font-caption" style={{ color: "var(--color-clinical-amber)", marginTop: "2px", display: "block" }}>
                  Stage 1 HTN (Amber)
                </span>
              </div>
              <Field
                label="BP (Diastolic)"
                value={vitals.bpDiastolic}
                suffix="mmHg"
                onChange={(e) => setVitals({ ...vitals, bpDiastolic: e.target.value })}
              />
              <Field
                label="Pulse Rate"
                value={vitals.pulse}
                suffix="bpm"
                onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <Field
                label="SpO2 Saturation"
                value={vitals.spo2}
                suffix="%"
                onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
              />
              <Field
                label="Body Temperature"
                value={vitals.temp}
                suffix="°F"
                onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
              />
              <div>
                <Field
                  label="Random Blood Sugar"
                  value={vitals.rbs}
                  suffix="mg/dL"
                  onChange={(e) => setVitals({ ...vitals, rbs: e.target.value })}
                />
                <span className="font-caption" style={{ color: "var(--color-clinical-red)", marginTop: "2px", display: "block" }}>
                  High Hyperglycemia
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <Field
                label="Weight (kg)"
                value={vitals.weight}
                suffix="kg"
                onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
              />
              <Field
                label="Height (cm)"
                value={vitals.height}
                suffix="cm"
                onChange={(e) => setVitals({ ...vitals, height: e.target.value })}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "0 12px",
                  background: "var(--color-bg-secondary)",
                  borderRadius: "var(--radius-md)"
                }}
              >
                <span className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>Calculated BMI</span>
                <span className="font-subtitle" style={{ color: "var(--color-clinical-amber)" }}>
                  {bmi} kg/m² (Overweight)
                </span>
              </div>
            </div>

            <Field
              label="Chief Clinical Complaint &amp; Intake Notes"
              value={vitals.chiefComplaint}
              onChange={(e) => setVitals({ ...vitals, chiefComplaint: e.target.value })}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
              <Btn type="submit" variant="primary" icon="save">
                Confirm Triage &amp; Alert Doctor
              </Btn>
            </div>
          </form>
        </div>

        {/* Right: 7-day Home Glucose Trend & Risk Assessment */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Trend Card */}
          <div className="card" style={{ background: "var(--color-bg-primary)", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="font-subtitle-sm">7-Day Home Blood Glucose Log</span>
              <Chip tone="red" icon="trending_up">
                Fasting Avg: 181 mg/dL
              </Chip>
            </div>

            <TrendChart
              points={[172, 184, 168, 195, 180, 188, 184]}
              labels={["12th", "13th", "14th", "15th", "16th", "17th", "Today"]}
              color="var(--color-clinical-red)"
              height={140}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px" }}>
              {homeGlucoseReadings.slice(3).map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 8px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--color-bg-secondary)"
                  }}
                >
                  <span style={{ fontWeight: "500" }}>{r.day}</span>
                  <span>Fasting: <strong style={{ color: "var(--color-clinical-red)" }}>{r.fasting} mg/dL</strong></span>
                  <span>Post-Meal: <strong>{r.pp} mg/dL</strong></span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Badges */}
          <div className="card" style={{ background: "var(--color-bg-primary)", display: "flex", flexDirection: "column", gap: "10px" }}>
            <span className="font-subtitle-sm">Clinical Safety Stratification</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-clinical-amber)",
                  background: "var(--color-amber-50)"
                }}
              >
                <div>
                  <div style={{ fontWeight: "600", fontSize: "13px", color: "var(--color-amber-700)" }}>
                    Morse Fall Score: 45
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>
                    Assisted ambulation required due to peripheral neuropathy
                  </div>
                </div>
                <Chip tone="amber">Moderate Risk</Chip>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-clinical-red)",
                  background: "var(--color-red-50)"
                }}
              >
                <div>
                  <div style={{ fontWeight: "600", fontSize: "13px", color: "var(--color-red-700)" }}>
                    Severe Penicillin Allergy
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>
                    Hard stop interlock activated on all beta-lactam prescribing
                  </div>
                </div>
                <Chip tone="red">Hard Stop</Chip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
