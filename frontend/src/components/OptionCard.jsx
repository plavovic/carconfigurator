import React from "react";

export default function OptionCard({ option, selected, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="option-card"
      style={{
        padding: 12,
        border: selected ? "2px solid black" : "1px solid #ccc",
        borderRadius: 12,
        cursor: "pointer",
        minWidth: 220,
        textAlign: "left",
        background: selected ? "#f5f5f5" : "white",
      }}
    >
      {option.image_url && (
        <div style={{ marginBottom: 8 }}>
          <img
            src={option.image_url}
            alt={option.name}
            style={{ width: "100%", maxHeight: 140, objectFit: "contain", borderRadius: 8 }}
          />
        </div>
      )}
      <div style={{ fontWeight: 700 }}>{option.name}</div>
      <div style={{ fontSize: 12, color: "#555" }}>{option.description}</div>
      <div style={{ marginTop: 6 }}>+${Number(option.price_modifier || 0)}</div>
    </button>
  );
}
