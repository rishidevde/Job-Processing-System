import { h } from "preact";

export function DataTable({
  columns = [], // { key, title, width, render, align }
  data = [],
  selectedRowKey,
  onRowClick,
  emptyMessage = "No records found matching current criteria.",
  className = ""
}) {
  return (
    <div className={`data-table-container ${className}`}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                style={{
                  width: col.width || "auto",
                  textAlign: col.align || "left"
                }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center", padding: "32px 16px", color: "var(--color-text-muted)" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "32px", display: "block", marginBottom: "8px" }}>
                  inbox
                </span>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => {
              const isSelected = selectedRowKey && row.key === selectedRowKey;
              return (
                <tr
                  key={row.id || row.token || rowIdx}
                  className={isSelected ? "row-selected" : ""}
                  onClick={() => onRowClick && onRowClick(row)}
                  style={{ cursor: onRowClick ? "pointer" : "default" }}
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={col.key || colIdx}
                      style={{ textAlign: col.align || "left" }}
                    >
                      {col.render ? col.render(row[col.key], row, rowIdx) : row[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
