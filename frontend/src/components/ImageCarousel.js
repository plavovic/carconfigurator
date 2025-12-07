import React, { useState } from "react";
import "./ImageCarousel.css";

// Updated image imports
import img1 from "../images/taycan-motor1.jpg";
import img2 from "../images/taycanmovement.webp";
import img3 from "../images/taycanaerodynamics1.jpg";
import img4 from "../images/taycanaerodynamics2.jpg";

const slides = [
  {
    image: img1,
    title: "Explore the extraordinary",
    description: "Experience the perfect blend of design, comfort, and performance.",
  },
  {
    image: img2,
    title: "Dive into the difference",
    description: "Every detail is crafted to make your drive unforgettable.",
  },
  {
    image: img3,
    title: "Step beyond the ordinary",
    description: "Innovation meets luxury in every curve and corner.",
  },
  {
    image: img4,
    title: "Discover pure innovation",
    description: "Redefining what it means to drive with confidence and style.",
  },
];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="carousel-container">
      <button className="arrow left-arrow" onClick={prevSlide}>
        &#10094;
      </button>

      <div className="carousel-wrapper">
        <div
          className="carousel-inner"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div className="carousel-slide" key={index}>
              <img src={slide.image} alt={slide.title} className="carousel-image" />
              <div className="carousel-text">
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="arrow right-arrow" onClick={nextSlide}>
        &#10095;
      </button>
    </div>
  );
}