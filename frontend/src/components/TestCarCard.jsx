import React from "react";
import { useNavigate, Link } from "react-router-dom";
import CarTags from "./CarTags";
import CardButtons from "./CardButtons";
import "./TestCarCard.css";

function TestCarCard ({ image, model, tags, stats, consumption, to, slug }) {
    const navigate = useNavigate();
    const goToModel = () => { if (to) navigate(to); };
    return (
        <div className="carcard-container" onClick={goToModel} style={{cursor: to ? 'pointer' : 'default'}}>
            {to ? (
              <Link to={to} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div className="image-container">
                    <img src={image} alt={model} className="image" />
                </div>

                <div className="model-name">
                    <h1>{model}</h1>
                </div>

                <div className="car-tags">
                    <CarTags tags={tags} />
                </div>

                <div className="model-info">
                    {stats.map((item, index) => (
                        <p key={index}>
                            {item.value}
                            <span>{item.label}</span>
                        </p>
                    ))}
                </div>

                <div className="fuel-consumption">
                    <p>{consumption}</p>
                </div>
              </Link>
            ) : (
              <>
                <div className="image-container">
                    <img src={image} alt={model} className="image" />
                </div>

                <div className="model-name">
                    <h1>{model}</h1>
                </div>

                <div className="car-tags">
                    <CarTags tags={tags} />
                </div>

                <div className="model-info">
                    {stats.map((item, index) => (
                        <p key={index}>
                            {item.value}
                            <span>{item.label}</span>
                        </p>
                    ))}
                </div>

                <div className="fuel-consumption">
                    <p>{consumption}</p>
                </div>
              </>
            )}

            <div className="button-section" onClick={(e) => e.stopPropagation()}>
                <CardButtons slug={slug} />
            </div>
        </div>
    )
}
export default TestCarCard;