export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatDateTime = (date: string | Date) =>
  new Date(date).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export const timeAgo = (date: string | Date) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(date);
};

export const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

export const LEAD_STATUSES = ['New Lead', 'Contacted', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];
export const INDUSTRIES = ['Manufacturing', 'Technology', 'Healthcare', 'Finance', 'Retail', 'Construction', 'Automotive', 'Food & Beverage', 'Logistics', 'Other'];
export const LEAD_SOURCES = ['Website', 'Referral', 'Cold Call', 'Trade Show', 'Social Media', 'Email Campaign', 'Other'];
export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
export const FOLLOWUP_TYPES = ['Call', 'Email', 'Meeting', 'Demo', 'Follow-up', 'Proposal', 'Other'];
