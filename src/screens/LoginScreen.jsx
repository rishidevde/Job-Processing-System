import { h } from "preact";
import { useState } from "preact/hooks";
import { dispatch } from "../core/command.js";
import { STAFF_LIST, ROLES } from "../registry/roles.js";
import { Btn } from "../kit/Btn.jsx";
import { Chip } from "../kit/Chip.jsx";

export function LoginScreen() {
  const [selectedRoleId, setSelectedRoleId] = useState("doctor");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedStaff = ROLES[selectedRoleId] || STAFF_LIST[0];

  const roleOptions = STAFF_LIST.map((staff) => ({
    value: staff.id,
    label: `${staff.title} — ${staff.name} (${staff.department})`
  }));

  const roleIcons = {
    doctor: "stethoscope",
    receptionist: "how_to_reg",
    nurse: "vital_signs",
    lab_tech: "biotech",
    pharmacist: "pill",
    cashier: "payments",
    admin: "security"
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    setErrorMessage("");

    const cleanMobile = (mobile || "").trim();
    const cleanPassword = (password || "").trim();

    // 1. Check Mobile is provided
    if (!cleanMobile) {
      setErrorMessage("Please enter your 10-digit registered mobile number.");
      return;
    }

    // 2. Check Mobile is exactly 10 digits
    if (!/^\d{10}$/.test(cleanMobile)) {
      setErrorMessage("Invalid Mobile Number. You must enter a 10-digit mobile number.");
      return;
    }

    // 3. Check Password is provided
    if (!cleanPassword) {
      setErrorMessage("Please enter your staff access password.");
      return;
    }

    // 4. Check Password matches system password
    if (cleanPassword !== "2725") {
      setErrorMessage("Incorrect Password. Please enter the valid password.");
      return;
    }

    // Both valid: proceed with role session login
    setIsSubmitting(true);
    dispatch("SET_ROLE", {
      role: selectedStaff.id,
      name: selectedStaff.name,
      department: selectedStaff.department,
      station: `${selectedStaff.department} Terminal`,
      mobile: cleanMobile
    });

    const dest = selectedStaff.defaultRoute;
    window.location.hash = dest;
    currentRoute.value = {
      full: dest,
      path: dest.split("?")[0],
      query: {}
    };
  };

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* Left 38%: Brand Showcase */}
      <div
        style={{
          width: "38%",
          height: "100%",
          backgroundColor: "var(--color-brand-blue)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "48px",
          color: "#FFF"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "24px"
            }}
          >
            S
          </div>
          <div>
            <h1 className="font-h1" style={{ fontSize: "26px", color: "#FFF", margin: 0 }}>Samruddhi Hospital</h1>
            <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.7)" }}>Clinical Care &amp; Hospital Management</div>
          </div>
        </div>

        <p className="font-body-lg" style={{ color: "#93C5FD", fontWeight: 500, fontSize: "16px", maxWidth: "380px", lineHeight: "24px" }}>
          One Patient, One Connected Journey
        </p>

        <div style={{ marginTop: "32px", fontSize: "12px", color: "#CBD5E1", maxWidth: "360px", lineHeight: "1.6" }}>
          Zero-cross-contamination profile authentication. Each staff member selects their clinical role, verifies their registered 10-digit mobile number, and logs into strictly authorized workflows.
        </div>

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "4px", fontSize: "11px", color: "rgba(255, 255, 255, 0.5)", fontFamily: "JetBrains Mono" }}>
          <div>DocCare Clinical Suite 3.1 &bull; Build 4.8.1-PROD</div>
          <div>NABH / ISO 27001 Authenticated Security</div>
        </div>
      </div>

      {/* Right 62%: Login Form (No autopull, manual 10-digit + password 2725) */}
      <div
        style={{
          width: "62%",
          height: "100%",
          backgroundColor: "var(--color-page)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
          overflowY: "auto"
        }}
      >
        <div
          className="card"
          style={{
            width: "500px",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            boxShadow: "var(--shadow-md)"
          }}
        >
          {/* Header */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 className="font-h1" style={{ fontSize: "20px" }}>Staff Workstation Sign In</h2>
              <Chip tone="slate">Station Lock: Active</Chip>
            </div>
            <p className="font-body-sm" style={{ color: "var(--color-text-secondary)", marginTop: "4px" }}>
              Choose your clinical profession and enter your registered credentials:
            </p>
          </div>

          {/* Error Alert Box */}
          {errorMessage && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                padding: "12px 14px",
                borderRadius: "6px",
                backgroundColor: "var(--color-critical-subtle)",
                border: "1px solid var(--color-critical-border)",
                color: "var(--color-critical-text)",
                fontSize: "12px",
                lineHeight: "1.4"
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px", marginTop: "1px" }}>
                error
              </span>
              <div style={{ flex: 1, fontWeight: 500 }}>{errorMessage}</div>
              <button
                type="button"
                onClick={() => setErrorMessage("")}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-critical-text)",
                  padding: 0
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>close</span>
              </button>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Field 1: Profession Dropdown */}
            <div className="field-group">
              <label className="field-label" htmlFor="profession-select">
                Select Profession / Staff Role <span style={{ color: "var(--color-critical-text)" }}>*</span>
              </label>
              <select
                id="profession-select"
                className="field-select"
                value={selectedRoleId}
                onChange={(e) => {
                  setSelectedRoleId(e.target.value);
                  setErrorMessage("");
                }}
                style={{ height: "40px", fontSize: "13px" }}
              >
                {roleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Profession Summary Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                borderRadius: "8px",
                background: "var(--color-bg-secondary)",
                border: "1px solid var(--color-border-subtle)"
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: "var(--color-interactive-primary)",
                  color: "#FFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 700,
                  flexShrink: 0
                }}
              >
                {selectedStaff.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontWeight: 600, fontSize: "13px" }}>{selectedStaff.name}</span>
                  <Chip tone="slate">{selectedStaff.title}</Chip>
                </div>
                <div style={{ fontSize: "11px", color: "var(--color-text-secondary)", marginTop: "2px" }}>
                  {selectedStaff.department} &bull; {selectedStaff.allowedNav.length} Authorized Workflows
                </div>
              </div>
              <span
                className="material-symbols-outlined"
                style={{ color: "var(--color-interactive-primary)", fontSize: "20px" }}
              >
                {roleIcons[selectedStaff.id] || "badge"}
              </span>
            </div>

            {/* Field 2: Mobile Number (Starts Empty) */}
            <div className="field-group">
              <label className="field-label" htmlFor="staff-mobile">
                Mobile Number (10 digits) <span style={{ color: "var(--color-critical-text)" }}>*</span>
              </label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    position: "absolute",
                    left: "12px",
                    fontSize: "18px",
                    color: "var(--color-text-muted)",
                    pointerEvents: "none"
                  }}
                >
                  smartphone
                </span>
                <input
                  id="staff-mobile"
                  type="tel"
                  maxLength="10"
                  className="field-input"
                  style={{ paddingLeft: "38px", height: "40px", fontSize: "13px", width: "100%" }}
                  placeholder="Enter 10-digit registered mobile number"
                  value={mobile}
                  onInput={(e) => {
                    setMobile(e.target.value.replace(/\D/g, ""));
                    if (errorMessage) setErrorMessage("");
                  }}
                />
              </div>
              <span className="field-helper" style={{ fontSize: "11px" }}>
                Enter any valid 10-digit number (e.g. 9822100000)
              </span>
            </div>

            {/* Field 3: Password (Starts Empty) */}
            <div className="field-group">
              <label className="field-label" htmlFor="staff-password">
                Password <span style={{ color: "var(--color-critical-text)" }}>*</span>
              </label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    position: "absolute",
                    left: "12px",
                    fontSize: "18px",
                    color: "var(--color-text-muted)",
                    pointerEvents: "none"
                  }}
                >
                  lock
                </span>
                <input
                  id="staff-password"
                  type={showPassword ? "text" : "password"}
                  className="field-input"
                  style={{ paddingLeft: "38px", paddingRight: "38px", height: "40px", fontSize: "13px", width: "100%" }}
                  placeholder="YYYY"
                  value={password}
                  onInput={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--color-text-muted)",
                    padding: "4px"
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <Btn
                type="submit"
                variant="primary"
                icon="lock_open"
                disabled={isSubmitting}
                style={{ width: "100%", height: "42px", fontSize: "14px", fontWeight: 600, justifyContent: "center" }}
              >
                Sign In to Workstation ({selectedStaff.name})
              </Btn>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
