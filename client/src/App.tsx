import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { LeadsPage } from './pages/LeadsPage';
import { PipelinePage } from './pages/PipelinePage';
import { FollowUpsPage } from './pages/FollowUpsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { TeamPage } from './pages/TeamPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="leads" element={<LeadsPage />} />
              <Route path="pipeline" element={<PipelinePage />} />
              <Route path="followups" element={<FollowUpsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="team" element={<ProtectedRoute roles={['Admin', 'Sales Manager']}><TeamPage /></ProtectedRoute>} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<ProtectedRoute roles={['Admin']}><SettingsPage /></ProtectedRoute>} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
