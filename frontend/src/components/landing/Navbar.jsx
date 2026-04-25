import './Navbar.css'
import { Link } from 'react-router-dom'
import Logo from '@/assets/logo.png'
import Button from '@/components/common/Button'

const Navbar = () => {
  return (
    <div className="navbar text-white flex items-center justify-between">
      <div className="nav-left flex items-center justify-between gap-1">
        <div className="navbar-logo">
          <img src={Logo} alt="FlowAI Logo" width={80} />
        </div>
      </div>
      <div className="nav-center ">
        <ul className=" nav-elements flex items-center justify-between gap-[40px] ">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/features" className="nav-link">Features</Link></li>
          <li><Link to="/integrations" className="nav-link">Integrations</Link></li>
          <li><Link to="/developer" className="nav-link">Developer</Link></li>
          <li><Link to="/about" className="nav-link">About</Link></li>
        </ul>
      </div>
      <div className="nav-right">
        <Button text="Get Started" to="/auth/login" />
      </div>
    </div>
  )
}

export default Navbar
