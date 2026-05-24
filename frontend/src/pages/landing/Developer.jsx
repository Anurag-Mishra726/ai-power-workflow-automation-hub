import Navbar from '@/components/landing/Navbar'
import './LandingInfo.css'

const Developer = () => {
  return (
    <div className="info-page">

      <Navbar />

      <section className="info-content">
        <h1 className="info-title">Developer</h1>
        <p className="info-subtitle">
          FlowAI is developed by <strong>Anurag Mishra</strong> with a focus on practical automation, clean user experience,
          and scalable integration architecture.
        </p>
        <ul className="info-list mb-4">
          <li>Building an intuitive visual automation experience for real-world workflows.</li>
          <li>Improving AI-assisted execution paths for better decision-making and task quality.</li>
          <li>Expanding integration capabilities with modern tools used by developers and teams.</li>
          <li>Maintaining a robust backend foundation for secure, dependable workflow execution.</li>
          <li>Continuously refining usability, performance, and documentation across the platform.</li>
        </ul>
        <p className="info-subtitle">
          <strong>GitHub Project Link :</strong>{' '}
          <a
            className="info-link"
            href="https://github.com/Anurag-Mishra726/ai-power-workflow-automation-hub"
            target="_blank"
            rel="noreferrer"
          >
            https://github.com/Anurag-Mishra726/ai-power-workflow-automation-hub
          </a>
        </p>
      </section>
    </div>
  )
}

export default Developer
