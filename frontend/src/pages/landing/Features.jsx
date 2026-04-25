import Navbar from '@/components/landing/Navbar'
import StarPattern from '@/components/common/StarPattern'
import './LandingInfo.css'

const Features = () => {
  return (
    <div className="info-page">
      <StarPattern />
      <div className="stars1"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>
      <Navbar />

      <section className="info-content">
        <h1 className="info-title">Project Features</h1>
        <p className="info-subtitle">
          FlowAI is focused on creating smart workflow automation with AI-assisted actions and trigger-based execution.
        </p>

        <ul className="info-list">
          <li>Visual workflow builder to create automation flows quickly.</li>
          <li>AI node support with Gemini, OpenAI, and Perplexity integrations.</li>
          <li>Trigger and action-based automation for tools like Gmail and Google Drive.</li>
          <li>Manual and webhook execution support for custom workflow runs.</li>
          <li>Real-time workflow execution tracking and status visibility.</li>
          <li>Workflow management with create, update, and execute capabilities.</li>
          <li>GitHub integration is currently under development.</li>
          <li>Jira integration is planned and currently pending.</li>
        </ul>
      </section>
    </div>
  )
}

export default Features
