import { h } from "preact";
import { useState } from "preact/hooks";
import { appState } from "../core/store.js";
import { Chip } from "../kit/Chip.jsx";
import { Btn } from "../kit/Btn.jsx";
import { DataTable } from "../kit/DataTable.jsx";
import { dispatch } from "../core/command.js";

export function DeliveryTrackingScreen() {
  const state = appState.value;

  const [manifest, setManifest] = useState([
    {
      pkgId: "PKG-8812",
      uhid: "UHID-2024-00891",
      patient: "Kamalbai Deshmukh",
      channel: "WhatsApp & SMS",
      sentAt: "10:45 AM",
      views: 2,
      lastIp: "49.36.120.4 (Kolhapur)",
      hash: "e82f1b74a3821035bda5",
      status: "Active (71h remaining)"
    },
    {
      pkgId: "PKG-8809",
      uhid: "UHID-2024-00720",
      patient: "Suresh Jadhav",
      channel: "SMS Smart-Link",
      sentAt: "09:50 AM",
      views: 1,
      lastIp: "157.34.89.12 (Pune)",
      hash: "c91fa02419082bd18821",
      status: "Active (68h remaining)"
    },
    {
      pkgId: "PKG-8798",
      uhid: "UHID-2024-00650",
      patient: "Anita Kulkarni",
      channel: "ABHA M2 Push",
      sentAt: "Yesterday",
      views: 4,
      lastIp: "ABHA Gateway",
      hash: "889b7201c9001b228912",
      status: "Archived"
    }
  ]);

  const handleRevokeLink = (pkgId) => {
    setManifest(
      manifest.map((m) =>
        m.pkgId === pkgId ? { ...m, status: "Revoked (Access Terminated)" } : m
      )
    );
    dispatch("REVOKE_DOCUMENT_LINK", { pkgId });
  };

  const columns = [
    {
      key: "pkgId",
      header: "Package ID",
      render: (val) => <span className="font-mono-sm">{val}</span>
    },
    {
      key: "patient",
      header: "Patient",
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: "600", fontSize: "13px" }}>{val}</div>
          <div className="font-caption" style={{ color: "var(--color-text-secondary)" }}>
            {row.uhid}
          </div>
        </div>
      )
    },
    {
      key: "channel",
      header: "Channel",
      render: (val) => val
    },
    {
      key: "sentAt",
      header: "Sent At",
      render: (val) => val
    },
    {
      key: "views",
      header: "Access Views",
      render: (val, row) => (
        <div>
          <strong>{val} Views</strong>
          <div className="font-caption" style={{ color: "var(--color-text-tertiary)" }}>
            IP: {row.lastIp}
          </div>
        </div>
      )
    },
    {
      key: "status",
      header: "Link Lifecycle",
      render: (val) => (
        <Chip tone={val.startsWith("Revoked") ? "plum" : val.startsWith("Active") ? "emerald" : "slate"}>
          {val}
        </Chip>
      )
    },
    {
      key: "actions",
      header: "Security Controls",
      render: (_, row) => (
        <div style={{ display: "flex", gap: "6px" }}>
          {!row.status.startsWith("Revoked") ? (
            <Btn
              size="sm"
              variant="danger"
              icon="link_off"
              onClick={() => handleRevokeLink(row.pkgId)}
            >
              Revoke
            </Btn>
          ) : (
            <Btn
              size="sm"
              variant="secondary"
              icon="replay"
              onClick={() => (window.location.hash = "#/delivery")}
            >
              Re-Issue
            </Btn>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="panel-scroll" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 className="font-h1">Digital Delivery Tracking &amp; Cryptographic Manifest</h1>
          <p className="font-body-sm" style={{ color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
            Real-time link telematics, IP access logs &amp; zero-trust revocation kill switch (SCR-22 / Frame 24)
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Btn variant="secondary" icon="arrow_back" onClick={() => (window.location.hash = "#/delivery")}>
            Delivery Center
          </Btn>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={manifest}
        emptyMessage="No digital delivery records found."
      />
    </div>
  );
}
