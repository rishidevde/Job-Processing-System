/**
 * Samruddhi HMS Master Route Registry
 * Maps all 23 Functional Workbenches & 38 Visual Frames (prototype1.md §2.2, §4.1)
 */

export const NAV_GROUPS = [
  { id: "clinical", title: "Clinical Care" },
  { id: "diagnostics", title: "Diagnostics & Pharmacy" },
  { id: "revenue", title: "Revenue & Administration" },
  { id: "ward", title: "Ward / Enterprise (Tier C)" },
  { id: "dev", title: "Engineering Console" }
];

export const ROUTES = [
  // 1. Authentication
  {
    id: "login",
    path: "#/login",
    title: "Operator Login & Quick PIN",
    scr: "SCR-01",
    frames: ["01"],
    group: null, // Fullscreen, no shell
    icon: "lock",
    patientStrip: false,
    stepper: false
  },

  // 2. Clinical Care
  {
    id: "dashboard",
    path: "#/dashboard",
    title: "OPD Central Command Dashboard",
    scr: "SCR-02",
    frames: ["02"],
    group: "clinical",
    icon: "dashboard",
    patientStrip: false,
    stepper: false
  },
  {
    id: "queue",
    path: "#/queue",
    title: "Appointments & Live Queue",
    scr: "SCR-03",
    frames: ["03", "26"],
    group: "clinical",
    icon: "queue",
    patientStrip: false,
    stepper: false
  },
  {
    id: "registry",
    path: "#/registry",
    title: "Patient Registry & Lookup",
    scr: "SCR-04",
    frames: ["04", "36"],
    group: "clinical",
    icon: "groups",
    patientStrip: false,
    stepper: false
  },
  {
    id: "registration",
    path: "#/registration",
    title: "Registration & OCR Staging",
    scr: "SCR-05",
    frames: ["05", "27"],
    group: "clinical",
    icon: "how_to_reg",
    patientStrip: true, // shown when matched
    stepper: false
  },
  {
    id: "triage",
    path: "#/triage/:enc?",
    title: "Triage Vitals & 7-Day Log",
    scr: "SCR-06",
    frames: ["06"],
    group: "clinical",
    icon: "vital_signs",
    patientStrip: true,
    stepper: true
  },
  {
    id: "workspace",
    path: "#/workspace/:enc?",
    title: "Doctor Clinical Workspace",
    scr: "SCR-07",
    frames: ["07", "08", "09", "28", "22", "35", "37"],
    group: "clinical",
    icon: "stethoscope",
    patientStrip: true,
    stepper: true
  },
  {
    id: "orders",
    path: "#/orders",
    title: "Clinical Orders Tracker",
    scr: "SCR-16",
    frames: ["18"],
    group: "clinical",
    icon: "clinical_notes",
    patientStrip: false,
    stepper: false
  },

  // 3. Diagnostics & Pharmacy
  {
    id: "lab",
    path: "#/lab",
    title: "Laboratory Accession & LIS",
    scr: "SCR-09",
    frames: ["10", "29"],
    group: "diagnostics",
    icon: "biotechnology",
    patientStrip: false,
    stepper: false
  },
  {
    id: "critical",
    path: "#/critical",
    title: "Critical Results & Panic Desk",
    scr: "SCR-17",
    frames: ["19", "34"],
    group: "diagnostics",
    icon: "emergency",
    patientStrip: false,
    stepper: false
  },
  {
    id: "pharmacy",
    path: "#/pharmacy",
    title: "Pharmacy Fulfilment & Dispense",
    scr: "SCR-10",
    frames: ["11", "30"],
    group: "diagnostics",
    icon: "pill",
    patientStrip: false,
    stepper: false
  },
  {
    id: "pharmacy_clarifications",
    path: "#/pharmacy/clarifications",
    title: "Prescriber Clarifications & Returns",
    scr: "SCR-18",
    frames: ["20"],
    group: "diagnostics",
    icon: "contact_support",
    patientStrip: false,
    stepper: false
  },

  // 4. Revenue Cycle & Administration
  {
    id: "billing",
    path: "#/billing/:inv?",
    title: "Unified Billing & Cashier",
    scr: "SCR-11",
    frames: ["12", "13", "31"],
    group: "revenue",
    icon: "payments",
    patientStrip: false,
    stepper: false
  },
  {
    id: "adjustments",
    path: "#/adjustments",
    title: "Billing Adjustments & Refunds",
    scr: "SCR-19",
    frames: ["21"],
    group: "revenue",
    icon: "price_change",
    patientStrip: false,
    stepper: false
  },
  {
    id: "documents",
    path: "#/documents/:enc?",
    title: "Document Package Builder",
    scr: "SCR-12",
    frames: ["14", "38"],
    group: "revenue",
    icon: "folder_zip",
    patientStrip: false,
    stepper: false
  },
  {
    id: "delivery",
    path: "#/delivery/:pkg?",
    title: "Secure Delivery Center",
    scr: "SCR-13",
    frames: ["15", "32"],
    group: "revenue",
    icon: "mark_email_read",
    patientStrip: false,
    stepper: false
  },
  {
    id: "delivery_tracking",
    path: "#/delivery-tracking",
    title: "Delivery Tracking & History",
    scr: "SCR-22",
    frames: ["24"],
    group: "revenue",
    icon: "local_shipping",
    patientStrip: false,
    stepper: false
  },
  {
    id: "corrections",
    path: "#/corrections",
    title: "Duplicate Resolution & Merge",
    scr: "SCR-14",
    frames: ["16"],
    group: "revenue",
    icon: "merge",
    patientStrip: false,
    stepper: false
  },
  {
    id: "audit",
    path: "#/audit",
    title: "WORM Audit & Access Review",
    scr: "SCR-21",
    frames: ["23"],
    group: "revenue",
    icon: "security",
    patientStrip: false,
    stepper: false
  },
  {
    id: "downtime",
    path: "#/downtime",
    title: "Downtime Recovery Workspace",
    scr: "SCR-23",
    frames: ["25"],
    group: "revenue",
    icon: "cloud_sync",
    patientStrip: false,
    stepper: false
  },

  // 5. Ward / Enterprise
  {
    id: "nursing",
    path: "#/nursing",
    title: "Nursing Workspace & SBAR Handover",
    scr: "SCR-15",
    frames: ["17", "33"],
    group: "ward",
    icon: "bed",
    patientStrip: false,
    stepper: false
  },

  // 6. Engineering Console
  {
    id: "frames_gallery",
    path: "#/frames",
    title: "38-Frame Visual Matrix Gallery",
    scr: "SYS-01",
    frames: ["*"],
    group: "dev",
    icon: "grid_view",
    patientStrip: false,
    stepper: false
  },
  {
    id: "matrix_spec",
    path: "#/dev/system",
    title: "System Architecture Portal",
    scr: "SYS-02",
    frames: ["Matrix"],
    group: "dev",
    icon: "terminal",
    patientStrip: false,
    stepper: false
  }
];

export function findRouteByPath(currentHash) {
  const cleanHash = (currentHash || "#/").split("?")[0];
  for (const r of ROUTES) {
    if (r.path.includes("/:")) {
      const base = r.path.split("/:")[0];
      if (cleanHash.startsWith(base)) return r;
    } else if (cleanHash === r.path) {
      return r;
    }
  }
  return ROUTES[0]; // default to Login (SCR-01)
}
