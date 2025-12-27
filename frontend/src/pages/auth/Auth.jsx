// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom';
// import Logo from '../../assets/logo.png'
// import "./Auth.css"
// import StarPattern from '../../components/StarPattern';
// import Signup from '../../components/Signup';
// import Login from '../../components/Login';
// import "../../components/CommonAuthStyle.css"


// const Auth = ({type}) => {

//   const navigate = useNavigate();
//   const show = type === 'login' ;

//   return (
//       <>
//         <div className="auth-page flex justify-center items-center overflow-hidden relative bg-black h-screen w-screen text-white">
//         <StarPattern/>
//           <div className={`bubble absolute  top-5 ${show ? "login-mode" : "signup-mode"}`}>
//             {/* <div className="form-box text-white top-20 absolute  w-[35em] transition-all ease-in-out "> */}
//             <div className="form-box text-white top-20 absolute w-full max-w-[35em] px-6 transition-all ease-in-out">
//               <div className="logo flex justify-center items-center gap-2 mb-4">
//                 <img src={Logo} alt="" width={80}  />
//                 {/* <h1 className='text-7xl font-semibold'> */}
//                 <h1 className='text-4xl sm:text-5xl md:text-6xl font-semibold'>
//                   <span className='web-name bg-clip-text'>FlowAI</span></h1>
//               </div>
//               <div className= {`form-auth-box  `}>
//               {show ? (
//                   <div className='auth-transition'> 
//                     <Login/>
//                     <div className="para text-white text-center mt-5 ">Don't have an account? <button className='text-gray-400 
//                     bg-transparent border-0 hover:underline transition-all duration-300 ease-in-out' onClick={() => navigate("/auth/signup")}> Signup </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className='auth-transition'>
//                     <Signup/> 
//                     <div className="para text-white text-center mt-5 ">Already have an account? <button className='text-gray-400 
//                     bg-transparent border-0 hover:underline transition-all duration-300 ease-in-out' onClick={() => navigate("/auth/login")}> Login </button>
//                     </div>
//                   </div> 
//                 )
//               }
//               </div>

//             </div>
            
//           </div>
//         </div>
//       </>
//   )
// }

// export default Auth


// Auth.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.png'
import "./Auth.css"
import StarPattern from '../../components/common/StarPattern';
import Signup from '../../components/authComponents/Signup';
import Login from '../../components/authComponents/Login';
import "../../components/common/CommonAuthStyle.css"

const Auth = ({type}) => {
  const navigate = useNavigate();
  const show = type === 'login';

  return (
      <>
        <div className="auth-page relative bg-black h-screen w-screen text-white flex justify-center items-center overflow-hidden">
          <StarPattern/>
          
          <div className={`bubble ${show ? "login-mode" : "signup-mode"}`}>
            <div className="form-box text-white top-20 absolute w-full max-w-[35em] px-6 transition-all ease-in-out flex flex-col items-center">
              
              <div className="logo flex justify-center items-center gap-2 mb-4">
                <img src={Logo} alt="Logo" width={80} />
                <h1 className='text-4xl sm:text-5xl md:text-6xl font-semibold'>
                  <span className='web-name bg-clip-text'>FlowAI</span>
                </h1>
              </div>

              <div className="form-auth-box w-full">
                {show ? (
                  <div className='auth-transition'> 
                    <Login/>
                    <div className="para text-white text-center mt-5">
                      Don't have an account? 
                      <button className='ml-2 text-gray-400 bg-transparent border-0 hover:underline' onClick={() => navigate("/auth/signup")}>
                        Signup
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className='auth-transition'>
                    <Signup/> 
                    <div className="para text-white text-center mt-5">
                      Already have an account? 
                      <button className='ml-2 text-gray-400 bg-transparent border-0 hover:underline' onClick={() => navigate("/auth/login")}>
                        Login
                      </button>
                    </div>
                  </div> 
                )}
              </div>

            </div>
          </div>
        </div>
      </>
  )
}

export default Auth;