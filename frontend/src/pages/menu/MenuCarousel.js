import React, { Suspense, useState, useRef, lazy } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import '../../styles/menu.css';

const MenuMain1 = lazy(() => import("./MenuPage1"));
const MenuMain2 = lazy(() => import("./MenuPage2"));
const MenuMain3 = lazy(() => import("./MenuPage3"));

// Carousel Functionality for Menu Board
const MenuCarousel = () => {

  // Play/Pause State
  const [play, setPlay] = useState(true);
  // Ref to access slick fcns
  const carouselRef = useRef(null);

  var settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: false,
  };

  const toggleAutoplay = () => {
    setPlay(!play);
    if (carouselRef.current) {
      play ? carouselRef.current.slickPause() : carouselRef.current.slickPlay();
    }
  };

  return (
    <div className="fullscreen-menu">
      <Suspense fallback={<div>Loading menu...</div>}>
        <Slider ref={carouselRef} {...settings}>
          <div><MenuMain1 /></div>
          <div><MenuMain2 /></div>
          <div><MenuMain3 /></div>
        </Slider>
      </Suspense>

      <button className="carousel-button" onClick={toggleAutoplay}>
        {play ? "Autoplay On" : "Autoplay Off"}
      </button>

    </div>

  );
};

export default MenuCarousel;
