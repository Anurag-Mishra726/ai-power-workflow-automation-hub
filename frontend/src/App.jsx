import { useState } from 'react'
import './App.css'
import Landing from './pages/Landing'
import Auth from './pages/Auth';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
