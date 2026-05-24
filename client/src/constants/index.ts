export const LEAD_STATUSES = ['New Lead', 'Contacted', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'] as const;

export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'] as const;

export const INDUSTRIES = [
  'Manufacturing', 'Automotive', 'Electronics', 'Pharmaceuticals',
  'Food & Beverage', 'Textiles', 'Chemicals', 'Aerospace', 'Construction', 'Other'
];

export const LEAD_SOURCES = [
  'Cold Call', 'Email Campaign', 'LinkedIn', 'Referral',
  'Trade Show', 'Website', 'Advertisement', 'Other'
];

export const FOLLOWUP_TYPES = ['Call', 'Email', 'Meeting', 'Demo', 'Follow-up', 'Other'];

export const ROLES = ['Admin', 'Sales Manager', 'BDA Employee'];

export const STATUS_COLORS: Record<string, string> = {
  'New Lead': 'status-new',
  'Contacted': 'status-contacted',
  'Proposal Sent': 'status-proposal',
  'Negotiation': 'status-negotiation',
  'Won': 'status-won',
  'Lost': 'status-lost',
};

export const PRIORITY_COLORS: Record<string, string> = {
  'Critical': 'priority-critical',
  'High': 'priority-high',
  'Medium': 'priority-medium',
  'Low': 'priority-low',
};

export const KANBAN_COLUMN_COLORS: Record<string, string> = {
  'New Lead': 'blue',
  'Contacted': 'cyan',
  'Proposal Sent': 'purple',
  'Negotiation': 'amber',
  'Won': 'green',
  'Lost': 'red',
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const timeAgo = (date: string) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
