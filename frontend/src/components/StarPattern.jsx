import React, { useEffect, useState } from 'react'

const StarPattern = () => {

  useEffect(() => {
    const starsContainer = document.querySelector('.stars-container');
    const numStars = 100; 

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
        <div className="stars-container"></div>
    </>
  )
}

export default StarPattern
