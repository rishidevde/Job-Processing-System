import { h } from "preact";
import { useState } from "preact/hooks";
import { appState } from "../core/store.js";
import { Chip } from "../kit/Chip.jsx";
import { Btn } from "../kit/Btn.jsx";
import { DataTable } from "../kit/DataTable.jsx";
import { dispatch } from "../core/command.js";

export function OrdersScreen() {
  const state = appState.value;
  const [filterType, setFilterType] = useState("all");

  const rawOrders = state.orders || [];
  const orders = rawOrders.map((o) => ({
    ...o,
    orderId: o.id || o.orderId,
    patientName: o.patientName || (state.patients && state.patients[o.uhid]?.name) || "Mrs. Kamalbai Deshmukh"
  }));

  const filtered = orders.filter((o) => {
    if (filterType === "critical") return o.status === "Critical" || o.priority === "STAT" || o.priority === "Critical";
    if (filterType === "pending") return o.status === "Ordered" || o.status === "Sample Collected" || o.status === "In progress";
    return true;
  });

  const columns = [
    {
      key: "orderId",
      header: "Order ID",
      render: (val, row) => <span className="font-mono-sm">{val || row.id}</span>
    },
    {
      key: "patientName",
      header: "Patient",
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: "600", fontSize: "13px" }}>
            {val || (state.patients && state.patients[row.uhid]?.name) || "Mrs. Kamalbai Deshmukh"}
          </div>
          <div className="font-caption" style={{ color: "var(--color-text-secondary)" }}>
            {row.uhid}
          </div>
        </div>
      )
    },
    {
      key: "test",
      header: "Diagnostic Test / Procedure",
      render: (val) => <strong>{val}</strong>
    },
    {
      key: "priority",
      header: "Priority",
      render: (val) => (
        <Chip tone={val === "STAT" ? "red" : "slate"}>{val}</Chip>
      )
    },
    {
      key: "status",
      header: "Order Status",
      render: (val) => {
        const toneMap = {
          Ordered: "slate",
          "Sample Collected": "amber",
          Processing: "blue",
          Reported: "emerald",
          Critical: "red"
        };
        return <Chip tone={toneMap[val] || "slate"}>{val}</Chip>;
      }
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, row) => (
        <div style={{ display: "flex", gap: "6px" }}>
          {row.status === "Ordered" && (
            <Btn
              size="sm"
              variant="secondary"
              onClick={() =>
                dispatch("SAMPLE_COLLECTED", { orderId: row.orderId, uhid: row.uhid })
              }
            >
              Collect Sample
            </Btn>
          )}
          {row.status === "Sample Collected" && (
            <Btn
              size="sm"
              variant="primary"
              onClick={() => (window.location.hash = `#/lab?orderId=${row.orderId}`)}
            >
              Accession in LIS
            </Btn>
          )}
          {row.status === "Critical" && (
            <Btn
              size="sm"
              variant="danger"
              onClick={() => (window.location.hash = `#/critical?orderId=${row.orderId}`)}
            >
              Critical Desk
            </Btn>
          )}
          {row.status === "Reported" && (
            <Btn
              size="sm"
              variant="ghost"
              icon="visibility"
              onClick={() => (window.location.hash = `#/documents?uhid=${row.uhid}`)}
            >
              View Report
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
          <h1 className="font-h1">Central Clinical Orders Tracking</h1>
          <p className="font-body-sm" style={{ color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
            Diagnostics, radiology &amp; nursing procedure request tracker (SCR-16 / Frame 18)
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Btn
            variant={filterType === "all" ? "primary" : "secondary"}
            onClick={() => setFilterType("all")}
          >
            All Orders ({orders.length})
          </Btn>
          <Btn
            variant={filterType === "pending" ? "primary" : "secondary"}
            onClick={() => setFilterType("pending")}
          >
            Pending Phlebotomy
          </Btn>
          <Btn
            variant={filterType === "critical" ? "primary" : "secondary"}
            onClick={() => setFilterType("critical")}
          >
            Critical Stat Alerts
          </Btn>
        </div>
      </div>

      {/* Orders Table */}
      <DataTable
        columns={columns}
        data={filtered}
        emptyMessage="No clinical orders matching this filter."
      />
    </div>
  );
}
