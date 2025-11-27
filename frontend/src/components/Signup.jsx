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
      <div className="form-container auth-transition auth-signup mt-20">
        <form onSubmit={handleSubmit} className='form-signup flex flex-col gap-28'>

            <div className='row-1 flex justify-between gap-16 w-full '>
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

            <div className='row-2 flex justify-between gap-16 w-full'>
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

            <div className='row-3 flex flex-col justify-center items-center text-[1.4em] gap-[0.7em] mt-[-1em] '>
                <button className="submit-btn" type='submit' >Sign Up</button>
            </div>
        </form>
      </div>
    </>
  )
}

export default Signup
