import { useState, useEffect } from "react";

const countryBackgrounds = {
  ukraine: [
    "/images/ukraine_bg.png",
    "/images/generic_bg.png"
  ],
  israel: [
    "/images/israel_bg.png",
    "/images/generic_bg.png"
  ],
  default: [
    "/images/generic_bg.png"
  ]
};

export default function HeroSlider({ countryId }) {
  const images = countryBackgrounds[countryId] || countryBackgrounds.default;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  if (!images || images.length === 0) return null;

  return (
    <div className="hero-slider-wrapper">
      {images.map((img, idx) => (
        <div
          key={idx}
          className={`hero-slide ${idx === currentIndex ? "active" : ""}`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}
      <div className="hero-slider-overlay" />
      
      {images.length > 1 && (
        <div className="hero-slider-controls">
          <button onClick={prevSlide} className="slider-btn" title="Previous Image">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <button onClick={nextSlide} className="slider-btn" title="Next Image">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
