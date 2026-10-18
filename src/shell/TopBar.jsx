import { h } from "preact";
import { appState } from "../core/store.js";
import { ROLES } from "../registry/roles.js";
import { liveClock } from "../core/clock.js";
import { logoutUser } from "../core/auth.js";

export function TopBar({ onToggleBell, onToggleAvatarMenu, onSearch, searchValue }) {
  const state = appState.value;
  const currentRole = ROLES[state.session.role] || ROLES.doctor;
  
  // Calculate critical alert count
  const hasCritical = !!(state.patients["884150"] && state.patients["884150"].criticalResult && !state.patients["884150"].criticalResult.readBackRecorded);
  const exceptionCount = 3; // Critical K+, Metformin Stockout, Creatinine review

  return (
    <header className="shell-topbar">
      {/* Brand & Facility Selector */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => (window.location.hash = "#/dashboard")}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "6px",
              backgroundColor: "var(--color-primary-container)",
              color: "#FFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "16px"
            }}
          >
            S
          </div>
          <div>
            <div className="font-h3" style={{ color: "var(--color-brand-blue)", fontSize: "16px", lineHeight: "20px" }}>
              Samruddhi Hospital
            </div>
            <div className="font-body-sm" style={{ color: "var(--color-text-muted)", fontSize: "10px" }}>
              DocCare Clinical Suite v4.8
            </div>
          </div>
        </div>

        <div style={{ height: "20px", width: "1px", backgroundColor: "var(--color-border)" }} />

        {/* Facility Dropdown */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 10px",
            borderRadius: "6px",
            backgroundColor: "var(--color-subtle-bg)",
            border: "1px solid var(--color-border)",
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--color-text-secondary)"
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>apartment</span>
          <span>{state.session.facility}</span>
          <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--color-text-muted)" }}>expand_more</span>
        </div>
      </div>

      {/* Center Search Input */}
      <div style={{ position: "relative", width: "340px" }}>
        <span
          className="material-symbols-outlined"
          style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)", fontSize: "18px" }}
        >
          search
        </span>
        <input
          type="text"
          className="field-input"
          style={{ width: "100%", paddingLeft: "34px", paddingRight: "44px", height: "36px", fontSize: "12px" }}
          placeholder="Search patient, UHID (884021), test or Rx..."
          value={searchValue}
          onInput={(e) => onSearch && onSearch(e.target.value)}
        />
        <span
          className="font-data-mono"
          style={{
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "10px",
            backgroundColor: "#E2E8F0",
            padding: "2px 5px",
            borderRadius: "4px",
            color: "#64748B"
          }}
        >
          Ctrl K
        </span>
      </div>

      {/* Right Controls: Clock, Tools, Bell, Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Live System Clock (Local & Deployed) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 12px",
            borderRadius: "6px",
            backgroundColor: "var(--color-subtle-bg)",
            border: "1px solid var(--color-border)",
            fontSize: "12px"
          }}
          title="Live Hospital System Clock (Synchronized with Local Workstation)"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--color-interactive-primary)" }}>
            schedule
          </span>
          <span className="font-data-mono" style={{ fontWeight: 700, letterSpacing: "0.02em", color: "var(--color-text-primary)" }}>
            {liveClock.value.time}
          </span>
          <span style={{ color: "var(--color-border-subtle)" }}>|</span>
          <span style={{ color: "var(--color-text-secondary)", fontWeight: 500 }}>
            {liveClock.value.date}
          </span>
        </div>

        {/* Action Tool Icons */}
        <div style={{ display: "flex", alignItems: "center", gap: "2px", borderRight: "1px solid var(--color-border)", paddingRight: "8px" }}>
          <button
            type="button"
            className="btn-icon"
            title="System Architecture Portal"
            onClick={() => (window.location.hash = "#/dev/system")}
          >
            <span className="material-symbols-outlined">terminal</span>
          </button>
          <button
            type="button"
            className="btn-icon"
            title="38-Frame Visual Matrix Gallery"
            onClick={() => (window.location.hash = "#/frames")}
          >
            <span className="material-symbols-outlined">grid_view</span>
          </button>

          {/* Bell Notifications */}
          <div style={{ position: "relative" }}>
            <button
              type="button"
              className="btn-icon"
              title="Exceptions and alerts inbox"
              onClick={onToggleBell}
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <span
              style={{
                position: "absolute",
                top: "2px",
                right: "2px",
                minWidth: "16px",
                height: "16px",
                borderRadius: "8px",
                backgroundColor: hasCritical ? "var(--color-critical-text)" : "var(--color-action-needed-text)",
                color: "#FFF",
                fontSize: "10px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 4px"
              }}
            >
              {exceptionCount}
            </span>
          </div>
        </div>

        {/* User Profile Avatar with Role Badge */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", padding: "4px 8px", borderRadius: "6px" }}
          onClick={onToggleAvatarMenu}
          title="Click to view operator profile and workstation status"
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              backgroundColor: "#EFF6FF",
              border: "1px solid var(--color-primary)",
              color: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "13px"
            }}
          >
            {currentRole.initials}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span className="font-label-bold" style={{ fontSize: "12px" }}>{currentRole.name}</span>
            <span style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>{currentRole.department}</span>
          </div>
          <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--color-text-muted)" }}>arrow_drop_down</span>
        </div>

        {/* Workstation Sign Out Button */}
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          title="Lock Workstation & Sign Out"
          onClick={() => logoutUser()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "var(--color-critical-text)",
            borderColor: "var(--color-critical-border)",
            background: "var(--color-critical-subtle)",
            fontWeight: 600,
            fontSize: "12px",
            height: "32px",
            padding: "0 10px",
            cursor: "pointer",
            marginLeft: "4px"
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--color-critical-text)" }}>
            logout
          </span>
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}
