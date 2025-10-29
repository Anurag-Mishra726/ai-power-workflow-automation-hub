import React from 'react'
import './Landing.css'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'


const Landing = () => {
  return (
    <>
        <div className="landing-page">
            <Navbar/>
            <HeroSection/>
        </div>
    </>
  )
}

export default Landing
