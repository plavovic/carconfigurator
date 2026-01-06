import React, { useState, useRef } from 'react';
import "./HomePage.css";

import TestCarCard from '../components/TestCarCard';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import MapView from '../components/MapView';
import ImageCarousel from '../components/ImageCarousel';
import ChatBotWidget from '../components/ChatBotWidget';
import video1 from '../videos/video1.mp4';

import TaycanImage from "../images/porschetaycan.png";
import CayenneImage from "../images/porschecayenne.png";
import MacanImage from "../images/porschemacan.png";
import NineElevenImage from "../images/porsche911.png";


function HomePage () {
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
    <div className="container">
        <ChatBotWidget />
        <header className="navbar-container">    
            <NavBar />
        </header>
        
        {/* White decorative background canvas */}
        <div className="body-container">
            <div className="header-section">
                <h1>Configure Your Vehicle.</h1>
            </div>
        </div>
        
        {/* Cars overlay - spans full screen */}
        <div className="cars-grid">
        <TestCarCard 
        image={TaycanImage}
        model="Taycan"
        to="/model/taycan"
        slug="taycan"
        tags={["Electric", "Sedan", "All-Wheel Drive"]}
        stats={[
          { value: "3.7s", label: "Acceleration 0–100 km/h" },
          { value: "616hp", label: "Overboost Power" },
          { value: "250km/h", label: "Top Speed" }
        ]}
        consumption="Electric energy consumption: 20.1 – 17.6 kWh/100 km, CO₂: 0 g/km"
        />
      
        <TestCarCard 
        image={CayenneImage}
        model="Cayenne"
        to="/model/cayenne"
        slug="cayenne"
        tags={["Gasoline","SUV", "Automatic"]} 
        stats={[
          { value: "4.9s", label: "Acceleration 0–100 km/h" },
          { value: "470hp", label: "Max Power" },
          { value: "253km/h", label: "Top Speed" }
        ]}
        consumption="Electrical energy consumption combined: 19.1 – 16.7 kWh/100 km (preliminary value), CO₂-emissions combined: 0 g/km (preliminary value)"
        />

        <TestCarCard 
        image={NineElevenImage}
        model="911 Carrera"
        to="/model/911"
        slug="911"
        tags={[ "Gasoline", "Coupe", "Automatic"]}
        stats={[
          { value: "4.2s", label: "Acceleration 0–100 km/h" },
          { value: "385hp", label: "Power" },
          { value: "293km/h", label: "Top Speed" }
        ]}
        consumption="Fuel consumption combined (model range): 10.5 – 9.9 l/100 km, CO₂: 240 – 226 g/km"
        />

        <TestCarCard 
        image={MacanImage}
        model="Macan"
        to="/model/macan"
        slug="macan"
        tags={["Electric","Compact SUV", "Automatic"]}
        stats={[
          { value: "4.6s", label: "Acceleration 0–100 km/h" },
          { value: "440hp", label: "Power" },
          { value: "270km/h", label: "Top Speed" }
        ]}
        consumption="Electric energy consumption combined (model range): 19.3 – 16.7 kWh/100 km, CO₂: 0 g/km"
        />
        </div>
      <div className="img-carousel-container">
        <h1>Explore Elegance In Action.</h1>
        
        <ImageCarousel />

      </div>     
      <div className="video-section-home">
        <h1>Driven by Music. Engineered for Impact.</h1>
        <div className="video-container-home">
          <video ref={videoRef} className="homepage-video" loop>
            <source src={video1} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <button className="play-pause-btn-home" onClick={togglePlayPause}>
            {videoRef.current?.paused !== false ? "▶" : "⏸"}
          </button>
        </div>
      </div>
      <div className="map-container">
        <h1>Find Us.</h1>
        <div className="map">
        <MapView />
        </div>
        
      </div>
      <footer className="footer-container">
        <Footer />
      </footer>
    </div>
    )
}

export default HomePage;