import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Phase 1 Pages
import Home from './pages/Home';
import DriverLogin from './pages/DriverLogin';
import DriverSignup from './pages/DriverSignup';
import OwnerLogin from './pages/OwnerLogin';
import OwnerSignup from './pages/OwnerSignup';
import ForgotPassword from './pages/ForgotPassword';
import OtpVerification from './pages/OtpVerification';

// Phase 2 Driver Pages
import DriverDashboard from './pages/DriverDashboard';
import MapExplorer from './pages/MapExplorer';
import StationDetails from './pages/StationDetails';
import BookSlot from './pages/BookSlot';
import RouteNavigation from './pages/RouteNavigation';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Phase 1 Core Auth & Landing Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/driver/login" element={<DriverLogin />} />
        <Route path="/driver/signup" element={<DriverSignup />} />
        <Route path="/owner/login" element={<OwnerLogin />} />
        <Route path="/owner/signup" element={<OwnerSignup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verify" element={<OtpVerification />} />

        {/* Phase 2 Core Driver Experience Routes */}
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
        <Route path="/driver/explore" element={<MapExplorer />} />
        <Route path="/driver/station/:id" element={<StationDetails />} />
        <Route path="/driver/station/:id/book" element={<BookSlot />} />
        <Route path="/driver/navigation/:bookingId" element={<RouteNavigation />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
