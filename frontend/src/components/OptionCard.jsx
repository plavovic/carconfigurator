import React from "react";
import { colorImageLinks, wheelImageLinks911, techImageLinks911, interiorHexColors } from "../api/imageLinks";

export default function OptionCard({ option, selected, onToggle }) {
  // Rendering rules:
  // - Exterior Color: show IMAGE ONLY (no swatch)
  // - Interior: show SWATCH ONLY (use hex_color)
  // - Wheels/Technology: show IMAGE (from DB or fallback)
  const isExteriorColor = option.category === 'Exterior Color';
  const isInteriorColor = option.category === 'Interior';
  
  // Determine fallback image by category/name
  let fallbackImage = null;
  if (option.category === 'Exterior Color') {
    fallbackImage = colorImageLinks[option.name] || null;
  } else if (option.category === 'Wheels') {
    fallbackImage = wheelImageLinks911[option.name] || null;
  } else if (option.category === 'Technology') {
    fallbackImage = techImageLinks911[option.name] || null;
  }

  const imageToShow = option.image_url || fallbackImage || null;
  const hex = option.hex_color || interiorHexColors[option.name] || "#ddd";

  return (
    <button
      onClick={onToggle}
      className="option-card"
      style={{
        padding: 12,
        border: selected ? "2px solid black" : "1px solid #ccc",
        borderRadius: 12,
        cursor: "pointer",
        textAlign: "left",
        background: selected ? "#f5f5f5" : "white",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {isInteriorColor ? (
        <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 50,
              height: 50,
              backgroundColor: hex,
              border: "1px solid #ccc",
              borderRadius: 8,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
            aria-label={`${option.name} color swatch`}
          />
        </div>
      ) : imageToShow && (
        <div style={{ marginBottom: 8 }}>
          <img
            src={imageToShow}
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
