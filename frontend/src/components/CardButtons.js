import React from "react";
import { useNavigate } from "react-router-dom";
import "./CardButtons.css";

export default function ButtonSection({ slug }) {
  const navigate = useNavigate();
  const viewModelPath = slug ? `/model/${slug}` : '/model';

  return (
    <div className="button-container">
      <button className="btn black-btn" onClick={() => navigate(viewModelPath)}>View Model</button>
      <button className="btn white-btn" onClick={() => navigate('/configurator')}>Configure</button>
    </div>
  );
}
