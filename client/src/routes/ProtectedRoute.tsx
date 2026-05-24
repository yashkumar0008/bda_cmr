import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLoader } from '../components/common/Spinner';

interface Props { children: React.ReactNode; roles?: string[]; }

export const ProtectedRoute = ({ children, roles }: Props) => {
  const { user, token, isLoading } = useAuth();
  if (isLoading) return <PageLoader />;
  if (!token || !user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};
