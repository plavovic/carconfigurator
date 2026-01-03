import React from "react";
import { colorImageLinks, wheelImageLinks911, techImageLinks911, interiorHexColors } from "../api/imageLinks";

export default function OptionCard({ option, selected, onToggle }) {
  // Rendering rules:
  // - Exterior Color: show IMAGE ONLY (no swatch)
  // - Interior: show SWATCH ONLY (use hex_color)
  // - Wheels/Technology: show IMAGE (prefer API image_url, fallback to local maps)
  const isExteriorColor = option.category === 'Exterior Color';
  const isInteriorColor = option.category === 'Interior';
  
  const isPlaceholderImage =
    typeof option.image_url === "string" && option.image_url.startsWith("/images/placeholder");

  // Exterior Color: always use the shared color image set (same visuals for all models).
  // This keeps Taycan paint images consistent with Carrera.
  let imageToShow = null;
  if (isExteriorColor) {
    imageToShow = colorImageLinks[option.name] || (!isPlaceholderImage ? (option.image_url || null) : null);
  } else {
    // Other categories: prefer backend-provided image_url when it's a real URL.
    // If backend returns a placeholder, fall back to local maps.
    imageToShow = !isPlaceholderImage ? (option.image_url || null) : null;

    if (!imageToShow) {
      if (option.category === 'Wheels') {
        imageToShow = wheelImageLinks911[option.name] || null;
      } else if (option.category === 'Technology') {
        imageToShow = techImageLinks911[option.name] || null;
      }
    }
  }

  // If we still don't have anything, use whatever the backend provided (placeholder).
  if (!imageToShow && option.image_url) {
    imageToShow = option.image_url;
  }
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
      <div style={{ 
        marginTop: 8, 
        fontSize: 16, 
        fontWeight: 600, 
        color: '#000',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        +${Number(option.price_modifier || 0).toLocaleString()}
      </div>
    </button>
  );
}
