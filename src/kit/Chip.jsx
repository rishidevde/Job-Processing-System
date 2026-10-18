import { h } from "preact";
import { getVocab } from "../registry/vocab.js";

export function Chip({ status, customLabel, customIcon, className = "" }) {
  const meta = getVocab(status);
  const toneClass = `chip-${meta.tone || "waiting"}`;

  return (
    <span className={`chip ${toneClass} ${className}`} title={meta.label}>
      <span className="material-symbols-outlined">{customIcon || meta.icon}</span>
      <span>{customLabel || meta.label}</span>
    </span>
  );
}

export function PayerPill({ payer, memberRef, className = "" }) {
  const isTpa = payer === "TPA";
  const isScheme = payer === "Scheme";

  let pillClass = "payer-pill";
  if (isTpa) pillClass += " payer-pill-tpa";
  if (isScheme) pillClass += " payer-pill-scheme";

  return (
    <span className={`${pillClass} ${className}`} title={memberRef || payer}>
      {payer} {memberRef && <span style={{ opacity: 0.75, marginLeft: 4 }}>({memberRef})</span>}
    </span>
  );
}
