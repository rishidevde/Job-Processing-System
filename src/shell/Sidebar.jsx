import { h } from "preact";
import { appState } from "../core/store.js";
import { ROLES } from "../registry/roles.js";
import { ROUTES, NAV_GROUPS } from "../registry/routes.js";
import { currentRoute } from "../core/router.js";
import { Btn } from "../kit/Btn.jsx";
import { logoutUser } from "../core/auth.js";

export function Sidebar() {
  const state = appState.value;
  const currentRole = ROLES[state.session.role] || ROLES.doctor;
  const activePath = currentRoute.value.path;

  // Filter routes by current role permissions (spec §4.1)
  const allowedIds = currentRole.allowedNav || [];
  
  return (
    <aside className="shell-sidebar">
      <div style={{ padding: "16px 0" }}>
        {NAV_GROUPS.map((grp) => {
          // Find routes in this group permitted strictly for this role
          const groupRoutes = ROUTES.filter((r) => {
            if (r.group !== grp.id) return false;
            return allowedIds.includes(r.id);
          });

          if (groupRoutes.length === 0) return null;

          return (
            <div key={grp.id} style={{ marginBottom: "16px", padding: "0 12px" }}>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--color-text-muted)",
                  padding: "4px 12px 6px"
                }}
              >
                {grp.title}
              </div>

              <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                {groupRoutes.map((r) => {
                  const isSelected = activePath === r.path.split("/:")[0];

                  return (
                    <a
                      key={r.id}
                      href={r.path.replace("/:enc?", "").replace("/:inv?", "").replace("/:pkg?", "")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        textDecoration: "none",
                        fontSize: "13px",
                        fontWeight: isSelected ? 600 : 500,
                        backgroundColor: isSelected ? "var(--color-active-surface)" : "transparent",
                        color: isSelected ? "var(--color-primary)" : "var(--color-text-secondary)",
                        borderLeft: isSelected ? "3px solid var(--color-primary)" : "3px solid transparent",
                        transition: "all 0.1s ease"
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: "18px",
                          color: isSelected ? "var(--color-primary)" : "var(--color-text-muted)"
                        }}
                      >
                        {r.icon}
                      </span>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {r.title}
                      </span>
                    </a>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>

      {/* Sidebar Quick Action CTA */}
      <div style={{ padding: "16px", borderTop: "1px solid var(--color-border)", backgroundColor: "#FAFAFC" }}>
        {state.session.role === "doctor" && (
          <Btn
            variant="primary"
            icon="add"
            className="w-full"
            onClick={() => (window.location.hash = "#/workspace/OPD-8843?action=new_rx")}
          >
            New Prescription
          </Btn>
        )}
        {state.session.role === "receptionist" && (
          <Btn
            variant="primary"
            icon="person_add"
            className="w-full"
            onClick={() => (window.location.hash = "#/registration")}
          >
            Register Patient
          </Btn>
        )}
        {state.session.role === "nurse" && (
          <Btn
            variant="primary"
            icon="vital_signs"
            className="w-full"
            onClick={() => (window.location.hash = "#/triage")}
          >
            Record Vitals
          </Btn>
        )}
        {state.session.role === "lab_tech" && (
          <Btn
            variant="primary"
            icon="biotech"
            className="w-full"
            onClick={() => (window.location.hash = "#/lab")}
          >
            Accession Specimen
          </Btn>
        )}
        {state.session.role === "pharmacist" && (
          <Btn
            variant="primary"
            icon="pill"
            className="w-full"
            onClick={() => (window.location.hash = "#/pharmacy")}
          >
            Dispense Medication
          </Btn>
        )}
        {state.session.role === "cashier" && (
          <Btn
            variant="primary"
            icon="payments"
            className="w-full"
            onClick={() => (window.location.hash = "#/billing")}
          >
            Collect Payment
          </Btn>
        )}
        {state.session.role === "admin" && (
          <Btn
            variant="primary"
            icon="security"
            className="w-full"
            onClick={() => (window.location.hash = "#/audit")}
          >
            Security Audit Log
          </Btn>
        )}

        {/* Dedicated Sidebar Sign Out Button */}
        <button
          type="button"
          onClick={() => logoutUser()}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "8px 12px",
            marginTop: "12px",
            borderRadius: "6px",
            background: "transparent",
            border: "1px solid var(--color-border)",
            color: "var(--color-text-secondary)",
            fontSize: "12px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-critical-border)";
            e.currentTarget.style.color = "var(--color-critical-text)";
            e.currentTarget.style.background = "var(--color-critical-subtle)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border)";
            e.currentTarget.style.color = "var(--color-text-secondary)";
            e.currentTarget.style.background = "transparent";
          }}
          title="Sign out from workstation and return to login"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>logout</span>
          Sign Out ({currentRole.title.split(" ")[0]})
        </button>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px", fontSize: "11px", color: "var(--color-text-muted)" }}>
          <span className="font-data-mono">Build 4.8.1-PROD</span>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#10B981" }} />
            <span>Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
