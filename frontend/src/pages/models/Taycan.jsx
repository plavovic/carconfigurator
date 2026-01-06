import React, { useState, useRef } from 'react';
import './Taycan.css';
import carImage from '../../images/porschetaycan.png';
import carImageFront from '../../images/porschetaycanf.png';
import taycanVideo from '../../videos/Taycan.mp4';
import Counter from '../../components/Counter.js';
import ButtonSection from '../../components/ButtonSection.js';
import CarTags from '../../components/CarTags.js';
import NavBar from  '../../components/NavBar.jsx'; 
import Footer from '../../components/Footer.jsx';

function Taycan() {
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
        
        <div className="taycan-heading-text">
          <h1>TAYCAN</h1>  
        </div>
      <div className="navbar-container">
        <NavBar />
      </div>
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
      <section className="taycan-specifications">
      <div className="taycan-specs-list">
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
      <section className="video-section">
        <h2 className="video-title">Soul, Electrified.</h2>
        <div className="video-container">
          <video ref={videoRef} className="model-video" loop>
            <source src={taycanVideo} type="video/mp4" />
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

export default Taycan;