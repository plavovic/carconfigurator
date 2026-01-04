import React from "react";
import { useNavigate } from "react-router-dom";
import "./CardButtons.css";

export default function ButtonSection() {
  const navigate = useNavigate();

  return (
    <div className="button-container">
      <button className="btn black-btn" onClick={() => navigate('/model')}>View Model</button>
      <button className="btn white-btn" onClick={() => navigate('/configurator')}>Configure</button>
    </div>
  );
}
