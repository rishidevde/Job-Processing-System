import { h } from "preact";

const STEPS = [
  { id: "Registered", label: "Registered" },
  { id: "Triage", label: "Triage" },
  { id: "Consultation", label: "Consultation" },
  { id: "Orders", label: "Orders" },
  { id: "Pharmacy", label: "Pharmacy" },
  { id: "Billing", label: "Billing" },
  { id: "Documents", label: "Documents" },
  { id: "Closed", label: "Closed" }
];

export function Stepper({ currentStep = "Consultation", onStepClick }) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="encounter-stepper-bar">
      <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIndex || currentStep === "Closed";
          const isCurrent = idx === currentIndex && currentStep !== "Closed";

          let circleStyle = {
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: 600
          };

          if (isCompleted) {
            circleStyle = {
              ...circleStyle,
              backgroundColor: "var(--color-completed-text)",
              color: "#FFF"
            };
          } else if (isCurrent) {
            circleStyle = {
              ...circleStyle,
              backgroundColor: "#EFF6FF",
              border: "2px solid var(--color-primary)",
              color: "var(--color-primary)"
            };
          } else {
            circleStyle = {
              ...circleStyle,
              backgroundColor: "#F1F5F9",
              color: "var(--color-text-muted)"
            };
          }

          return (
            <div
              key={step.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: onStepClick ? "pointer" : "default"
              }}
              onClick={() => onStepClick && onStepClick(step.id)}
            >
              <div style={circleStyle}>
                {isCompleted ? (
                  <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>check</span>
                ) : (
                  idx + 1
                )}
              </div>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: isCurrent ? 600 : 500,
                  color: isCurrent
                    ? "var(--color-primary)"
                    : isCompleted
                    ? "var(--color-text-primary)"
                    : "var(--color-text-muted)"
                }}
              >
                {step.label}
              </span>

              {idx < STEPS.length - 1 && (
                <div
                  style={{
                    width: "24px",
                    height: "1px",
                    backgroundColor: idx < currentIndex ? "var(--color-completed-border)" : "var(--color-border)",
                    margin: "0 4px"
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
