import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Protected Middleware
import { ProtectedRoute } from './utils/ProtectedRoute';
import { GuestRoute } from './utils/GeustRoute';


import AppLayout from "./layouts/AppLayout";

// Landing
import Landing from './pages/landing/Landing'
import Home from "./components/home/Main";
// Auth Routes
import Auth from './pages/auth/Auth';
// import Home from './pages/home/Home';

// Workflow Routes
// import Workflow from './pages/workflow/Workflow';
import WorkflowLayout from './layouts/WorkflowLayout';
import WorkflowMain from './components/workflow/WorkflowMain';
import WorkflowEditor from './components/workflow/editor/WorkflowEditor'
// Test Route
import Test from './pages/Test'

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

          <Route element={<AppLayout />}>

            <Route path="/home" element={<Home />}  />

            <Route path="/workflow" element={<WorkflowLayout />} >
              <Route index element={<WorkflowMain />}  />
              <Route path="new" element={<WorkflowEditor />} />
              <Route path=":id" element={<WorkflowEditor />} />
            </Route>

            <Route path="/test" element={<Test />} />

          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
