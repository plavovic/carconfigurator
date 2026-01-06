import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

const STATUS_OPTIONS = ["PENDING", "IN_PREPARATION", "READY_FOR_TEST"];

export default function Admin() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isAdmin = useMemo(() => user?.role === "admin" || user?.email === "admin@admin.com", [user]);

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    fetch("/api/admin/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load orders");
        setLoading(false);
      });
  }, [isAdmin, token]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");
      setOrders((prev) => prev.map((o) => (o.id === id ? data.order : o)));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const deleteOrder = async (id) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete");
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  if (!isAdmin) {
    return <div style={{ padding: 20 }}>Unauthorized</div>;
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Loading admin panel...</div>;
  }

  return (
    <div style={{ padding: 20, marginTop: 64 }}>
      <h2>Admin Panel</h2>
      {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
              <th>Order #</th>
              <th>User ID</th>
              <th>Model</th>
              <th>Color</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{order.order_number}</td>
                <td>{order.user_id}</td>
                <td>{order.model_name || "-"}</td>
                <td>{order.color || "-"}</td>
                <td>{order.total_amount != null ? `$${Number(order.total_amount).toFixed(2)}` : "-"}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button onClick={() => deleteOrder(order.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
