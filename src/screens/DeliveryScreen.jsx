import { h } from "preact";
import { useState } from "preact/hooks";
import { appState } from "../core/store.js";
import { currentRoute } from "../core/router.js";
import { Chip } from "../kit/Chip.jsx";
import { Btn } from "../kit/Btn.jsx";
import { dispatch } from "../core/command.js";

export function DeliveryScreen() {
  const state = appState.value;
  const isFailureState = currentRoute.value.query.state === "failure" || currentRoute.value.query.frame === "32";

  const [deliveryChannels, setDeliveryChannels] = useState({
    whatsapp: true,
    sms: true,
    abha: true,
    email: false
  });

  const [consentConfirmed, setConsentConfirmed] = useState(true);
  const [isDispatched, setIsDispatched] = useState(false);
  const [failedChannel, setFailedChannel] = useState(isFailureState ? "whatsapp" : null);

  const handleDispatch = () => {
    dispatch("DISPATCH_DIGITAL_RECORDS", {
      uhid: "UHID-2024-00891",
      packageId: "PKG-8812",
      channels: deliveryChannels
    });
    setIsDispatched(true);
  };

  const handleTriggerSmsFallback = () => {
    dispatch("TRIGGER_SMS_FALLBACK", {
      uhid: "UHID-2024-00891",
      carrier: "Fast2SMS Enterprise Gateway"
    });
    setFailedChannel(null);
  };

  return (
    <div className="panel-scroll" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h1 className="font-h1">Secure Multi-Channel Digital Delivery Center</h1>
            <Chip tone="slate">DPDP Act 2023 Compliant</Chip>
            {isFailureState && <Chip tone="plum">Frame 32: WhatsApp Delivery Failure &amp; Failover</Chip>}
          </div>
          <p className="font-body-sm" style={{ color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
            Encrypted zero-trust link distribution, ABHA M2 push &amp; failover tracking (SCR-13 / Frames 15, 32)
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Btn
            variant="secondary"
            onClick={() => {
              if (isFailureState) {
                window.location.hash = "#/delivery";
                setFailedChannel(null);
              } else {
                window.location.hash = "#/delivery?frame=32";
                setFailedChannel("whatsapp");
              }
            }}
          >
            {isFailureState ? "Show Standard Delivery (Frame 15)" : "Simulate WhatsApp Fail (Frame 32)"}
          </Btn>
          <Btn
            variant="secondary"
            icon="query_stats"
            onClick={() => (window.location.hash = "#/delivery-tracking")}
          >
            Tracking Manifest (Frame 24)
          </Btn>
          <Btn
            variant="primary"
            icon="send"
            disabled={!consentConfirmed}
            onClick={handleDispatch}
          >
            Transmit Document Package
          </Btn>
        </div>
      </div>

      {/* Frame 32: Delivery Failure & Automated Failover Callout */}
      {(failedChannel === "whatsapp" || isFailureState) && (
        <div
          style={{
            padding: "14px 18px",
            borderRadius: "var(--radius-md)",
            background: "var(--color-operational-plum-bg)",
            border: "1px solid var(--color-operational-plum-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span className="material-symbols-outlined" style={{ color: "var(--color-operational-plum)", fontSize: "28px" }}>
              sms_failed
            </span>
            <div>
              <div style={{ fontWeight: "700", color: "var(--color-operational-plum)", fontSize: "14px" }}>
                WhatsApp Delivery Undelivered (Error #131026)
              </div>
              <div className="font-body-sm" style={{ color: "var(--color-text-secondary)" }}>
                Recipient phone +91 98230 ***** is temporarily unreachable via Meta Cloud API or not on WhatsApp.
                Automatic failover circuit available.
              </div>
            </div>
          </div>

          <Btn variant="primary" icon="sync_alt" onClick={handleTriggerSmsFallback}>
            Trigger Fast2SMS Carrier Failover
          </Btn>
        </div>
      )}

      {/* Main Delivery Config & Verification Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "16px" }}>
        {/* Channel Selection Card */}
        <div className="card" style={{ background: "var(--color-bg-primary)", display: "flex", flexDirection: "column", gap: "16px" }}>
          <span className="font-subtitle">Distribution Channels &amp; Masked Targets</span>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* WhatsApp */}
            <div
              style={{
                padding: "12px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border-subtle)",
                background: "var(--color-bg-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className="material-symbols-outlined" style={{ color: "#25D366" }}>
                  chat
                </span>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "13px" }}>WhatsApp Business API</div>
                  <div className="font-caption" style={{ color: "var(--color-text-secondary)" }}>
                    Masked Target: <strong>+91 98230 *****</strong> (Interactive PDF Bot)
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={deliveryChannels.whatsapp}
                onChange={(e) => setDeliveryChannels({ ...deliveryChannels, whatsapp: e.target.checked })}
              />
            </div>

            {/* SMS */}
            <div
              style={{
                padding: "12px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border-subtle)",
                background: "var(--color-bg-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className="material-symbols-outlined" style={{ color: "var(--color-interactive-primary)" }}>
                  sms
                </span>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "13px" }}>Encrypted SMS Short-Link</div>
                  <div className="font-caption" style={{ color: "var(--color-text-secondary)" }}>
                    Target: <strong>+91 98230 *****</strong> &bull; DLT Template #14071689
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={deliveryChannels.sms}
                onChange={(e) => setDeliveryChannels({ ...deliveryChannels, sms: e.target.checked })}
              />
            </div>

            {/* ABHA */}
            <div
              style={{
                padding: "12px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border-subtle)",
                background: "var(--color-bg-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className="material-symbols-outlined" style={{ color: "var(--color-clinical-emerald)" }}>
                  fingerprint
                </span>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "13px" }}>ABHA Digital Health Locker (M2)</div>
                  <div className="font-caption" style={{ color: "var(--color-text-secondary)" }}>
                    ABHA ID: <strong>91-4432-8891-2011</strong> (Direct FHIR Push)
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={deliveryChannels.abha}
                onChange={(e) => setDeliveryChannels({ ...deliveryChannels, abha: e.target.checked })}
              />
            </div>
          </div>

          {/* Consent Checkbox */}
          <div
            style={{
              padding: "12px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border-subtle)",
              background: "var(--color-bg-primary)"
            }}
          >
            <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", fontSize: "12px" }}>
              <input
                type="checkbox"
                style={{ marginTop: "2px" }}
                checked={consentConfirmed}
                onChange={(e) => setConsentConfirmed(e.target.checked)}
              />
              <span style={{ color: "var(--color-text-secondary)", lineHeight: "1.5" }}>
                I confirm that the patient/guardian has provided explicit digital consent for transmission of medical
                records under the Digital Personal Data Protection (DPDP) Act 2023. Link validity is set to 72 hours.
              </span>
            </label>
          </div>
        </div>

        {/* Security & Access Controls */}
        <div className="card" style={{ background: "var(--color-bg-primary)", display: "flex", flexDirection: "column", gap: "14px" }}>
          <span className="font-subtitle">Security Envelope &amp; DRM Policy</span>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--color-border-subtle)" }}>
              <span style={{ color: "var(--color-text-secondary)" }}>Encryption Standard:</span>
              <strong>AES-256 GCM In-Transit &amp; At-Rest</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--color-border-subtle)" }}>
              <span style={{ color: "var(--color-text-secondary)" }}>Link Expiry Window:</span>
              <strong>72 Hours (Auto-Revokes)</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--color-border-subtle)" }}>
              <span style={{ color: "var(--color-text-secondary)" }}>Access Authentication:</span>
              <strong>Date-of-Birth Challenge (DDMMYYYY)</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--color-border-subtle)" }}>
              <span style={{ color: "var(--color-text-secondary)" }}>Audit Log Hash:</span>
              <span className="font-mono-sm">DEMO-HASH-0041</span>
            </div>
          </div>

          <div style={{ marginTop: "auto" }}>
            <Btn
              fullWidth
              variant="secondary"
              icon="open_in_new"
              onClick={() => (window.location.hash = "#/delivery-tracking")}
            >
              Open Audit &amp; Revocation Manifest
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
