import React from 'react'
import './HeroSection.css'
import AI_Model from '../assets/LandingPageAssets/ai_model.png'
import Beam from '../assets/LandingPageAssets/Beam.png'
import Beam2 from '../assets/LandingPageAssets/Beam2.png'
import Wave from '../assets/LandingPageAssets/Waves.png'
import Button from './Button'

const HeroSection = () => {
  return (
    <>
        <section className="hero-section">
            <div className="hero-content">
                <p className="hero-badge"><span className='inner-badge'>New</span> Latest Integration Just Arrived</p>
                <h1 className="hero-title"> Revolutionize Your <span>Workflow</span> with <span className='under-line'>FlowAI</span></h1>
                <p className="hero-description">
                    Experience cutting-edge solutions designed to elevate productivity and
                    deliver results like never before.
                </p>
                <button className='hero-action-btn'><Button text="Get Started" to="/auth/login" /></button>
            </div>

            <div className="hero-image">
                <div className="ai-model-img">
                    <img src={AI_Model} alt="AI Visual" />
                    <div className="model-glow1"></div>
                </div>
                <div className="layers">
                    <img src={Beam2} alt="" className='layer1' />
                    <img src={Wave} alt="" className='layer2'/>
                    <img src={Beam} alt="" className='layer3' />
                </div>
            </div>
            <div className='gradient-bg'></div>
        </section>
    </>
  )
}

export default HeroSection
