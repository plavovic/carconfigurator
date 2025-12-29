import React from "react";

export default function ModelCard({ model, image, selected, onSelect }) {
  const price = Number(model.base_price || 0);
  
  // Use API-generated image if available, otherwise fallback to provided image
  const imageUrl = model.images?.threeQuarter || model.image_url || image;

  return (
    <button
      className="model-card"
      onClick={onSelect}
      aria-pressed={selected}
      style={{
        width: 360,
        maxWidth: "100%",
        borderRadius: 20,
        border: selected ? "2px solid black" : "1px solid #ddd",
        background: "white",
        padding: 16,
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <img
          src={imageUrl}
          alt={model.name}
          style={{ width: "100%", maxHeight: 180, objectFit: "contain" }}
          onError={(e) => {
            // Fallback to provided image if API image fails
            if (e.target.src !== image) {
              e.target.src = image;
            }
          }}
        />
      </div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>{model.name}</div>
      <div style={{ color: "#555", marginTop: 6 }}>From ${price.toLocaleString()}</div>
    </button>
  );
}
