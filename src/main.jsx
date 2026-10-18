import { h, render } from "preact";
import { useState, useEffect } from "preact/hooks";
import { currentRoute, initRouter } from "./core/router.js";
import { appState, resetState, updateState, activeBlockingInterlock } from "./core/store.js";
import { FRAMES } from "./registry/frames.js";
import { ROLES } from "./registry/roles.js";
import { Shell } from "./shell/Shell.jsx";
import { dispatch } from "./core/command.js";
import { logoutUser } from "./core/auth.js";

// All 23 functional workbench screens
import { LoginScreen } from "./screens/LoginScreen.jsx";
import { DashboardScreen } from "./screens/DashboardScreen.jsx";
import { QueueScreen } from "./screens/QueueScreen.jsx";
import { RegistryScreen } from "./screens/RegistryScreen.jsx";
import { RegistrationScreen } from "./screens/RegistrationScreen.jsx";
import { TriageScreen } from "./screens/TriageScreen.jsx";
import { WorkspaceScreen } from "./screens/WorkspaceScreen.jsx";
import { OrdersScreen } from "./screens/OrdersScreen.jsx";
import { LabScreen } from "./screens/LabScreen.jsx";
import { CriticalDeskScreen } from "./screens/CriticalDeskScreen.jsx";
import { PharmacyScreen } from "./screens/PharmacyScreen.jsx";
import { ClarificationsScreen } from "./screens/ClarificationsScreen.jsx";
import { BillingScreen } from "./screens/BillingScreen.jsx";
import { AdjustmentsScreen } from "./screens/AdjustmentsScreen.jsx";
import { DocumentsScreen } from "./screens/DocumentsScreen.jsx";
import { DeliveryScreen } from "./screens/DeliveryScreen.jsx";
import { DeliveryTrackingScreen } from "./screens/DeliveryTrackingScreen.jsx";
import { NursingScreen } from "./screens/NursingScreen.jsx";
import { CorrectionsScreen } from "./screens/CorrectionsScreen.jsx";
import { AuditScreen } from "./screens/AuditScreen.jsx";
import { DowntimeScreen } from "./screens/DowntimeScreen.jsx";
import { GalleryScreen } from "./screens/GalleryScreen.jsx";
import { SystemPortalScreen } from "./screens/SystemPortalScreen.jsx";

// Route Resolver
function resolveScreen(path) {
  const clean = (path || "#/").split("?")[0];

  if (clean === "#/login" || clean === "/login") return <LoginScreen />;
  if (clean === "#/dashboard" || clean === "#/" || clean === "" || clean === "#") return <DashboardScreen />;
  if (clean.startsWith("#/queue")) return <QueueScreen />;
  if (clean.startsWith("#/registry")) return <RegistryScreen />;
  if (clean.startsWith("#/registration")) return <RegistrationScreen />;
  if (clean.startsWith("#/triage")) return <TriageScreen />;
  if (clean.startsWith("#/workspace")) return <WorkspaceScreen />;
  if (clean.startsWith("#/orders")) return <OrdersScreen />;
  if (clean.startsWith("#/lab")) return <LabScreen />;
  if (clean.startsWith("#/critical")) return <CriticalDeskScreen />;
  if (clean.startsWith("#/pharmacy/clarifications") || clean.startsWith("#/clarifications")) return <ClarificationsScreen />;
  if (clean.startsWith("#/pharmacy")) return <PharmacyScreen />;
  if (clean.startsWith("#/billing")) return <BillingScreen />;
  if (clean.startsWith("#/adjustments")) return <AdjustmentsScreen />;
  if (clean.startsWith("#/documents")) return <DocumentsScreen />;
  if (clean.startsWith("#/delivery-tracking")) return <DeliveryTrackingScreen />;
  if (clean.startsWith("#/delivery")) return <DeliveryScreen />;
  if (clean.startsWith("#/nursing")) return <NursingScreen />;
  if (clean.startsWith("#/corrections")) return <CorrectionsScreen />;
  if (clean.startsWith("#/audit")) return <AuditScreen />;
  if (clean.startsWith("#/downtime")) return <DowntimeScreen />;
  if (clean.startsWith("#/frames") || clean.startsWith("#/gallery")) return <GalleryScreen />;
  if (clean.startsWith("#/dev/system") || clean.startsWith("#/system")) return <SystemPortalScreen />;

  return <DashboardScreen />;
}

