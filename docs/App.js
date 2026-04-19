import { useState, useEffect, useCallback } from "react";

const API = "http://192.168.50.92:5001/status";
const ROWS = ["A","B","C","D","E","F"];
const SPOTS_PER_ROW = 20;

function initSpots() {
  const spots = [];
  ROWS.forEach(row => {
    for(let i = 1; i <= SPOTS_PER_ROW; i++) {
      spots.push({
        id: row + i, row,
        status: "available",
        dist: 280 + Math.random() * 50,
      });
    }
  });
  return spots;
}

const CarSVG = () => (
  <svg width="32" height="44" viewBox="0 0 32 48">
    <rect x="2" y="18" width="28" height="24" rx="4" fill="#D85A30"/>
    <rect x="5" y="6" width="22" height="16" rx="4" fill="#993C1D"/>
    <rect x="3" y="36" width="7" height="7" rx="3.5" fill="#111"/>
    <rect x="22" y="36" width="7" height="7" rx="3.5" fill="#111"/>
    <rect x="7" y="22" width="18" height="7" rx="2" fill="#B5D4F4" opacity="0.6"/>
    <rect x="2" y="18" width="6" height="4" rx="1" fill="#fbbf24" opacity="0.8"/>
    <rect x="24" y="18" width="6" height="4" rx="1" fill="#fbbf24" opacity="0.8"/>
  </svg>
);

const AvailSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="11" fill="#0a1f0a" stroke="#1D9E75" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="5" fill="#1D9E75"/>
  </svg>
);

function Spot({ spot, selected, onSelect, onHover, onLeave }) {
  const occ = spot.status === "occupied";
  return (
    <div
      onClick={() => onSelect(spot.id)}
      onMouseEnter={e => onHover(e, spot)}
      onMouseLeave={onLeave}
      style={{
        width: 52, height: 68, borderRadius: 5, cursor: "pointer",
        border: `1.5px solid ${occ ? "#D85A30" : "#1D9E75"}`,
        background: occ ? "#1f0a0a" : "#0a1f0a",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 2,
        boxShadow: selected ? "0 0 0 2px white" : "none",
        transition: "transform 0.2s",
        flexShrink: 0,
      }}
    >
      <div style={{ fontSize: 9, color: "#555" }}>{spot.id}</div>
      {occ ? <CarSVG /> : <AvailSVG />}
      <div style={{ fontSize: 8, color: "#444" }}>{Math.round(spot.dist)}cm</div>
    </div>
  );
}

function Road() {
  return (
    <div style={{
      height: 30, background: "#111827", borderRadius: 4,
      display: "flex", alignItems: "center", justifyContent: "center",
      margin: "5px 0", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "50%", transform: "translateY(-50%)",
        height: 3, width: "100%",
        background: "repeating-linear-gradient(90deg,#f59e0b 0,#f59e0b 20px,transparent 20px,transparent 40px)",
        opacity: 0.4,
      }}/>
      <span style={{ fontSize: 11, color: "#f59e0b", opacity: 0.6, zIndex: 1 }}>← → Drive lane</span>
    </div>
  );
}

export default function App() {
  const [spots, setSpots] = useState(initSpots);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [clock, setClock] = useState(new Date().toLocaleTimeString());
  const [lastSync, setLastSync] = useState("--");

  useEffect(() => {
    const t = setInterval(() => setClock(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      if(data.spots) {
        setSpots(prev => prev.map(s => {
          const found = data.spots.find(x => x.spot_id === s.id);
          if(found) return { ...s, status: found.status === "OCCUPIED" ? "occupied" : "available", dist: found.distance_cm };
          return s;
        }));
        setLastSync(new Date().toLocaleTimeString());
      }
    } catch(e) {}
  }, []);

  useEffect(() => {
    fetchData();
    const t = setInterval(fetchData, 3000);
    return () => clearInterval(t);
  }, [fetchData]);

  const occ = spots.filter(s => s.status === "occupied").length;
  const avail = spots.length - occ;
  const pct = ((occ / spots.length) * 100).toFixed(1);

  const filtered = (rowSpots) => {
    if(filter === "avail") return rowSpots.filter(s => s.status === "available");
    if(filter === "occ") return rowSpots.filter(s => s.status === "occupied");
    return rowSpots;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a2e", padding: 20, fontFamily: "Arial, sans-serif", color: "white" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>Smart Parking System</div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>NKU Parking Garage — Level 1 — Real-time monitor</div>
        </div>
        <div style={{ fontSize: 11, color: "#555" }}>{clock}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Total spots", val: spots.length, color: "white" },
          { label: "Available", val: avail, color: "#1D9E75" },
          { label: "Occupied", val: occ, color: "#D85A30" },
          { label: "Occupancy rate", val: pct + "%", color: "#f59e0b" },
        ].map(s => (
          <div key={s.label} style={{ background: "#16213e", borderRadius: 10, padding: "14px 16px", border: "0.5px solid #2a2a4a" }}>
            <div style={{ fontSize: 26, fontWeight: 600, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[
          { key: "all", label: "All spots", activeColor: "#1D9E75" },
          { key: "avail", label: "Available only", activeColor: "#1D9E75" },
          { key: "occ", label: "Occupied only", activeColor: "#D85A30" },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            padding: "5px 14px", borderRadius: 20, cursor: "pointer", fontSize: 12,
            border: `0.5px solid ${filter === f.key ? f.activeColor : "#2a2a4a"}`,
            background: filter === f.key ? f.activeColor : "transparent",
            color: filter === f.key ? "white" : "#aaa",
          }}>{f.label}</button>
        ))}
      </div>

      <div style={{ background: "#16213e", borderRadius: 12, padding: 16, border: "0.5px solid #2a2a4a", overflowX: "auto" }}>
        <div style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>
          Parking lot layout — rows A–F (20 spots each)
        </div>

        {ROWS.map((row, ri) => (
          <div key={row}>
            <div style={{ fontSize: 10, color: "#555", marginBottom: 5 }}>Row {row}</div>
            <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
              {filtered(spots.filter(s => s.row === row)).map(spot => (
                <Spot
                  key={spot.id} spot={spot}
                  selected={selected === spot.id}
                  onSelect={setSelected}
                  onHover={(e, s) => setTooltip({ x: e.clientX, y: e.clientY, spot: s })}
                  onLeave={() => setTooltip(null)}
                />
              ))}
            </div>
            {ri < ROWS.length - 1 && <Road />}
          </div>
        ))}

        <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
          {[
            { bg: "#0a1f0a", border: "#1D9E75", label: "Available" },
            { bg: "#1f0a0a", border: "#D85A30", label: "Occupied" },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#666" }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: l.bg, border: `1.5px solid ${l.border}` }}/>
              {l.label}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 12, fontSize: 11, color: "#555", display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1D9E75", animation: "pulse 1.5s infinite" }}/>
        Live — last synced {lastSync}
      </div>

      {tooltip && (
        <div style={{
          position: "fixed", left: tooltip.x + 12, top: tooltip.y - 10,
          background: "#0f172a", border: "0.5px solid #2a2a4a",
          borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "white",
          pointerEvents: "none", zIndex: 999,
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Spot {tooltip.spot.id}</div>
          <div style={{ color: tooltip.spot.status === "occupied" ? "#D85A30" : "#1D9E75", marginBottom: 4 }}>
            {tooltip.spot.status === "occupied" ? "Occupied" : "Available"}
          </div>
          <div style={{ color: "#666", fontSize: 11 }}>Distance: {tooltip.spot.dist.toFixed(1)} cm</div>
        </div>
      )}

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.2}}`}</style>
    </div>
  );
}