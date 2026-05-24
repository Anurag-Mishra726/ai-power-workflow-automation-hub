import Navbar from '@/components/landing/Navbar'
import './LandingInfo.css'

const About = () => {
  return (
    <div className="info-page">

      <Navbar />

      <section className="info-content">
        <h1 className="info-title">About FlowAI</h1>
        <p className="info-subtitle">
          FlowAI is a modern workflow automation platform that helps users transform repetitive tasks into reliable,
          intelligent automation pipelines. It combines AI reasoning, trigger-based execution, and app integrations so
          teams can move faster with less manual effort.
        </p>
        <ul className="info-list">
          <li>Our mission is to make workflow automation accessible without sacrificing power.</li>
          <li>Users can orchestrate business logic, AI prompts, and app actions in a unified flow.</li>
          <li>FlowAI supports iterative building so workflows can be improved safely over time.</li>
          <li>The platform is designed for productivity, operations, support, and developer workflows.</li>
          <li>Event-driven architecture enables fast response to external app updates and triggers.</li>
          <li>Observability tools help teams understand run quality and optimize process performance.</li>
          <li>Integration-first design allows organizations to connect existing tools instead of replacing them.</li>
          <li>FlowAI grows with your team, from quick internal automations to mission-critical processes.</li>
        </ul>
      </section>
    </div>
  )
}

export default About
