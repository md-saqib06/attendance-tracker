import AttendanceDashboard from './pages/AttendanceDashboard'
import LandingPage from './pages/LandingPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <>
      <Router >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<AttendanceDashboard />} />

          {/* <Route path="*" element={<Page404 />} /> */}
        </Routes>
      </Router>


    </>
  )
}

export default App
