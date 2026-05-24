import React from 'react';
export const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size];
  return <div className={`${s} border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin`} />;
};
export const PageLoader = () => (
  <div className="flex items-center justify-center h-screen bg-slate-950">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      <p className="text-slate-400 text-sm font-medium">Loading BDA CRM...</p>
    </div>
  </div>
);
