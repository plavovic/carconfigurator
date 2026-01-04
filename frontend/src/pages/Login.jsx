import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import user_icon from "../assets/user.svg";
import email_icon from "../assets/email.svg";
import password_icon from "../assets/password.svg";
import "./Login.css";

const AuthPage = () => {
  const navigate = useNavigate();

  const [action, setAction] = useState("Login"); // "Login" or "Sign Up"
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(""); // Added last name state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    // Validation for Sign Up
    if (action === "Sign Up" && (!firstName.trim() || !lastName.trim())) {
      setError("First and Last name are required.");
      return;
    }

    const url =
      action === "Login"
        ? "http://localhost:5000/api/users/login"
        : "http://localhost:5000/api/users/register";

    const body =
      action === "Login"
        ? { email, password }
        : { first_name: firstName, last_name: lastName, email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || `${action} failed`);

      if (action === "Login") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/"); // redirect after login
      } else {
        alert("Registration successful! Please login.");
        setAction("Login");
        setFirstName("");
        setLastName("");
        setPassword("");
        setEmail("");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="background">
      <div className="container">
        <div className="header">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>

        <div className="form-wrapper">
          {action === "Sign Up" && (
            <>
              <div className="input">
                <img src={user_icon} alt="" />
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="input">
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

          <div className="input">
            <img src={email_icon} alt="" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input">
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
          <div className="forgot-password">
            Forgot Password? <span>Click Here</span>
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="submit-container">
          <div className="submit" onClick={handleSubmit}>
            {action}
          </div>

          <div
            className="submit gray"
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
