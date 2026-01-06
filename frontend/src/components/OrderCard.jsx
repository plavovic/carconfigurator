import React from "react";
import StatusSteps from "./StatusSteps";

function formatDate(input) {
  try {
    const d = new Date(input);
    return d.toLocaleString();
  } catch {
    return input;
  }
}

export default function OrderCard({ order }) {
  const id = order.id || order.order_id || "-";
  const createdAt = order.created_at || order.createdAt || order.date || "";
  const status = (order.status || order.order_status || "PENDING").toUpperCase();
  const car = order.car_name || order.model_name || order.configuration?.model || order.configuration?.car_name || (order.configuration && order.configuration.title) || "-";
  const color = order.color || order.colour || order.configuration?.color || order.configuration?.colour || order.configuration?.exteriorColor || "-";
  const total = order.total_amount ?? order.total ?? null;

  return (
    <div style={{ border: "1px solid #e6e6e6", borderRadius: 8, padding: 16, marginBottom: 12, background: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, color: "#888" }}>Order ID</div>
          <div style={{ fontWeight: 600 }}>{id}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, color: "#888" }}>Created</div>
          <div>{formatDate(createdAt)}</div>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 13, color: "#888" }}>Model</div>
        <div style={{ fontWeight: 700 }}>{car}</div>
        <div style={{ marginTop: 4, fontSize: 13 }}>
          <span style={{ fontWeight: 600 }}>Color:</span> {color}
        </div>
        {total != null && (
          <div style={{ marginTop: 4, fontSize: 13 }}>
            <span style={{ fontWeight: 600 }}>Price:</span> ${Number(total).toLocaleString()}
          </div>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 6 }}>Order status</div>
        <StatusSteps status={status} />
      </div>
    </div>
  );
}
