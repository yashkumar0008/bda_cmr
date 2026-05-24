import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiGrid, FiUsers, FiTrello, FiCalendar, FiBarChart2, FiUser, FiSettings, FiLogOut, FiChevronLeft, FiChevronRight, FiTarget } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils';

const navItems = [
  { to: '/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/leads', icon: FiTarget, label: 'Leads' },
  { to: '/pipeline', icon: FiTrello, label: 'Pipeline' },
  { to: '/followups', icon: FiCalendar, label: 'Follow-ups' },
  { to: '/analytics', icon: FiBarChart2, label: 'Analytics' },
  { to: '/team', icon: FiUsers, label: 'Team', roles: ['Admin', 'Sales Manager'] },
  { to: '/profile', icon: FiUser, label: 'Profile' },
  { to: '/settings', icon: FiSettings, label: 'Settings', roles: ['Admin'] },
];

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const filtered = navItems.filter(item => !item.roles || (user && item.roles.includes(user.role)));

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-60'} flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 relative`}>
      {/* Logo */}
      <div className={`flex items-center ${collapsed ? 'justify-center px-2' : 'px-5'} py-5 border-b border-slate-800`}>
        <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-display font-bold text-sm">B</span>
        </div>
        {!collapsed && <div className="ml-3"><p className="font-display font-bold text-white text-sm leading-tight">BDA CRM</p><p className="text-slate-500 text-xs">Sales Pipeline</p></div>}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filtered.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`} title={collapsed ? label : undefined}>
            <Icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className={`p-3 border-t border-slate-800`}>
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <span className="text-brand-400 text-xs font-semibold">{getInitials(user?.name || 'U')}</span>}
            </div>
            <div className="min-w-0">
              <p className="text-slate-200 text-sm font-medium truncate">{user?.name}</p>
              <p className="text-slate-500 text-xs truncate">{user?.role}</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout} className={`sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 ${collapsed ? 'justify-center px-2' : ''}`} title={collapsed ? 'Logout' : undefined}>
          <FiLogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(!collapsed)} className="absolute -right-3 top-20 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all z-10">
        {collapsed ? <FiChevronRight className="w-3 h-3" /> : <FiChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
};
