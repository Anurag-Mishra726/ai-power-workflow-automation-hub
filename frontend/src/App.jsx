import './App.css'
import Landing from './pages/landing/Landing'
import Auth from './pages/auth/Auth';
import Home from './pages/home/Home';
import Workflow from './pages/workflow/Workflow';
import Test from './pages/Test'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from './utils/ProtectedRoute';
import { GuestRoute } from './utils/GeustRoute';
import Test2 from './pages/Test2';
import Test3 from './pages/Test3';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path='/auth/login' element={
            <GuestRoute>
              <Auth type='login' />
            </GuestRoute>
          } />
          <Route path='/auth/signup' element={
            <GuestRoute>
              <Auth type='signup' />
            </GuestRoute>
          } />

          <Route path='/home' element={
              <Home/>
          } />
 
          <Route path= "/workflow" element={<Workflow/>} />
          <Route path="/test" element={<Test/>} />
          <Route path='/test2' element={<Test2/>}/>
          <Route path='/test3' element={<Test3/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
