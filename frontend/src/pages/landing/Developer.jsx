import Navbar from '@/components/landing/Navbar'
import StarPattern from '@/components/common/StarPattern'
import './LandingInfo.css'

const Developer = () => {
  return (
    <div className="info-page">
      <StarPattern />
      <div className="stars1"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>
      <Navbar />

      <section className="info-content">
        <h1 className="info-title">Developer</h1>
        <p className="info-subtitle">
          This project is developed by <strong>Anurag</strong>.
        </p>
        <p className="info-subtitle">
          GitHub Project Link:{' '}
          <a
            className="info-link"
            href="https://github.com/Anurag/ai-power-workflow-automation-hub"
            target="_blank"
            rel="noreferrer"
          >
            github.com/Anurag/ai-power-workflow-automation-hub
          </a>
        </p>
      </section>
    </div>
  )
}

export default Developer
