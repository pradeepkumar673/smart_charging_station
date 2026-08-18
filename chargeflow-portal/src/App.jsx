import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

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
    <AuthProvider>
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

          {/* Phase 2 Core Driver Flow Routes (Protected: driver) */}
          <Route
            path="/driver/dashboard"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <DriverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/explore"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <MapExplorer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/station/:id"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <StationDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/station/:id/book"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <BookSlot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/navigation/:bookingId"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <RouteNavigation />
              </ProtectedRoute>
            }
          />

          {/* Phase 3 Driver Lifecycle & Utility Routes (Protected: driver) */}
          <Route
            path="/driver/session/active"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <ActiveSession />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/recommendation"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <SmartRecommendation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/claim-slot"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <ClaimSlot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/bookings"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/profile"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/session/:id/summary"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <SessionSummary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/insights"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <GreenInsights />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver/notifications"
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* Phase 4 Station Owner Console Routes (Protected: owner) */}
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/stations"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <MyStations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/slots"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <SlotManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/pricing"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <PricingControl />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/twin"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerDigitalTwin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/analytics"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <OwnerAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/feedback"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <FeedbackCenter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner/settings"
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <BusinessSettings />
              </ProtectedRoute>
            }
          />

          {/* Phase 5 Shared Utility & 404 Routes */}
          <Route path="/states" element={<StatesShowcase />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
