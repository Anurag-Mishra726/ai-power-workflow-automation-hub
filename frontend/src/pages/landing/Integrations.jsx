import Navbar from '@/components/landing/Navbar'
import './LandingInfo.css'

const Integrations = () => {
  return (
    <div className="info-page">

      <Navbar />

      <section className="info-content">
        <h1 className="info-title">Integrations</h1>
        <p className="info-subtitle">
          These integrations are currently available and planned in the FlowAI automation ecosystem.
        </p>

        <h2 className="info-title">Available Now</h2>
        <ul className="info-list">
          <li>Gemini</li>
          <li>OpenAI</li>
          <li>Perplexity</li>
          <li>Gmail</li>
          <li>Slack</li>
          <li>Google Drive</li>
          <li>Google Forms</li>
        </ul>

        <h2 className="info-title" style={{ marginTop: '24px' }}>Future Integrations</h2>
        <ul className="info-list">
          <li>GitHub (under development)</li>
          <li>Jira (pending)</li>
        </ul>
      </section>
    </div>
  )
}

export default Integrations
