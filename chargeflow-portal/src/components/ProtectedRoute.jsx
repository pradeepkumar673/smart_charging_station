import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Skeleton from './ui/Skeleton';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 space-y-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <Skeleton className="w-48 h-6 rounded-md" />
        <Skeleton className="w-64 h-4 rounded-md" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const isOwnerRoute = location.pathname.startsWith('/owner');
    return <Navigate to={isOwnerRoute ? '/owner/login' : '/driver/login'} state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // If role doesn't match, redirect to the appropriate dashboard
    return <Navigate to={role === 'owner' ? '/owner/dashboard' : '/driver/dashboard'} replace />;
  }

  return children;
}
