import React from 'react'
import './Navbar.css'
import {Link} from 'react-router-dom'
import Logo from '../../assets/logo.png'
import Button from '../common/Button'

const Navbar = () => {
  return (
    <>
        <div className="navbar text-white flex items-center justify-between">
            <div className='nav-left flex items-center justify-between gap-1'>
                <div className="navbar-logo">
                    <img src={Logo} alt="FlowAI Logo" width={80}/>
                </div>
            </div>
            <div className="nav-center ">
                <ul className=' nav-elements flex items-center justify-between gap-[40px] '>
                    <li><Link to="#" className='nav-link' onClick={(e) => e.preventDefault()}>Home</Link></li>
                    <li><Link to="#" className='nav-link' onClick={(e) => e.preventDefault()}>Features</Link></li>
                    <li><Link to="#" className='nav-link' onClick={(e) => e.preventDefault()}>Integrations</Link></li>
                    <li><Link to="#" className='nav-link' onClick={(e) => e.preventDefault()}>Developers</Link></li>
                    <li><Link to="#" className='nav-link' onClick={(e) => e.preventDefault()}>About</Link></li>
                </ul>
            </div>
            <div className="nav-right">
                <button className='get-started-btn '><Button text="Get Started" to="/auth/login" /> </button>
            </div>
        </div>
    </>
  )
}

export default Navbar
