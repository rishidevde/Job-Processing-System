/**
 * Samruddhi HMS Scenario Event Timeline & Checkpoints
 * Defined in prototype1.md Section 6.0
 */

export const TIMELINE_EVENTS = [
  { time: "09:00 AM", frame: "01", title: "Operator PIN Login", desc: "Shift begins at registration & nurse station." },
  { time: "09:35 AM", frame: "04", title: "Family Disambiguation", desc: "Meena searches +91 98221 00000; selects Kamalbai." },
  { time: "09:40 AM", frame: "03", title: "Patient Arrival", desc: "Kamalbai arrives, assigned Token T-014." },
  { time: "09:45 AM", frame: "05", title: "External Report Staging", desc: "City Lab HbA1c 8.6% report uploaded & attributed." },
  { time: "09:55 AM", frame: "06", title: "Triage Vitals Logged", desc: "Nurse S. More logs BP 140/90, Pulse 82, home glucose log." },
  { time: "10:12 AM", frame: "34", title: "Panic Potassium Verified", desc: "LIS reports K+ 6.8 mmol/L for Rajeshwar Patil (OPD-8851)." },
  { time: "10:15 AM", frame: "07", title: "Doctor Consultation", desc: "Dr. R. Rao opens 3-panel workspace, reviews trend." },
  { time: "10:19 AM", frame: "28", title: "Allergy Safety Stop", desc: "Draft Amoxicillin blocked by Penicillin allergy alert." },
  { time: "10:25 AM", frame: "07", title: "Prescription Signed", desc: "Dr. Rao signs RX-7710 (Telmisartan + Metformin)." },
  { time: "10:26 AM", frame: "10", title: "Lab Blood Collected", desc: "Blood specimen drawn for ORD-9921 Lipid profile." },
  { time: "10:30 AM", frame: "10", title: "Creatinine Result Entered", desc: "Creatinine 1.4 mg/dL entered with delta deviation flag." },
  { time: "10:35 AM", frame: "29", title: "Specimen Rejected", desc: "ORD-9921 rejected (Haemolysed). Stat recollection task issued." },
  { time: "10:38 AM", frame: "11", title: "Partial Pharmacy Dispense", desc: "20/30 Telmisartan dispensed by V. Gokhale (TL3890 batch)." },
  { time: "10:41 AM", frame: "30", title: "Pharmacy Stock-Out Flag", desc: "Metformin 500mg stock confirmed 0. CLR-401 raised to doctor." },
  { time: "10:44 AM", frame: "08", title: "Doctor Prescribing Decision", desc: "Dr. Rao decides: Keep as prescribed; await stock batch." },
  { time: "10:45 AM", frame: "02", title: "OPD Command Desk", desc: "OPD clock synchronized at 10:45 AM across all modules." },
  { time: "10:48 AM", frame: "12", title: "UPI Payment Initiated", desc: "Cashier initiates ₹750 patient copay (DEMO-UPI-8821)." },
  { time: "10:49 AM", frame: "13", title: "Branch 1: Gateway Timeout", desc: "Payment status unconfirmed. Auto-retry strictly locked." },
  { time: "10:52 AM", frame: "31", title: "Branch 2: Reconciled", desc: "₹750 reconciled, official receipt RCP-5521 issued." },
  { time: "10:58 AM", frame: "07", title: "Clinical Note Signed", desc: "Dr. Rao signs comprehensive consultation note." },
  { time: "11:00 AM", frame: "22", title: "Encounter Closed", desc: "Routine pending HbA1c assigned to Dr. Rao; encounter closed." },
  { time: "11:05 AM", frame: "14", title: "Document Package Built", desc: "PKG-8843-v1 assembled with pending lab disclosure." },
  { time: "11:08 AM", frame: "15", title: "Secure Delivery Staged", desc: "Consent recorded; prepared for WhatsApp link dispatch." },
  { time: "11:15 AM", frame: "32", title: "Delivery Failure Exception", desc: "WhatsApp unregistered. SMS link fallback initiated." },
  { time: "11:30 AM", frame: "23", title: "WORM Audit Finalized", desc: "All lifecycle transactions signed with DEMO-HASH-0041." }
];
