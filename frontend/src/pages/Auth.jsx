import React from 'react'
import Logo from '../assets/logo.png'
import "./Auth.css"
import Signup from '../components/Signup';
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
            </div>
          </div>
        </div>
      </>
  )
}

export default Auth
