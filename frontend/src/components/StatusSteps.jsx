import React from "react";

const STAGES = [
  { key: "PENDING", label: "Pending" },
  { key: "IN_PREPARATION", label: "In preparation" },
  { key: "READY_FOR_TEST", label: "Car is ready to test" },
];

const STAGE_COLORS = {
  PENDING: "#F05454", // requested pending color
  IN_PREPARATION: "#E9A63A", // softer yellow
  READY_FOR_TEST: "#2b8aef", // keep existing blue
};

export default function StatusSteps({ status }) {
  const currentIndex = Math.max(0, STAGES.findIndex((s) => s.key === status));

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
      {STAGES.map((s, idx) => {
        const stageColor = STAGE_COLORS[s.key] || "#2b8aef";
        const isCurrent = idx === currentIndex;
        return (
          <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isCurrent ? stageColor : "#e6e6e6",
              color: isCurrent ? "white" : "#666",
              fontSize: 12,
            }}>{idx + 1}</div>
            <div style={{ fontSize: 13, color: isCurrent ? "#222" : "#888", minWidth: 120 }}>{s.label}</div>
            {idx < STAGES.length - 1 && (
              <div style={{ width: 40, height: 2, background: "#e6e6e6" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