// Quick Teleport & Simulation Floating Console
function DeveloperDock() {
  const [minimized, setMinimized] = useState(true);
  const state = appState.value;
  const currentRole = state.session ? state.session.role : "doctor";

  return (
    <div
      style={{
        position: "fixed",
        bottom: "12px",
        right: "16px",
        zIndex: 99999,
        background: "#0f172a",
        color: "#ffffff",
        borderRadius: "var(--radius-lg)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        border: "1px solid #334155",
        fontSize: "12px",
        fontFamily: "Inter, sans-serif",
        transition: "all 0.2s ease"
      }}
    >
      {minimized ? (
        <div
          onClick={() => setMinimized(false)}
          style={{
            padding: "8px 14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#38bdf8" }}>
            hub
          </span>
          <span>Matrix Teleport &amp; Simulation (38 Frames)</span>
          <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#94a3b8" }}>
            expand_less
          </span>
        </div>
      ) : (
        <div style={{ padding: "14px", width: "420px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155", paddingBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#38bdf8" }}>
                developer_mode
              </span>
              <strong style={{ fontSize: "13px" }}>Samruddhi Architecture Controls</strong>
            </div>
            <button
              onClick={() => setMinimized(true)}
              style={{
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                padding: "2px"
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                expand_more
              </span>
            </button>
          </div>

          {/* Quick Frame Teleport Selector */}
          <div>
            <label style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>
              TELEPORT TO ANY FRAME (1 to 38)
            </label>
            <select
              style={{
                width: "100%",
                background: "#1e293b",
                color: "#f8fafc",
                border: "1px solid #475569",
                borderRadius: "4px",
                padding: "6px 8px",
                fontSize: "12px"
              }}
              onChange={(e) => {
                if (e.target.value) {
                  window.location.hash = e.target.value;
                }
              }}
            >
              <option value="">-- Select Frame to Teleport --</option>
              {FRAMES.map((f) => (
                <option key={f.id} value={f.route}>
                  Frame {f.frame}: {f.title} ({f.role})
                </option>
              ))}
            </select>
          </div>

          {/* Active Operator Locked Profile */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1e293b", padding: "6px 10px", borderRadius: "4px" }}>
            <span style={{ fontSize: "11px", color: "#94a3b8" }}>Active Operator Profile:</span>
            <strong style={{ fontSize: "12px", color: "#38bdf8" }}>{state.session.userId} ({currentRole.toUpperCase()})</strong>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              style={{
                background: "transparent",
                color: "#94a3b8",
                border: "none",
                fontSize: "11px",
                cursor: "pointer",
                textDecoration: "underline"
              }}
              onClick={() => logoutUser()}
            >
              Sign out &amp; switch operator profile at login &rarr;
            </button>
          </div>

          {/* 1-Click Multi-Screen Reaction Simulators */}
          <div style={{ borderTop: "1px solid #334155", paddingTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ fontSize: "11px", color: "#94a3b8" }}>1-CLICK STORE REACTION DEMONSTRATIONS:</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              <button
                style={{
                  background: "#1e293b",
                  color: "#38bdf8",
                  border: "1px solid #38bdf8",
                  borderRadius: "4px",
                  padding: "6px",
                  fontSize: "11px",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
                onClick={() => {
                  dispatch("PATIENT_ADMITTED", {
                    uhid: "UHID-2024-00891",
                    bedId: "BED-04",
                    diagnosis: "Hyperglycemia & Severe Hyperkalemia"
                  });
                }}
              >
                Admit to Bed 04
              </button>

              <button
                style={{
                  background: "#1e293b",
                  color: "#f87171",
                  border: "1px solid #f87171",
                  borderRadius: "4px",
                  padding: "6px",
                  fontSize: "11px",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
                onClick={() => {
                  dispatch("PUBLISH_LAB_RESULT", {
                    orderId: "ORD-9021",
                    uhid: "UHID-2024-00891",
                    results: [{ test: "Serum Potassium", value: "6.8", flag: "Panic" }],
                    hasCriticalPanic: true
                  });
                }}
              >
                Fire K+ 6.8 Panic
              </button>

              <button
                style={{
                  background: "#1e293b",
                  color: "#cbd5e1",
                  border: "1px solid #475569",
                  borderRadius: "4px",
                  padding: "6px",
                  fontSize: "11px",
                  cursor: "pointer"
                }}
                onClick={() => (window.location.hash = "#/frames")}
              >
                38-Frame Gallery
              </button>

              <button
                style={{
                  background: "#1e293b",
                  color: "#cbd5e1",
                  border: "1px solid #475569",
                  borderRadius: "4px",
                  padding: "6px",
                  fontSize: "11px",
                  cursor: "pointer"
                }}
                onClick={() => (window.location.hash = "#/dev/system")}
              >
                Developer Portal
              </button>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #334155", paddingTop: "6px" }}>
            <span style={{ fontSize: "10px", color: "#64748b" }}>DocCare Clinical Suite 3.1</span>
            <button
              style={{
                background: "transparent",
                color: "#f87171",
                border: "none",
                fontSize: "11px",
                cursor: "pointer",
                textDecoration: "underline"
              }}
              onClick={() => {
                if (confirm("Reset store to canonical demonstration seed?")) {
                  resetState();
                }
              }}
            >
              Reset Seed State
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// App Root Component
export function App() {
  const route = currentRoute.value;
  const state = appState.value;
  const isLoggedIn = state.session && state.session.isLoggedIn !== false;
  const isLogin = !isLoggedIn || route.path === "#/login" || route.path === "/login";

  const activeScreen = isLogin ? <LoginScreen /> : resolveScreen(route.path);

  if (isLogin) {
    return (
      <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
        {activeScreen}
        <DeveloperDock />
      </div>
    );
  }

  return (
    <>
      <Shell>
        {activeScreen}
      </Shell>
      <DeveloperDock />
    </>
  );
}

// Initialize and mount Preact cleanly
const mountPoint = document.getElementById("app");
if (mountPoint) {
  mountPoint.innerHTML = "";
  render(<App />, mountPoint);
}
