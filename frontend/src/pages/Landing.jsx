import React from 'react'
import { useEffect } from 'react'
import './Landing.css'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import StarPattern from '../components/StarPattern'
const Landing = () => {


  return (
    <>
        <div className="landing-page">
          <StarPattern/>
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
