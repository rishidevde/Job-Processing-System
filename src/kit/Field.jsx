import { h } from "preact";

export function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  helper,
  required = false,
  options = [], // for select
  className = "",
  rows = 3,
  disabled = false
}) {
  return (
    <div className={`field-group ${className}`}>
      {label && (
        <label className="field-label">
          {label} {required && <span style={{ color: "var(--color-critical-text)" }}>*</span>}
        </label>
      )}

      {type === "select" ? (
        <select
          className={`field-select ${error ? "has-error" : ""}`}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          disabled={disabled}
        >
          {options.map((opt) => {
            const val = typeof opt === "string" ? opt : opt.value;
            const text = typeof opt === "string" ? opt : opt.label;
            return <option key={val} value={val}>{text}</option>;
          })}
        </select>
      ) : type === "textarea" ? (
        <textarea
          className={`field-textarea ${error ? "has-error" : ""}`}
          value={value}
          onInput={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
        />
      ) : (
        <input
          type={type}
          className={`field-input ${error ? "has-error" : ""}`}
          value={value}
          onInput={(e) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}

      {error && (
        <div className="field-error-msg">
          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>error</span>
          <span>{error}</span>
        </div>
      )}

      {helper && !error && <div className="field-helper">{helper}</div>}
    </div>
  );
}
