import React from "react";
import TaycanImage from "../images/porschetaycan.png";
import CayenneImage from "../images/porschecayenne.png";
import MacanImage from "../images/porschemacan.png";
import NineElevenImage from "../images/porsche911.png";
import CarTags from "./CarTags";
import CardButtons from "./CardButtons";
import "./TestCarCard.css";

function TestCarCard ({ image, model, tags, stats, consumption }) {
    return (
        <div className="carcard-container">
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

            <div className="button-section">
                <CardButtons />
            </div>
        </div>
    )
}
export default TestCarCard;