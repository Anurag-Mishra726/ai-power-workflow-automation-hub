import './Landing.css'
import Navbar from '../../components/landing/Navbar'
import HeroSection from '../../components/landing/HeroSection'
import StarPattern from '../../components/common/StarPattern'
const Landing = () => {


  return (
    <>
        <div className="landing-page">
          <StarPattern/>
          <div className="stars1"></div>
          <div className="stars2"></div>
          <div className="stars3"></div>

            <Navbar/>
            <HeroSection/>
        </div>
    </>
  )
}

export default Landing
