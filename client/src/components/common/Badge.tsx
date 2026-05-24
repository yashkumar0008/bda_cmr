import React from 'react';

const statusColors: Record<string, string> = {
  'New Lead': 'bg-slate-500/15 text-slate-300 border-slate-500/20',
  'Contacted': 'bg-blue-500/15 text-blue-300 border-blue-500/20',
  'Proposal Sent': 'bg-violet-500/15 text-violet-300 border-violet-500/20',
  'Negotiation': 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  'Won': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
  'Lost': 'bg-red-500/15 text-red-300 border-red-500/20',
  'Low': 'bg-slate-500/15 text-slate-400 border-slate-500/20',
  'Medium': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  'High': 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  'Critical': 'bg-red-500/15 text-red-400 border-red-500/20',
  'Pending': 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  'Completed': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
  'Cancelled': 'bg-red-500/15 text-red-300 border-red-500/20',
  'Rescheduled': 'bg-blue-500/15 text-blue-300 border-blue-500/20',
};

export const Badge = ({ label }: { label: string }) => (
  <span className={`badge border ${statusColors[label] || 'bg-slate-500/15 text-slate-400 border-slate-500/20'}`}>{label}</span>
);
