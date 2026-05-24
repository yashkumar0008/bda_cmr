export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Sales Manager' | 'BDA Employee';
  avatar?: string;
  phone?: string;
  department?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface Lead {
  _id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  industry: string;
  dealValue: number;
  leadSource: string;
  status: 'New Lead' | 'Contacted' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedTo?: User;
  followUpDate?: string;
  notes?: string;
  attachments?: Attachment[];
  createdBy?: User;
  tags?: string[];
  lostReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Attachment {
  _id: string;
  url: string;
  publicId: string;
  name: string;
  uploadedAt: string;
}

export interface Activity {
  _id: string;
  user: User;
  action: string;
  lead?: Lead;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface FollowUp {
  _id: string;
  lead: Lead;
  assignedTo: User;
  createdBy: User;
  date: string;
  type: string;
  notes?: string;
  status: 'Pending' | 'Completed' | 'Cancelled' | 'Rescheduled';
  completedAt?: string;
  outcome?: string;
  createdAt?: string;
}

export interface DashboardStats {
  total: number;
  active: number;
  won: number;
  lost: number;
  contacted: number;
  proposal: number;
  negotiation: number;
  revenue: number;
  pendingFollowUps: number;
}

export interface Pipeline {
  'New Lead': Lead[];
  'Contacted': Lead[];
  'Proposal Sent': Lead[];
  'Negotiation': Lead[];
  'Won': Lead[];
  'Lost': Lead[];
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateUser: (user: User) => void;
}

export type LeadStatus = 'New Lead' | 'Contacted' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost';
