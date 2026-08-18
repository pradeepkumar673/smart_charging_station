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

// Phase 2 Pages
import DriverDashboard from './pages/DriverDashboard';
import MapExplorer from './pages/MapExplorer';
import StationDetails from './pages/StationDetails';
import BookSlot from './pages/BookSlot';
import RouteNavigation from './pages/RouteNavigation';

// Phase 3 Pages
import ActiveSession from './pages/ActiveSession';
import SmartRecommendation from './pages/SmartRecommendation';
import ClaimSlot from './pages/ClaimSlot';
import MyBookings from './pages/MyBookings';
import ProfileSettings from './pages/ProfileSettings';
import SessionSummary from './pages/SessionSummary';
import GreenInsights from './pages/GreenInsights';
import Notifications from './pages/Notifications';

// Phase 4 Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import MyStations from './pages/owner/MyStations';
import SlotManagement from './pages/owner/SlotManagement';
import PricingControl from './pages/owner/PricingControl';
import OwnerDigitalTwin from './pages/owner/OwnerDigitalTwin';
import OwnerAnalytics from './pages/owner/OwnerAnalytics';
import FeedbackCenter from './pages/owner/FeedbackCenter';
import BusinessSettings from './pages/owner/BusinessSettings';

// Phase 5 Utility & 404 Pages
import NotFoundPage from './pages/NotFoundPage';
import StatesShowcase from './pages/StatesShowcase';

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

        {/* Phase 2 Core Driver Flow Routes */}
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
        <Route path="/driver/explore" element={<MapExplorer />} />
        <Route path="/driver/station/:id" element={<StationDetails />} />
        <Route path="/driver/station/:id/book" element={<BookSlot />} />
        <Route path="/driver/navigation/:bookingId" element={<RouteNavigation />} />

        {/* Phase 3 Driver Lifecycle & Utility Routes */}
        <Route path="/driver/session/active" element={<ActiveSession />} />
        <Route path="/driver/recommendation" element={<SmartRecommendation />} />
        <Route path="/driver/claim-slot" element={<ClaimSlot />} />
        <Route path="/driver/bookings" element={<MyBookings />} />
        <Route path="/driver/profile" element={<ProfileSettings />} />
        <Route path="/driver/session/:id/summary" element={<SessionSummary />} />
        <Route path="/driver/insights" element={<GreenInsights />} />
        <Route path="/driver/notifications" element={<Notifications />} />

        {/* Phase 4 Station Owner Console Routes */}
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/stations" element={<MyStations />} />
        <Route path="/owner/slots" element={<SlotManagement />} />
        <Route path="/owner/pricing" element={<PricingControl />} />
        <Route path="/owner/twin" element={<OwnerDigitalTwin />} />
        <Route path="/owner/analytics" element={<OwnerAnalytics />} />
        <Route path="/owner/feedback" element={<FeedbackCenter />} />
        <Route path="/owner/settings" element={<BusinessSettings />} />

        {/* Phase 5 Shared Utility & 404 Routes */}
        <Route path="/states" element={<StatesShowcase />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
