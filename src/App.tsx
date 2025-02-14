import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useUser } from "@clerk/clerk-react";

// Lazy load the pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AttendanceDashboard = lazy(() => import('./pages/AttendanceDashboard'));

// Optional: Fallback component for when the page is loading
const Loading = () => <div className="flex justify-center items-center h-screen w-screen text-white bg-[#0a0a0a]">Loading...</div>;

function App() {
  const user = useUser();

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/dashboard' element={user.isSignedIn ? <AttendanceDashboard /> : <LandingPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;

