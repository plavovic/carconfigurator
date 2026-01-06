import React, { useState, useRef } from 'react';
import './Macan.css';
import carImage from '../../images/porschemacan.png';
import carImageFront from '../../images/porschemacanf.png';
import macanVideo from '../../videos/macan.mp4';
import Counter from '../../components/Counter.js';
import ButtonSection from '../../components/ButtonSection.js';
import CarTags from '../../components/CarTags.js';
import NavBar from  '../../components/NavBar.jsx'; 
import Footer from '../../components/Footer.jsx';

function Macan() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(err => console.error('Play error:', err));
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };
  
  return (
    <div className="App">
        
        <div className="macan-heading-text">
          <h1>MACAN</h1>  
        </div>
      <div className="navbar-container">
        <NavBar />
      </div>
      <main>
        <div className="imageContent">
          <img src={carImage} alt="Car" className="centered-image"/>
        </div>
        <section className="macan-info">
          <h2>Porsche Macan</h2>
          <CarTags />
          <p>Porsche Macan is a luxury SUV produced by Porsche.</p>
          <p>From <span>$65.000</span></p>
        </section>
      <section className="macan-specifications">
      <div className="macan-specs-list">
        <p>0–100 km/h: <span><Counter target={5.7} duration={1500} suffix=" sec" /></span></p>
        <p>Top Speed: <span><Counter target={240} duration={1500} suffix=" km/h" /></span></p>
        <p>Power: <span><Counter target={440} duration={1500} suffix=" hp" />/<Counter target={328} duration={1500} suffix="kW" /></span></p>
      </div>
      </section>
      <section className="imageFrontContent">
          <img src={carImageFront} alt="Car Front" className="centered-image-front"/>
      </section>
      <section className="options">
      <ButtonSection />
      <p>Electrical energy consumption combined: 18.2 – 15.8 kWh/100 km (preliminary value), CO₂-emissions combined: 0 g/km (preliminary value)</p>
      </section>      <section className="video-section">
        <h2 className="video-title">Star of the Night.</h2>
        <div className="video-container">
          <video ref={videoRef} className="model-video" loop>
            <source src={macanVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <button className="play-pause-btn" onClick={togglePlayPause}>
            {videoRef.current?.paused !== false ? "▶" : "⏸"}
          </button>
        </div>
      </section>      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Macan;
