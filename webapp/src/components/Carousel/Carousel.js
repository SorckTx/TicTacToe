import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import styles from './Carousel.module.css';

const images = [
  { src: "/Carousel/image.png", text: "“Absolutely love this game! Simple, fun, and addictive!”" },
  { src: "/Carousel/image1.png", text: " “The best Tic Tac Toe experience I’ve ever had.” " },
  { src: "/Carousel/image2.png", text: " “Who knew Tic Tac Toe could be this exciting? Amazing work!” " },
  { src: "/Carousel/image3.png", text: " “Incredible design and gameplay! Can’t stop playing!” " },
  { src: "/Carousel/image4.png", text: " “Perfect balance of strategy and fun. Highly recommended!” " },
  { src: "/Carousel/image5.png", text: " “I keep coming back to this game. So well-made!” " },
  { src: "/Carousel/image6.png", text: "	“Great UI, smooth animations, and a challenging CPU. Love it!” " },
  { src: "/Carousel/image7.png", text: " “This takes Tic Tac Toe to a whole new level. Brilliant!” " },
  { src: "/Carousel/image8.png", text: " “Simple yet highly addictive! The best version out there!” " },
  { src: "/Carousel/image9.png", text: " “Flawless execution! Clap Clap Clap!” " }
];

export default function Carousel() {
  const settings = {
    dots: true, 
    infinite: true, 
    speed: 500, 
    slidesToShow: 1, 
    slidesToScroll: 1, 
    autoplay: true, 
    autoplaySpeed: 3000, 
    arrows: false, 
  };

  return (
    <div className= {styles.carouselContainer}>
      <Slider {...settings}>
        {images.map((item, index) => (
          <div key={index} className= {styles.carouselSlides}>
            <img src={item.src} alt={`Imagen ${index + 1}`} className= {styles.carouselImage} />
            <p className={styles.carouselText}>{item.text}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
}