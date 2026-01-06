import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import user_icon from "../assets/user.svg";
import email_icon from "../assets/email.svg";
import password_icon from "../assets/password.svg";
import "./Login.css";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [action, setAction] = useState("Login"); // "Login" or "Sign Up"
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(""); // Added last name state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async () => {
    setError("");

    // Validation for Sign Up
    if (action === "Sign Up" && (!firstName.trim() || !lastName.trim())) {
      setError("First and Last name are required.");
      return;
    }

    const registerUrl = "http://localhost:5000/api/users/register";
    const loginUrl = "http://localhost:5000/api/users/login";

    try {
      if (action === "Login") {
        const res = await fetch(loginUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");
        try {
          login({ token: data.token, user: data.user });
        } catch {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        const dest = data.user?.role === "admin" || data.user?.email === "admin@admin.com" ? "/admin" : "/";
        navigate(dest);
      } else {
        const registerRes = await fetch(registerUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password }),
        });
        const registerData = await registerRes.json();
        if (!registerRes.ok) throw new Error(registerData.message || "Registration failed");

        // Immediately log in after successful registration
        const res = await fetch(loginUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");
        try {
          login({ token: data.token, user: data.user });
        } catch {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        // reset fields and go home
        setAction("Login");
        setFirstName("");
        setLastName("");
        setPassword("");
        setEmail("");
        const dest = data.user?.role === "admin" || data.user?.email === "admin@admin.com" ? "/admin" : "/";
        navigate(dest);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-background">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-text">{action}</div>
          <div className="auth-underline"></div>
        </div>

        <div className="auth-form-wrapper">
          {action === "Sign Up" && (
            <>
              <div className="auth-input">
                <img src={user_icon} alt="" />
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="auth-input">
                <img src={user_icon} alt="" />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="auth-input">
            <img src={email_icon} alt="" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-input">
            <img src={password_icon} alt="" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {action === "Login" && (
          <div className="auth-forgot-password">
            Forgot Password? <span>Click Here</span>
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="auth-submit-container">
          <div className="auth-submit" onClick={handleSubmit}>
            {action}
          </div>

          <div
            className="auth-submit auth-gray"
            onClick={() =>
              setAction(action === "Login" ? "Sign Up" : "Login")
            }
          >
            {action === "Login" ? "Sign Up" : "Login"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
