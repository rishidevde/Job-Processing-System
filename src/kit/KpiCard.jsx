import { h } from "preact";

export function KpiCard({ title, value, icon, alert = false, alertTone = "critical", highlight = false }) {
  return (
    <div
      className="card"
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: alert ? "1px solid var(--color-critical-border)" : "1px solid var(--color-border)"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="font-body-md" style={{ color: "var(--color-text-secondary)", fontWeight: 500 }}>
          {title}
        </span>
        {alert && (
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: alertTone === "critical" ? "var(--color-critical-text)" : "var(--color-action-needed-text)"
            }}
          />
        )}
      </div>

      <div style={{ marginTop: "8px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span
          className="font-h1"
          style={{
            fontSize: "24px",
            color: alert
              ? "var(--color-critical-text)"
              : highlight
              ? "var(--color-primary)"
              : "var(--color-text-primary)"
          }}
        >
          {value}
        </span>
        {icon && (
          <span
            className="material-symbols-outlined"
            style={{
              color: alert
                ? "var(--color-critical-text)"
                : highlight
                ? "var(--color-primary)"
                : "var(--color-text-muted)",
              fontSize: "22px"
            }}
          >
            {icon}
          </span>
        )}
      </div>
    </div>
  );
}

export function ExceptionCard({
  severity = "Action needed", // "Critical (clinical)" | "Action needed"
  title,
  patientName,
  patientUhid,
  patientEncounter,
  owner,
  ageText,
  note,
  actionLabel,
  actionVariant = "primary",
  onAction
}) {
  const isCritical = severity.toLowerCase().includes("critical");

  return (
    <div
      className="card"
      style={{
        borderLeft: isCritical ? "4px solid var(--color-critical-text)" : "4px solid var(--color-action-needed-text)",
        backgroundColor: isCritical ? "var(--color-critical-bg)" : "var(--color-card)",
        borderColor: isCritical ? "var(--color-critical-border)" : "var(--color-border)",
        padding: "14px",
        gap: "8px"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          className={`chip ${isCritical ? "chip-critical" : "chip-action-needed"}`}
          style={{ fontSize: "11px", height: "22px" }}
        >
          <span className="material-symbols-outlined">{isCritical ? "error" : "pending_actions"}</span>
          {severity}
        </span>
        <span className="font-data-mono font-body-sm" style={{ color: isCritical ? "var(--color-critical-text)" : "var(--color-text-secondary)", fontWeight: 600 }}>
          {ageText}
        </span>
      </div>

      <div>
        <h4 className="font-label-bold" style={{ fontSize: "13px", margin: 0, color: "var(--color-text-primary)" }}>
          {title}
        </h4>
        <p className="font-body-sm" style={{ margin: "4px 0 0", color: "var(--color-text-secondary)" }}>
          Patient: <strong>{patientName}</strong> (UHID {patientUhid}{patientEncounter ? `, ${patientEncounter}` : ""})
        </p>
        <p className="font-body-sm" style={{ margin: "2px 0 0", fontSize: "11px", color: "var(--color-text-muted)" }}>
          Owner: {owner} {note && `· ${note}`}
        </p>
      </div>

      {actionLabel && (
        <button
          type="button"
          className={`btn ${isCritical ? "btn-destructive" : actionVariant === "outline" ? "btn-outline-action" : "btn-primary"} btn-sm`}
          style={{ width: "100%", marginTop: "4px" }}
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
