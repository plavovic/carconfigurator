import React, { useState, useRef } from 'react';
import './NineEleven.css';
import carImage from '../../images/porsche911.png';
import carImageFront from '../../images/porsche911f.png';
import nineelevenVideo from '../../videos/911.mp4';
import Counter from '../../components/Counter.js';
import ButtonSection from '../../components/ButtonSection.js';
import CarTags from '../../components/CarTags.js';
import NavBar from  '../../components/NavBar.jsx'; 
import Footer from '../../components/Footer.jsx';

function NineEleven() {
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
        
        <div className="nineeleven-heading-text">
          <h1>911</h1>  
        </div>
      <div className="navbar-container">
        <NavBar />
      </div>
      <main>
        <div className="imageContent">
          <img src={carImage} alt="Car" className="centered-image"/>
        </div>
        <section className="nineeleven-info">
          <h2>Porsche 911</h2>
          <CarTags />
          <p>Porsche 911 is a legendary sports car produced by Porsche.</p>
          <p>From <span>$95.000</span></p>
        </section>
      <section className="nineeleven-specifications">
      <div className="nineeleven-specs-list">
        <p>0–100 km/h: <span><Counter target={4.1} duration={1500} suffix=" sec" /></span></p>
        <p>Top Speed: <span><Counter target={294} duration={1500} suffix=" km/h" /></span></p>
        <p>Power: <span><Counter target={385} duration={1500} suffix=" hp" />/<Counter target={287} duration={1500} suffix="kW" /></span></p>
      </div>
      </section>
      <section className="imageFrontContent">
          <img src={carImageFront} alt="Car Front" className="centered-image-front"/>
      </section>
      <section className="options">
      <ButtonSection />
      <p>Fuel consumption combined: 8.1 – 7.8 l/100 km, CO₂-emissions combined: 185 – 180 g/km</p>
      </section>
      <section className="video-section">
        <h2 className="video-title">Old Fashioned.</h2>
        <div className="video-container">
          <video ref={videoRef} className="model-video" loop>
            <source src={nineelevenVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <button className="play-pause-btn" onClick={togglePlayPause}>
            {videoRef.current?.paused !== false ? "▶" : "⏸"}
          </button>
        </div>
      </section>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default NineEleven;
