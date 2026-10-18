import { h } from "preact";

export function Btn({
  children,
  variant = "primary", // primary | secondary | destructive | outline-action | text | icon | sm
  icon,
  onClick,
  disabled = false,
  disabledReason,
  className = "",
  type = "button",
  title
}) {
  const variantClass = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    destructive: "btn-destructive",
    "outline-action": "btn-outline-action",
    text: "btn-text",
    icon: "btn-icon",
    sm: "btn-secondary btn-sm"
  }[variant] || "btn-primary";

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${className}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      title={disabledReason || title}
    >
      {icon && <span className="material-symbols-outlined">{icon}</span>}
      {children}
    </button>
  );
}
