import React from 'react';  
import "./CarCard.css";
import CarTags from '../components/CarTags.js';
import CardButtons from '../components/CardButtons.js';
import TaycanImage from '../images/porschetaycan.png';

function CarCard () {
    return (
        <div className="carcard-container">
            <div className="image-container">
                <img src={TaycanImage} alt="car image" className="image" />
            </div>
            <div className="model-name">
                <h1>Taycan</h1>
            </div>
            <div className="car-tags">
                <CarTags />
            </div>
            <div className="model-info">
                <p>3.7s<span>Acceleration 0-100km/h with Launch Control</span></p>
                <p>616hp<span>Overboost Power with Launch Control up to (hp)</span></p>
                <p>250km/h<span>Top Speed</span></p>
            </div>
            <div className="fuel-consumption">
            <p>(Performance Battery) Electric energy consumption combined (model range): 20.1 – 17.6 kWh/100 km, CO₂-emissions combined (model range): 0 g/km</p>
            </div>
            <div className="button-section">
                <CardButtons />
            </div>

        </div>
    )
}

export default CarCard;