import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import AttendanceDashboard from './pages/AttendanceDashboard'
import { dark } from "@clerk/themes";
import { BrowserRouter } from "react-router-dom"
import { ClerkProvider } from '@clerk/react-router'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider appearance={{ baseTheme: dark }} publishableKey={PUBLISHABLE_KEY} afterSignOutUrl={'/'}>
        <App />
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>,
)
