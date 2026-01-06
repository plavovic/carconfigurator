import React, { useState, useRef } from "react";
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import video3 from "../videos/video3.mp4";
import "./EPerformance.css";

const sections = [
  {
    title: "100% electric, 100% Performance.",
    content:
      "Whether it’s an electric or plug-in hybrid model: even in the age of electromobility, Porsche remains a Porsche – with 100% sports car DNA. For acceleration that is second to none. Torque that comes before you expect it. And an amazing feeling that can be dosed precisely."
  },
  {
    title: "Flawless Charging.",
    content:
      "Every move counts at a pit stop. The same applies when charging. That’s why we’ve reduced the manual steps to a minimum, with features like ‘Plug & Charge’ and the Porsche Charging Service. For a charging experience that’s as easy as refuelling – only more convenient."
  },
  {
    title: "Charge everywhere.",
    content:
      "With access to a comprehensive charging network and intelligent navigation, Porsche ensures effortless charging on the road, at home, and at your destination."
  },
  {
    title: "Full control.",
    content:
      "Advanced energy recuperation, precise power delivery, and intelligent driving modes give you complete control – whether on the racetrack or in everyday driving."
  }
];

const EPerformance = () => {
  const [openIndexes, setOpenIndexes] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const toggleSection = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

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
    
    <div className="advantages-page">
    <header>
        <NavBar />
    </header>
      <h1 className="title">All the advantages. Smooth Experience.</h1>

      <p className="subtitle">
        Porsche E-Performance is a comprehensive concept for emotional electric
        mobility that extends far beyond the vehicle – and is always
        characterised by pure sports car passion.
      </p>

      <div className="accordion">
        {sections.map((section, index) => {
          const isOpen = openIndexes.includes(index);

          return (
            <div key={index} className="accordion-item">
              <div
                className="accordion-header"
                onClick={() => toggleSection(index)}
              >
                <h3>{section.title}</h3>
                <span className="accordion-icon">{isOpen ? "−" : "+"}</span>
              </div>

              {isOpen && (
                <div className="accordion-content">
                  <p>{section.content}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <h1 className="smooth-waves-title">Smooth Electrified Waves.</h1>
      <div className="video-container">
        <video ref={videoRef} className="smooth-waves-video" loop>
          <source src={video3} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <button className="play-pause-btn" onClick={togglePlayPause}>
          {videoRef.current?.paused !== false ? "▶" : "⏸"}
        </button>
      </div>

      <div className="consumption">
        <h2>Electric Consumption and Emissions.</h2>
        <p>Taycan Turbo Cross Turismo: Electric energy consumption combined (model range): 21.4 – 18.9 kWh/100 km, CO₂-emissions combined (model range): 0 g/km Macan 4S Electric: Electric energy consumption combined (model range): 20.4 – 17.7 kWh/100 km (preliminary value), CO₂-emissions combined (model range): 0 g/km (preliminary value)</p>
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default EPerformance;
