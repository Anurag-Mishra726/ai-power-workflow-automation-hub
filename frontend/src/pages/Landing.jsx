import React from 'react'
import { useEffect } from 'react'
import './Landing.css'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'

const Landing = () => {

  useEffect(() => {
    const starsContainer = document.querySelector('.stars-container');
    const numStars = 150; 

    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div');
      star.classList.add('star');

      const size = Math.random() * 1 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;

      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;

      star.style.animationDelay = `${Math.random() * 5}s`;

      starsContainer.appendChild(star);
    }
  }, []);

  return (
    <>
        <div className="landing-page">
          <div className="stars-container"></div>
          <div className="stars1"></div>
          <div className="stars2"></div>
          <div className="stars3"></div>

            <Navbar/>
            <HeroSection/>
        </div>
    </>
  )
}

export default Landing
