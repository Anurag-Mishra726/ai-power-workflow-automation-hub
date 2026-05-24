import Navbar from '@/components/landing/Navbar'
import './LandingInfo.css'

const Features = () => {
  return (
    <div className="info-page">

      <Navbar />

      <section className="info-content">
        <h1 className="info-title">Project Features</h1>
        <p className="info-subtitle">
          FlowAI is built to simplify advanced automation for both technical and non-technical teams. It combines a
          visual workflow system with intelligent AI nodes so you can design, test, and operate production-ready
          workflows in one place.
        </p>

        <ul className="info-list">
          <li>Drag-and-drop visual builder to design complete workflows in minutes.</li>
          <li>Multi-step workflow graph with trigger, action, and AI decision nodes.</li>
          <li>AI provider support for Gemini, OpenAI, and Perplexity based use-cases.</li>
          <li>Reusable workflow templates to speed up common automation scenarios.</li>
          <li>Execution options for manual run, event trigger, and incoming webhooks.</li>
          <li>Live execution timeline with per-step status, runtime, and error visibility.</li>
          <li>Retry support and safer step-level control for failed workflow operations.</li>
          <li>Integration-ready actions for tools like Gmail, Slack, and Google Drive.</li>
          <li>Secure credential handling so API keys and tokens stay isolated.</li>
          <li>Workflow lifecycle controls for creating, updating, and managing versions.</li>
          <li>Scalable architecture designed for adding more integrations over time.</li>
          <li>Roadmap includes deeper GitHub and Jira automation capabilities.</li>
        </ul>
      </section>
    </div>
  )
}

export default Features
