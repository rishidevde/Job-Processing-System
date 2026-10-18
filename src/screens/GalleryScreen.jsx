import { h } from "preact";
import { useState } from "preact/hooks";
import { FRAMES } from "../registry/frames.js";
import { Chip } from "../kit/Chip.jsx";
import { Btn } from "../kit/Btn.jsx";

export function GalleryScreen() {
  const [selectedTrack, setSelectedTrack] = useState("all");
  const [search, setSearch] = useState("");

  const track1 = FRAMES.slice(0, 15); // Frames 01 - 15
  const track2 = FRAMES.slice(15, 25); // Frames 16 - 25
  const track3 = FRAMES.slice(25, 38); // Frames 26 - 38

  const filterList = (list) => {
    return list.filter((f) => {
      const q = search.toLowerCase();
      return (
        f.title.toLowerCase().includes(q) ||
        f.id.toLowerCase().includes(q) ||
        f.role.toLowerCase().includes(q) ||
        f.invariant.toLowerCase().includes(q)
      );
    });
  };

  const renderFrameCard = (f) => (
    <div
      key={f.id}
      className="card"
      style={{
        background: "var(--color-bg-primary)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "16px",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        border: "1px solid var(--color-border-subtle)"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="font-subtitle-sm" style={{ color: "var(--color-interactive-primary)", fontWeight: "800" }}>
            Frame {f.frame}
          </span>
          <Chip tone="slate">{f.time}</Chip>
        </div>
        <Chip tone={f.role === "Doctor" ? "blue" : f.role === "Nurse" ? "emerald" : "slate"}>
          {f.role}
        </Chip>
      </div>

      <div style={{ fontWeight: "700", fontSize: "14px", lineHeight: "1.4" }}>
        {f.title}
      </div>

      <div className="font-caption" style={{ color: "var(--color-text-secondary)", lineHeight: "1.5" }}>
        <strong>Invariant:</strong> {f.invariant}
      </div>

      <div style={{ marginTop: "auto", paddingTop: "8px", borderTop: "1px solid var(--color-border-subtle)" }}>
        <Btn
          fullWidth
          variant="primary"
          icon="arrow_forward"
          onClick={() => {
            window.location.hash = f.route;
          }}
        >
          Launch Live Frame {f.frame}
        </Btn>
      </div>
    </div>
  );

  return (
    <div className="panel-scroll" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h1 className="font-h1">38-Frame Master Architecture Visual Matrix</h1>
            <Chip tone="emerald">All 38 Canonical Frames Active</Chip>
          </div>
          <p className="font-body-sm" style={{ color: "var(--color-text-secondary)", margin: "4px 0 0" }}>
            Comprehensive visual gallery with 1-click teleportation to any frame, scenario checkpoint or safety interlock
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            className="input-base"
            placeholder="Search frames by role, invariant, ID..."
            style={{ width: "260px" }}
            value={search}
            onInput={(e) => setSearch(e.target.value)}
          />
          <Btn variant="secondary" icon="hub" onClick={() => (window.location.hash = "#/system")}>
            Developer Architecture Portal
          </Btn>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--color-border-subtle)", paddingBottom: "8px" }}>
        <Btn
          variant={selectedTrack === "all" ? "primary" : "ghost"}
          onClick={() => setSelectedTrack("all")}
        >
          All Frames (38)
        </Btn>
        <Btn
          variant={selectedTrack === "track1" ? "primary" : "ghost"}
          onClick={() => setSelectedTrack("track1")}
        >
          Track 1: Canonical Happy Path (01–15)
        </Btn>
        <Btn
          variant={selectedTrack === "track2" ? "primary" : "ghost"}
          onClick={() => setSelectedTrack("track2")}
        >
          Track 2: Operational Workbenches (16–25)
        </Btn>
        <Btn
          variant={selectedTrack === "track3" ? "primary" : "ghost"}
          onClick={() => setSelectedTrack("track3")}
        >
          Track 3: Edge Cases &amp; Interlocks (26–38)
        </Btn>
      </div>

      {/* Track 1 */}
      {(selectedTrack === "all" || selectedTrack === "track1") && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="font-subtitle">Track 1: Primary Happy Path Encounter (09:00 AM &ndash; 11:30 AM)</span>
            <Chip tone="slate">Frames 01 to 15</Chip>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
            {filterList(track1).map(renderFrameCard)}
          </div>
        </div>
      )}

      {/* Track 2 */}
      {(selectedTrack === "all" || selectedTrack === "track2") && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="font-subtitle">Track 2: Secondary Operational Workbenches</span>
            <Chip tone="slate">Frames 16 to 25</Chip>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
            {filterList(track2).map(renderFrameCard)}
          </div>
        </div>
      )}

      {/* Track 3 */}
      {(selectedTrack === "all" || selectedTrack === "track3") && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="font-subtitle">Track 3: Critical Edge Cases, Interlocks &amp; Branching Protocols</span>
            <Chip tone="slate">Frames 26 to 38</Chip>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
            {filterList(track3).map(renderFrameCard)}
          </div>
        </div>
      )}
    </div>
  );
}
