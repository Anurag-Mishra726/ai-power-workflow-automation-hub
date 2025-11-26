import React, { useState } from "react";
import "./Login.css";   

const Login = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);

    // Reset the form after submit
    setFormData({
      email: "",
      password: ""
    });

    // Add login logic here (API call, backend auth, etc.)
  };

  return (
    <>
      <div className="form-container auth-login mt-20">
        <form onSubmit={handleSubmit} className="form-login">

          <div className="row-1 ">
            <div className="input-fields">
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label htmlFor="email">Email</label>
            </div>
          </div>

          <div className="row-2 mt-20 mb-28">
            <div className="input-fields">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label htmlFor="password">Password</label>
            </div>
          </div>

          <div className="row-3 flex flex-col justify-center items-center text-[1.4em] ">
            <button className="submit-btn" type="submit"> Login </button>
          </div>

        </form>
      </div>
    </>
  );
};

export default Login;
