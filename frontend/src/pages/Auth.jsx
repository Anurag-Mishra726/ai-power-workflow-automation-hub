import React from 'react'
import Logo from '../assets/logo.png'
import "./Auth.css"
import Signup from '../components/Signup';
import Login from '../components/Login';
import "../components/CommonAuthStyle.css"
import Button from "../components/Button"
const Auth = () => {
  return (
      <>
        <div className="auth-page flex justify-center items-center overflow-hidden relative bg-black h-screen w-screen text-white">
          <div className="bubble absolute top-5">
            <div className="form-box text-white top-20 absolute  w-[35em] ">
              <div className="logo flex justify-center items-center gap-2 mb-4">
                <img src={Logo} alt="" width={80}  />
                <h1 className='text-7xl font-semibold'><span className='web-name bg-clip-text'>FlowAI</span></h1>
              </div>
              <Signup/>
              {/* <Login/> */}
              <div className="para text-white text-center mt-5 ">Already have an account? <button className='text-gray-400 
              bg-transparent border-0 hover:underline transition-all duration-300 ease-in-out'> Login </button>
              </div>
            </div>
            
          </div>
        </div>
      </>
  )
}

export default Auth
