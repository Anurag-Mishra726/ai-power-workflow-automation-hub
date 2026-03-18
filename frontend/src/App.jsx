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


// Workflow Routes
import WorkflowLayout from './layouts/WorkflowLayout';
import WorkflowMain from './components/workflow/WorkflowMain';
import WorkflowEditor from './components/workflow/editor/WorkflowEditor'

// Integrations
import IntegrationLayout from './layouts/IntegrationLayout';
import IntegrationMain from './components/aiIntegrations/IntegrationMain';
import AddIntegrationForm from './components/aiIntegrations/AddIntegrationForm';
import EditIntegrationForm from './components/aiIntegrations/EditIntegrationForm';


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
            
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              
                <Route path="/home" element={<Home />}  />

                <Route path="/workflow" element={<WorkflowLayout />} >
                  <Route index element={<WorkflowMain />}  />
                  <Route path="new/:id" element={<WorkflowEditor />} />
                  <Route path=":id" element={<WorkflowEditor />} />
                </Route>

                <Route path="/ai/integrations" element={<IntegrationLayout />} >
                  <Route index element={<IntegrationMain />} />
                  <Route path="add/new/apikey" element={<AddIntegrationForm />} />
                  <Route path="edit/:provider/apikey" element={<EditIntegrationForm />} />
                </Route>

                <Route path="/test" element={<Test />} />

              </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
