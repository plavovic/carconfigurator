import React from 'react';
import { useState, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";


import './App.css';


import backgroundVideo from './videos/backgroundvideo.mp4';
import carImage from './images/porschetaycan.png';
import carImageFront from './images/porschetaycanf.png';
import Counter from './components/Counter.js';
import ButtonSection from './components/ButtonSection.js';
import ImageCarousel from './components/ImageCarousel.js';
import CarTags from './components/CarTags.js';


  
function App() {
  
  return (
    <div className="App">
        
        <div className="video-container">
          <h1>TAYCAN</h1>
          {/*<video autoPlay muted loop className="background-video">
          <source src={backgroundVideo} type="video/mp4" />
          </video>*/}
        </div>
        <header>
          <h1 href="#">Car Configurator</h1>
        </header>
      <main>
        <div className="imageContent">
          <img src={carImage} alt="Car" className="centered-image"/>
        </div>
        <section className="taycan-info">
          <h2>Porsche Taycan</h2>
          <CarTags />
          <p>Porsche Taycan is an all-electric car produced by Porsche.</p>
          <p>From <span>103.000 €</span></p>
        </section>
      <section className="specifications">
      <div className="specs-list">
        <p>0–100 km/h: <span><Counter target={3.1} duration={1500} suffix=" sec" /></span></p>
        <p>Top Speed: <span><Counter target={260} duration={1500} suffix=" km/h" /></span></p>
        <p>Power: <span><Counter target={616} duration={1500} suffix=" hp" />/<Counter target={459} duration={1500} suffix="kW" /></span></p>
      </div>
      </section>
      <section className="imageFrontContent">
          <img src={carImageFront} alt="Car Front" className="centered-image-front"/>
      </section>
      <section className="options">
      <ButtonSection />
      <p>Electrical energy consumptioncombined: 19.1 – 16.7 kWh/100 km (preliminary value), CO₂-emissions combined: 0 g/km (preliminary value)</p>
      </section>
      {/*<section className="tech-note">
        <h3>Explore the Deepness.</h3>
        <ImageCarousel />
      </section>*/}
      </main>
      <footer>
      </footer>
    </div>
  );
}

export default App;