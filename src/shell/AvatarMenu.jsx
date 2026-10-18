import { h } from "preact";
import { appState, resetState } from "../core/store.js";
import { ROLES, STAFF_LIST } from "../registry/roles.js";
import { dispatch } from "../core/command.js";
import { TIMELINE_EVENTS } from "../data/timeline.js";
import { logoutUser } from "../core/auth.js";

export function AvatarMenu({ isOpen, onClose }) {
  if (!isOpen) return null;
  const state = appState.value;
  const currentRole = ROLES[state.session.role] || ROLES.doctor;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        backgroundColor: "transparent"
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "absolute",
          top: "60px",
          right: "20px",
          width: "320px",
          backgroundColor: "#FFF",
          borderRadius: "8px",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "scaleUp 0.15s ease-out"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Active User Header */}
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--color-border)", backgroundColor: "var(--color-subtle-bg)" }}>
          <div className="font-h3" style={{ fontSize: "14px" }}>{currentRole.name}</div>
          <div className="font-body-sm" style={{ color: "var(--color-text-secondary)" }}>
            Role: <strong>{currentRole.title}</strong>
          </div>
          <div className="font-body-sm" style={{ color: "var(--color-text-muted)", fontSize: "11px", marginTop: "2px" }}>
            Dept: {currentRole.department}
          </div>
        </div>

        {/* Station Lock Status */}
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--color-border)", display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="font-caption" style={{ color: "var(--color-text-secondary)" }}>Session Clearance:</span>
            <span className="chip chip-completed" style={{ height: "20px", fontSize: "10px" }}>Active &bull; Verified</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="font-caption" style={{ color: "var(--color-text-secondary)" }}>Terminal Location:</span>
            <strong style={{ fontSize: "12px" }}>{state.session.station || "Station Terminal"}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="font-caption" style={{ color: "var(--color-text-secondary)" }}>Workbenches:</span>
            <span style={{ fontSize: "12px" }}>{currentRole.allowedNav.length} Workflows</span>
          </div>
        </div>

        {/* Scenario Clock Quick Jump */}
        <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--color-border)" }}>
          <div className="font-label-bold" style={{ fontSize: "11px", color: "var(--color-text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>
            Scenario Time Travel
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {["09:00 AM", "09:40 AM", "10:15 AM", "10:45 AM", "10:52 AM", "11:00 AM"].map((t) => (
              <button
                key={t}
                type="button"
                className="btn btn-sm"
                style={{
                  height: "24px",
                  padding: "0 6px",
                  fontSize: "11px",
                  backgroundColor: state.session.clockTime === t ? "var(--color-primary)" : "var(--color-subtle-bg)",
                  color: state.session.clockTime === t ? "#FFF" : "var(--color-text-primary)",
                  border: "1px solid var(--color-border)"
                }}
                onClick={() => {
                  dispatch("SET_CLOCK", { time: t });
                  onClose();
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation & Reset Controls */}
        <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: "2px" }}>
          <button
            type="button"
            className="btn btn-text"
            style={{ width: "100%", justifyContent: "flex-start", fontSize: "12px", color: "var(--color-text-primary)", height: "30px" }}
            onClick={() => {
              window.location.hash = "#/frames";
              onClose();
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>grid_view</span>
            View 38-Frame Visual Matrix
          </button>
          <button
            type="button"
            className="btn btn-text"
            style={{ width: "100%", justifyContent: "flex-start", fontSize: "12px", color: "var(--color-text-primary)", height: "30px" }}
            onClick={() => {
              window.location.hash = "#/dev/system";
              onClose();
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>terminal</span>
            System Architecture Portal
          </button>
          <div style={{ borderTop: "1px solid var(--color-border)", marginTop: "4px", paddingTop: "4px" }}>
            <button
              type="button"
              className="btn btn-text"
              style={{ width: "100%", justifyContent: "flex-start", fontSize: "12px", color: "var(--color-critical-text)", height: "34px", fontWeight: 600 }}
              onClick={() => {
                onClose();
                logoutUser();
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--color-critical-text)" }}>logout</span>
              Lock Session &amp; Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
