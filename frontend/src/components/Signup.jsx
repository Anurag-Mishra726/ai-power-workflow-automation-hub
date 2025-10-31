import { useState } from "react"
import React from 'react'
import "./Signup.css"
import Button from "./Button"

const Signup = () => {

    const [formData, setformData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChagne = (e) => {
        const {name, value} = e.target;
        setformData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data : ",formData);

        // Clear the form after submission
        setformData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
        // You can add further submission logic here, like sending data to a server

    }

  return (
    <>
      <div className="form-container mt-20">
        <form action="#" onSubmit={handleSubmit} className='form-signup '>

            <div className='row-1 '>
                <div className="input-fields">
                    <input 
                        type="text"
                        name='name'
                        value={formData.name}
                        onChange={handleChagne}
                        placeholder=" "
                        required 
                    />
                    <label htmlFor="name">Username</label>

                </div>

                <div className="input-fields">
                    <input 
                        type="text" 
                        id='email' 
                        name='email' 
                        value={formData.email} 
                        onChange={handleChagne} 
                        placeholder=" " 
                        required 
                    />
                    <label htmlFor="email">Email</label>

                </div>
            </div>

            <div className='row-2'>
                <div className="input-fields">
                    <input 
                        type="password" 
                        id='password' 
                        name='password' 
                        value={formData.password} 
                        onChange={handleChagne} 
                        placeholder=" " 
                        required 
                    />
                <label htmlFor="password">Password</label>

                </div>

                <div className="input-fields">
                    <input 
                        type="password" 
                        id='confirmPassword' 
                        name='confirmPassword' 
                        value={formData.confirmPassword} 
                        onChange={handleChagne} 
                        placeholder=" " 
                        required 
                    />
                    <label htmlFor="confirmPassword">Confirm Password</label>

                </div>
            </div>

            <div className='row-3'>
                <button className="submit-btn" type='submit' onClick={handleSubmit} >< Button text="Sign Up" to="#" /> </button>
                <div className="para text-white">Already have an accoutn? <span className="text-gray-400 underline"><Button text="Login" to="#" /></span> </div>
            </div>
            
        </form>
      </div>
    </>
  )
}

export default Signup
