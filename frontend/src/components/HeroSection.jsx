import React from 'react'
import './HeroSection.css'
import AI_Model from '../assets/ai_model.png'
import Elements from '../assets/Elements.png'
import Beam from '../assets/Beam.png'
import Group from '../assets/group15.png'
import element from '../assets/element.png'
import Button from './Button'

const HeroSection = () => {
  return (
    <>
        <section className="hero-section">
            <div className="hero-content">
                <p className="hero-badge"><span className='inner-badge'>New</span> Latest Integration Just Arrived</p>
                <h1 className="hero-title"> Revolutionize Your <span>Workflow</span> with AI</h1>
                <p className="hero-description">
                    Experience cutting-edge solutions designed to elevate productivity and
                    deliver results like never before.
                </p>
                <button className='hero-action-btn'><Button text="Get Started" to="#" /></button>
            </div>

            <div className="hero-image">
                <div className="ai-model-img"><img src={AI_Model} alt="AI Visual" /></div>

            </div>
        </section>
    </>
  )
}

export default HeroSection
