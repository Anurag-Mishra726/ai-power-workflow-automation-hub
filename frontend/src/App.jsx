import { useState } from 'react'
import './App.css'
import Landing from './pages/Landing'
import Auth from './pages/Auth';
import Home from './pages/Home';
import Test from './pages/Test'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path='/auth/login' element={<Auth type='login' />} />
          <Route path='/auth/signup' element={<Auth type= 'signup' />} />
          <Route path='/home' element={<Home/>} />
          <Route path="/test" element={<Test/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
