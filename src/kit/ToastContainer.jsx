import { h } from "preact";
import { activeToasts, removeToast } from "../core/store.js";

export function ToastContainer() {
  const toasts = activeToasts.value;
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => {
        const icon =
          t.type === "success"
            ? "check_circle"
            : t.type === "warning"
            ? "warning"
            : t.type === "error"
            ? "error"
            : "info";

        return (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
              {icon}
            </span>
            <div style={{ flex: 1 }}>
              {t.title && <div style={{ fontWeight: 600, fontSize: "13px" }}>{t.title}</div>}
              <div style={{ fontSize: "12px", opacity: 0.9 }}>{t.message}</div>
            </div>
            <button
              type="button"
              className="btn-icon"
              style={{ color: "#FFF", width: "24px", height: "24px" }}
              onClick={() => removeToast(t.id)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                close
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
