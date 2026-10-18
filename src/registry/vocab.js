/**
 * Samruddhi HMS Status Vocabularies & Styling Registry
 * Based on prototype1.md Section 3.5 & Strict One-Colour Rule
 */

export const VOCAB = {
  // A. Workflow Statuses
  "Waiting": { label: "Waiting", tone: "waiting", icon: "schedule" },
  "In consultation": { label: "In consultation", tone: "active-consultation", icon: "play_arrow" },
  "Action needed": { label: "Action needed", tone: "action-needed", icon: "warning" },
  "Completed": { label: "Completed", tone: "completed", icon: "check_circle" },
  "Cancelled": { label: "Cancelled", tone: "waiting", icon: "cancel" },

  // B. Order & Result Statuses
  "Ordered": { label: "Ordered", tone: "waiting", icon: "description" },
  "Collection pending": { label: "Collection pending", tone: "waiting", icon: "hourglass_top" },
  "Collected": { label: "Collected", tone: "completed", icon: "colorize" },
  "Specimen rejected": { label: "Specimen rejected", tone: "action-needed", icon: "report_problem" },
  "In progress": { label: "In progress", tone: "waiting", icon: "sync" },
  "Resulted — awaiting review": { label: "Resulted — awaiting review", tone: "action-needed", icon: "biotechnology" },
  "Acknowledged": { label: "Acknowledged", tone: "completed", icon: "done_all" },

  // C. Prescription & Dispensing
  "Draft": { label: "Draft", tone: "waiting", icon: "edit_note" },
  "Signed": { label: "Signed", tone: "completed", icon: "verified" },
  "Amended": { label: "Amended", tone: "action-needed", icon: "update" },
  "Requested": { label: "Requested", tone: "waiting", icon: "forward" },
  "Partially dispensed": { label: "Partially dispensed", tone: "action-needed", icon: "incomplete_circle" },
  "Dispensed": { label: "Dispensed", tone: "completed", icon: "check_circle" },
  "Unavailable": { label: "Unavailable", tone: "action-needed", icon: "block" },
  "Awaiting prescriber review": { label: "Awaiting prescriber review", tone: "action-needed", icon: "pending" },

  // D. Financial Statuses
  "Posted": { label: "Posted", tone: "active-consultation", icon: "receipt_long" },
  "Payment pending reconciliation": { label: "Payment pending reconciliation", tone: "action-needed", icon: "hourglass_bottom" },
  "Paid and reconciled": { label: "Paid and reconciled", tone: "completed", icon: "check_circle" },
  "Credited": { label: "Credited", tone: "waiting", icon: "credit_card" },
  "Pending approval": { label: "Pending approval", tone: "action-needed", icon: "approval" },
  "Approved": { label: "Approved", tone: "completed", icon: "check" },
  "Processed": { label: "Processed", tone: "completed", icon: "check_circle" },
  "Reconciled": { label: "Reconciled", tone: "completed", icon: "done_all" },

  // E. Verification (External Data)
  "Document attributed": { label: "Document attributed", tone: "completed", icon: "attachment" },
  "Transcription reviewed": { label: "Transcription reviewed", tone: "completed", icon: "fact_check" },
  "Clinically validated": { label: "Clinically validated", tone: "completed", icon: "verified" },
  "Significance acknowledged": { label: "Significance acknowledged", tone: "completed", icon: "visibility" },
  "Unverified OCR draft": { label: "Unverified OCR draft", tone: "waiting", icon: "help_outline" },

  // F. Delivery & Consent
  "Consent checked": { label: "Consent checked", tone: "completed", icon: "how_to_reg" },
  "Queued": { label: "Queued", tone: "waiting", icon: "schedule" },
  "Sent": { label: "Sent", tone: "active-consultation", icon: "send" },
  "Delivered": { label: "Delivered", tone: "completed", icon: "done_all" },
  "Failed": { label: "Failed", tone: "action-needed", icon: "error_outline" },
  "Revoked": { label: "Revoked", tone: "waiting", icon: "remove_circle_outline" },
  "Recorded": { label: "Recorded", tone: "completed", icon: "check" },
  "Not recorded": { label: "Not recorded", tone: "waiting", icon: "close" },

  // G. Clinical Priority (ONLY RED/AMBER USED HERE)
  "Routine": { label: "Routine", tone: "waiting", icon: "low_priority" },
  "Urgent": { label: "Urgent", tone: "urgent", icon: "priority_high" },
  "Critical": { label: "Critical", tone: "critical", icon: "emergency" },

  // H. Comparison & Data State
  "Matches": { label: "Matches", tone: "completed", icon: "check" },
  "Differs": { label: "Differs", tone: "action-needed", icon: "difference" },
  "Conflict": { label: "Conflict", tone: "action-needed", icon: "warning" },
  "Cached": { label: "Cached", tone: "waiting", icon: "cloud_off" },
  "Stale": { label: "Stale", tone: "waiting", icon: "history" },

  // J. Ward Beds & Flags
  "Available": { label: "Available", tone: "completed", icon: "bed" },
  "Reserved": { label: "Reserved", tone: "waiting", icon: "bookmark" },
  "Occupied": { label: "Occupied", tone: "active-consultation", icon: "person" },
  "Discharge initiated": { label: "Discharge initiated", tone: "action-needed", icon: "output" },
  "Cleaning": { label: "Cleaning", tone: "waiting", icon: "cleaning_services" },
  "Out of service": { label: "Out of service", tone: "waiting", icon: "block" },
  
  // Clinical Safety Flags (Strict One-Colour Rule)
  "Fall risk": { label: "Fall risk", tone: "urgent", icon: "warning" },
  "Isolation": { label: "Isolation", tone: "isolation", icon: "masks" },
  "MLC": { label: "MLC", tone: "waiting", icon: "gavel" }
};

export function getVocab(key) {
  return VOCAB[key] || { label: key, tone: "waiting", icon: "info" };
}
