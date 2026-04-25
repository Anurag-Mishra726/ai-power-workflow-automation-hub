import Navbar from '@/components/landing/Navbar'
import StarPattern from '@/components/common/StarPattern'
import './LandingInfo.css'

const About = () => {
  return (
    <div className="info-page">
      <StarPattern />
      <div className="stars1"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>
      <Navbar />

      <section className="info-content">
        <h1 className="info-title">About FlowAI</h1>
        <p className="info-subtitle">
          FlowAI is a workflow automation project that combines AI and productivity integrations to help users build
          intelligent, event-driven workflows from a single platform.
        </p>
        <ul className="info-list">
          <li>Design custom automations with a visual workflow editor.</li>
          <li>Connect AI providers and productivity tools in one place.</li>
          <li>Use trigger-action logic to automate repetitive tasks.</li>
          <li>Scale routine operations with reliable, reusable workflow pipelines.</li>
        </ul>
      </section>
    </div>
  )
}

export default About
