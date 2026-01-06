import React, { useEffect, useState } from "react";
import OrderCard from "../components/OrderCard";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user: authUser, token } = useAuth();
  const [user, setUser] = useState(() => {
    try {
      return authUser || JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return authUser || null;
    }
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedToken = token || localStorage.getItem("token");
    if (!storedToken) {
      setLoading(false);
      return;
    }

    fetch("/api/users/me", {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => {
        // API may return { user, orders } or user object containing orders
        if (data.user) {
          setUser(data.user);
          setOrders(data.orders || data.user.orders || []);
        } else {
          setUser(data);
          setOrders(data.orders || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Failed to load profile");
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading profile...</div>;
  }

  if (error) {
    return <div style={{ padding: 20, color: "red" }}>{error}</div>;
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: 20, maxWidth: 960, margin: "0 auto", flex: 1, width: "100%" }}>
        <section style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ width: 72, height: 72, borderRadius: 12, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
            {user?.first_name?.[0] || user?.name?.[0] || "U"}
          </div>
          <div>
            <h2 style={{ margin: 0 }}>{user?.first_name ? `${user.first_name} ${user.last_name || ""}` : user?.name || "User"}</h2>
            <div style={{ color: "#666" }}>{user?.email}</div>
          </div>
        </section>

        <section>
          <h3>Placed Orders</h3>
          {orders && orders.length ? (
            orders.map((o) => <OrderCard key={o.id || o.order_id} order={o} />)
          ) : (
            <div style={{ color: "#666", marginTop: 8 }}>No orders found.</div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}
