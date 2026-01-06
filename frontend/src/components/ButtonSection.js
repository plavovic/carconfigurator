
import React from "react";
import { useNavigate } from "react-router-dom";
import "./ButtonSection.css";

export default function CardButtons() {
  const navigate = useNavigate();

  return (
    <div className="button-container">
      <button className="btn black-btn" onClick={() => navigate("/")}>Home</button>
      <button className="btn white-btn" onClick={() => navigate("/configurator")}>Configure</button>
    </div>
  );
}
