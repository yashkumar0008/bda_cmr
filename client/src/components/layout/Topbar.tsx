import React from 'react';
import { FiBell, FiSearch } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

interface Props { title: string; subtitle?: string; }

export const Topbar = ({ title, subtitle }: Props) => {
  const { user } = useAuth();
  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-20">
      <div>
        <h1 className="font-display font-bold text-white text-xl">{title}</h1>
        {subtitle && <p className="text-slate-500 text-xs">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input className="bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-brand-500 w-48" placeholder="Quick search..." />
        </div>
        <button className="relative w-9 h-9 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-all">
          <FiBell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5">
          <div className="w-6 h-6 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
            <span className="text-brand-400 text-xs font-semibold">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="hidden md:block">
            <p className="text-slate-300 text-xs font-medium leading-tight">{user?.name}</p>
            <p className="text-slate-500 text-xs">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
