import React, { ReactNode } from 'react';
interface Props { icon: ReactNode; title: string; description?: string; action?: ReactNode; }
export const EmptyState = ({ icon, title, description, action }: Props) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-slate-500">{icon}</div>
    <h3 className="font-display font-semibold text-slate-300 text-lg mb-1">{title}</h3>
    {description && <p className="text-slate-500 text-sm mb-6 max-w-xs">{description}</p>}
    {action}
  </div>
);
