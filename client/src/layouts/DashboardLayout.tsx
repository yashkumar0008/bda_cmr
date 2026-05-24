import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';

const titles: Record<string, { title: string; subtitle?: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Welcome back to BDA CRM' },
  '/leads': { title: 'Lead Management', subtitle: 'Track and manage your leads' },
  '/pipeline': { title: 'Sales Pipeline', subtitle: 'Kanban-style deal tracking' },
  '/followups': { title: 'Follow-ups & Tasks', subtitle: 'Manage your scheduled activities' },
  '/analytics': { title: 'Analytics', subtitle: 'Performance insights and metrics' },
  '/team': { title: 'Team Members', subtitle: 'Manage your sales team' },
  '/profile': { title: 'My Profile', subtitle: 'Manage your account' },
  '/settings': { title: 'Settings', subtitle: 'System configuration' },
};

export const DashboardLayout = () => {
  const location = useLocation();
  const page = titles[location.pathname] || { title: 'BDA CRM' };
  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title={page.title} subtitle={page.subtitle} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
