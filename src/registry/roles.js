/**
 * Samruddhi HMS Role & Staff Permission Registry
 * prototype1.md Section 4.1 & D9 Staff
 */

export const ROLES = {
  doctor: {
    id: "doctor",
    title: "Doctor (Gen Med OPD)",
    name: "Dr. R. Rao",
    department: "General Medicine OPD",
    initials: "RR",
    pin: "1234",
    defaultRoute: "#/dashboard",
    allowedNav: [
      "dashboard",
      "queue",
      "workspace",
      "orders",
      "critical"
    ]
  },
  receptionist: {
    id: "receptionist",
    title: "Receptionist",
    name: "Meena Pawar",
    department: "OPD Intake & Registry",
    initials: "MP",
    pin: "4321",
    defaultRoute: "#/queue",
    allowedNav: [
      "dashboard",
      "queue",
      "registry",
      "registration",
      "corrections"
    ]
  },
  nurse: {
    id: "nurse",
    title: "Nurse (Ward & OPD)",
    name: "Nurse S. More",
    department: "Triage & Ward Care",
    initials: "SM",
    pin: "1122",
    defaultRoute: "#/triage",
    allowedNav: [
      "dashboard",
      "triage",
      "nursing",
      "orders"
    ]
  },
  lab_tech: {
    id: "lab_tech",
    title: "Lab Technician",
    name: "P. Nair",
    department: "Central Biochem Lab",
    initials: "PN",
    pin: "5566",
    defaultRoute: "#/lab",
    allowedNav: [
      "dashboard",
      "lab",
      "critical",
      "orders"
    ]
  },
  pharmacist: {
    id: "pharmacist",
    title: "Pharmacist",
    name: "V. Gokhale",
    department: "Central Dispensary",
    initials: "VG",
    pin: "7788",
    defaultRoute: "#/pharmacy",
    allowedNav: [
      "dashboard",
      "pharmacy",
      "pharmacy_clarifications"
    ]
  },
  cashier: {
    id: "cashier",
    title: "Cashier & Billing",
    name: "A. Pawar",
    department: "Revenue & Billing",
    initials: "AP",
    pin: "9900",
    defaultRoute: "#/billing",
    allowedNav: [
      "dashboard",
      "billing",
      "adjustments",
      "documents",
      "delivery",
      "delivery_tracking"
    ]
  },
  admin: {
    id: "admin",
    title: "Administrator & Auditor",
    name: "Dr. Sandeep / R. Iyer",
    department: "Governance & Engineering",
    initials: "AD",
    pin: "0000",
    defaultRoute: "#/audit",
    allowedNav: [
      "dashboard",
      "audit",
      "corrections",
      "downtime",
      "delivery_tracking",
      "registry",
      "frames_gallery",
      "matrix_spec"
    ]
  }
};

export const STAFF_LIST = Object.values(ROLES);
