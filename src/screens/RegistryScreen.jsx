import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { appState } from "../core/store.js";
import { currentRoute } from "../core/router.js";
import { Btn } from "../kit/Btn.jsx";
import { Modal } from "../kit/Modal.jsx";
import { Field } from "../kit/Field.jsx";
import { dispatch } from "../core/command.js";

export function RegistryScreen() {
  const state = appState.value;
  const [query, setQuery] = useState("+91 98221 00000");
  const [disambiguateOpen, setDisambiguateOpen] = useState(false);
  const [selectedUhid, setSelectedUhid] = useState("884021");
  const [breakGlassOpen, setBreakGlassOpen] = useState(false);
  const [justification, setJustification] = useState("Acute panic hyperkalemia emergency assessment. Direct clinical handoff from ER.");

  useEffect(() => {
    if (currentRoute.value.query.modal === "disambiguate") {
      setDisambiguateOpen(true);
    } else if (currentRoute.value.query.modal === "breakglass") {
      setBreakGlassOpen(true);
    }
  }, [currentRoute.value.query]);

  const familyMembers = [
    { ...state.patients["884021"], relationship: "Self", lastVisit: "12 Aug 2026" },
    { ...state.patients["884022"], relationship: "Son", lastVisit: "02 Sep 2026" },
    { ...state.patients["884023"], relationship: "Daughter-in-law", lastVisit: "21 Jun 2026" }
  ];

  return (
    <div className="panel-scroll" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 className="font-h1">Patient Registry &amp; Demographics Lookup</h1>
          <p className="font-body-sm" style={{ color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
            Single lifetime UHID issuance and demographic directory
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Btn variant="secondary" icon="emergency" onClick={() => setBreakGlassOpen(true)}>
            Emergency Break-Glass (Frame 36)
          </Btn>
          <Btn variant="primary" icon="person_add" onClick={() => (window.location.hash = "#/registration")}>
            Register New Patient
          </Btn>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="card" style={{ padding: "16px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <Field
              placeholder="Search by Mobile (+91 98221 00000), Name, or UHID (884021)..."
              value={query}
              onChange={setQuery}
            />
          </div>
          <Btn variant="primary" icon="search" onClick={() => setDisambiguateOpen(true)}>
            Search Registry
          </Btn>
        </div>
        <p className="font-body-sm" style={{ color: "var(--color-text-muted)", margin: "8px 0 0", fontSize: "11px" }}>
          Tip: Searching shared family number <code>+91 98221 00000</code> triggers family disambiguation modal.
        </p>
      </div>

      {/* Directory Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="font-h3">Master Patient Index (Active Facilities)</h2>
          <span className="font-body-sm" style={{ color: "var(--color-text-muted)" }}>Displaying registered records</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>UHID</th>
                <th>Patient Name</th>
                <th>Age / Gender</th>
                <th>Primary Contact</th>
                <th>Payer Profile</th>
                <th>Active Conditions</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(state.patients).map((pat) => (
                <tr key={pat.uhid}>
                  <td className="font-data-mono font-label-bold">{pat.uhid}</td>
                  <td style={{ fontWeight: 600 }}>{pat.name}</td>
                  <td>{pat.age}Y · {pat.gender}</td>
                  <td className="font-data-mono">{pat.phone}</td>
                  <td>
                    <span className="payer-pill">{pat.payer || "Cash"}</span>
                  </td>
                  <td>
                    {(pat.activeConditions || []).join(", ") || "—"}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                      <Btn
                        variant="sm"
                        onClick={() => {
                          if (pat.phone === "+91 98221 00000") {
                            setDisambiguateOpen(true);
                          } else {
                            window.location.hash = `#/workspace/${pat.uhid === "884150" ? "OPD-8851" : "OPD-8843"}`;
                          }
                        }}
                      >
                        Open Record
                      </Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Frame 04: Family Disambiguation Modal (680px) */}
      {disambiguateOpen && (
        <Modal
          isOpen={true}
          onClose={() => setDisambiguateOpen(false)}
          title="Multiple patients share this phone number"
          subtitle="A shared number does not confirm identity. Select the correct person."
          icon="phone_in_talk"
          size="lg"
          footer={
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
              <button
                type="button"
                className="btn btn-text"
                style={{ fontSize: "12px", padding: 0 }}
                onClick={() => setDisambiguateOpen(false)}
              >
                Search by another identifier
              </button>
              <div style={{ display: "flex", gap: "10px" }}>
                <Btn variant="secondary" onClick={() => setDisambiguateOpen(false)}>
                  Cancel
                </Btn>
                <Btn
                  variant="primary"
                  icon="check"
                  onClick={() => {
                    setDisambiguateOpen(false);
                    window.location.hash = `#/workspace/OPD-8843?uhid=${selectedUhid}`;
                  }}
                >
                  Open Record (UHID {selectedUhid})
                </Btn>
              </div>
            </div>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {familyMembers.map((member) => {
              const isSelected = selectedUhid === member.uhid;
              return (
                <div
                  key={member.uhid}
                  style={{
                    padding: "14px",
                    borderRadius: "6px",
                    border: isSelected ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
                    backgroundColor: isSelected ? "var(--color-active-surface)" : "var(--color-card)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer"
                  }}
                  onClick={() => setSelectedUhid(member.uhid)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <input
                      type="radio"
                      name="disambiguate_radio"
                      checked={isSelected}
                      onChange={() => setSelectedUhid(member.uhid)}
                    />
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="font-h3" style={{ fontSize: "14px" }}>{member.name}</span>
                        <span className="chip chip-waiting" style={{ height: "20px", fontSize: "11px" }}>
                          {member.relationship}
                        </span>
                      </div>
                      <div className="font-body-sm font-data-mono" style={{ color: "var(--color-text-secondary)", marginTop: "2px" }}>
                        UHID: {member.uhid} · {member.age}Y · {member.gender} · Last Visit: {member.lastVisit}
                      </div>
                    </div>
                  </div>

                  <span className="payer-pill">{member.payer}</span>
                </div>
              );
            })}
          </div>
        </Modal>
      )}

      {/* Frame 36: Break-Glass Access Justification Modal (600px) */}
      {breakGlassOpen && (
        <Modal
          isOpen={true}
          onClose={() => setBreakGlassOpen(false)}
          title="Restricted Record Access — Audited Emergency Break-Glass"
          subtitle="This record is outside your usual assigned clinical context."
          icon="security"
          borderTone="action"
          size="md"
          footer={
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", width: "100%" }}>
              <Btn variant="secondary" onClick={() => setBreakGlassOpen(false)}>
                Cancel and return
              </Btn>
              <Btn
                variant="destructive"
                icon="verified_user"
                disabled={!justification.trim()}
                onClick={() => {
                  dispatch("LOG_BREAK_GLASS", {
                    uhid: "884150",
                    patientName: "Mr. Rajeshwar Patil",
                    doctor: "Dr. S. Mehta",
                    justification
                  });
                  setBreakGlassOpen(false);
                  window.location.hash = "#/workspace/OPD-8851";
                }}
              >
                Confirm Emergency Access (WORM Logged)
              </Btn>
            </div>
          }
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div className="banner banner-action-needed">
              <span className="material-symbols-outlined">warning</span>
              <div>
                Emergency access to <strong>Mr. Rajeshwar Patil (UHID 884150)</strong> will be permanently recorded in the immutable audit log under ISO 27001 requirements.
              </div>
            </div>

            <Field
              label="Requesting Clinician"
              value="Dr. S. Mehta (General / Emergency Medicine)"
              disabled={true}
            />

            <Field
              label="Mandatory Clinical Justification *"
              type="textarea"
              value={justification}
              onChange={setJustification}
              rows={3}
              helper="State the direct clinical necessity for opening this chart."
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
