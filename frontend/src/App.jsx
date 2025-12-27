import './App.css'
import Landing from './pages/landing/Landing'
import Auth from './pages/auth/Auth';
import Home from './pages/home/Home';
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
