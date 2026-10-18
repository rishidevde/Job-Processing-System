import { h } from "preact";
import { useEffect } from "preact/hooks";

export function Modal({
  isOpen,
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  actions,
  size = "md",
  blocking = false,
  isBlocking = false,
  icon,
  borderTone
}) {
  const visible = isOpen !== undefined ? isOpen : (open !== undefined ? open : true);
  if (!visible) return null;

  const modalFooter = footer || actions;
  const isModalBlocking = blocking || isBlocking;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isModalBlocking && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalBlocking, onClose]);

  const sizeClass = `modal-${size}`;
  let borderStyle = {};
  if (borderTone === "critical") {
    borderStyle = { borderTop: "4px solid var(--color-critical-text)" };
  } else if (borderTone === "action") {
    borderStyle = { borderTop: "4px solid var(--color-action-needed-text)" };
  }

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (!isModalBlocking && onClose && e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={`modal-dialog ${sizeClass}`} style={borderStyle}>
        {/* Modal Header */}
        <div className="card-header" style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {icon && (
              <span
                className="material-symbols-outlined"
                style={{
                  color: borderTone === "critical" ? "var(--color-critical-text)" : "var(--color-primary)",
                  fontSize: "22px"
                }}
              >
                {icon}
              </span>
            )}
            <div>
              <h2 className="font-h3">{title}</h2>
              {subtitle && <p className="font-body-sm" style={{ color: "var(--color-text-secondary)", margin: 0 }}>{subtitle}</p>}
            </div>
          </div>
          {!isModalBlocking && onClose && (
            <button
              type="button"
              className="btn-icon"
              onClick={onClose}
              title="Close dialog (Escape)"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>

        {/* Modal Body with internal scrolling */}
        <div className="card-body panel-scroll" style={{ padding: "20px" }}>
          {children}
        </div>

        {/* Modal Footer Actions */}
        {modalFooter && <div className="card-footer" style={{ padding: "12px 20px" }}>{modalFooter}</div>}
      </div>
    </div>
  );
}

export function Drawer({
  isOpen,
  open,
  onClose,
  title,
  subtitle,
  children,
  size = "std",
  footer,
  actions
}) {
  const visible = isOpen !== undefined ? isOpen : (open !== undefined ? open : true);
  if (!visible) return null;

  const drawerFooter = footer || actions;
  const sizeClass = `drawer-${size}`;

  return (
    <div
      className="drawer-backdrop"
      onClick={(e) => {
        if (onClose && e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`drawer-panel ${sizeClass}`}>
        <div className="card-header" style={{ padding: "16px 20px" }}>
          <div>
            <h2 className="font-h3">{title}</h2>
            {subtitle && <p className="font-body-sm" style={{ color: "var(--color-text-secondary)", margin: 0 }}>{subtitle}</p>}
          </div>
          {onClose && (
            <button type="button" className="btn-icon" onClick={onClose} title="Close drawer">
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>

        <div className="panel-scroll" style={{ flex: 1, padding: "20px" }}>
          {children}
        </div>

        {drawerFooter && <div className="card-footer">{drawerFooter}</div>}
      </div>
    </div>
  );
}
