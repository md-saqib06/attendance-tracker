// import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom"
import LandingPage from './pages/LandingPage'
import { useUser } from "@clerk/clerk-react";
import './App.css'
import AttendanceDashboard from "./pages/AttendanceDashboard";

function App() {

  const user = useUser();

  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/dashboard' element={user.isSignedIn ? <AttendanceDashboard /> : <LandingPage />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </>
  )
}

export default App
