import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Lead, User } from '../../types';
import { INDUSTRIES, LEAD_SOURCES, PRIORITIES, LEAD_STATUSES } from '../../utils';
import { Spinner } from '../common/Spinner';
import { useToast } from '../../context/ToastContext';

interface Props {
  lead?: Lead | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const LeadForm = ({ lead, onSuccess, onCancel }: Props) => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    companyName: lead?.companyName || '',
    contactPerson: lead?.contactPerson || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    industry: lead?.industry || 'Manufacturing',
    dealValue: lead?.dealValue || 0,
    leadSource: lead?.leadSource || 'Website',
    status: lead?.status || 'New Lead',
    priority: lead?.priority || 'Medium',
    assignedTo: (lead?.assignedTo as any)?._id || '',
    followUpDate: lead?.followUpDate ? lead.followUpDate.split('T')[0] : '',
    notes: lead?.notes || '',
  });

  useEffect(() => {
    api.get('/users').then(res => setUsers(res.data.data.users)).catch(() => {});
  }, []);

  const set = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, dealValue: Number(form.dealValue), assignedTo: form.assignedTo || null };
      if (lead) await api.put(`/leads/${lead._id}`, payload);
      else await api.post('/leads', payload);
      showToast(lead ? 'Lead updated!' : 'Lead created!', 'success');
      onSuccess();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Error saving lead', 'error');
    } finally { setLoading(false); }
  };

  const inputClass = "input";
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Company Name *</label>
          <input className={inputClass} placeholder="Tata Steel Ltd" value={form.companyName} onChange={e => set('companyName', e.target.value)} required />
        </div>
        <div>
          <label className="label">Contact Person *</label>
          <input className={inputClass} placeholder="Arjun Mehta" value={form.contactPerson} onChange={e => set('contactPerson', e.target.value)} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Email *</label>
          <input type="email" className={inputClass} placeholder="contact@company.com" value={form.email} onChange={e => set('email', e.target.value)} required />
        </div>
        <div>
          <label className="label">Phone *</label>
          <input className={inputClass} placeholder="+91-9876543210" value={form.phone} onChange={e => set('phone', e.target.value)} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Industry</label>
          <select className={inputClass} value={form.industry} onChange={e => set('industry', e.target.value)}>
            {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Deal Value (₹)</label>
          <input type="number" className={inputClass} placeholder="500000" value={form.dealValue} onChange={e => set('dealValue', e.target.value)} min="0" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Lead Source</label>
          <select className={inputClass} value={form.leadSource} onChange={e => set('leadSource', e.target.value)}>
            {LEAD_SOURCES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select className={inputClass} value={form.status} onChange={e => set('status', e.target.value)}>
            {LEAD_STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Priority</label>
          <select className={inputClass} value={form.priority} onChange={e => set('priority', e.target.value)}>
            {PRIORITIES.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Assign To</label>
          <select className={inputClass} value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)}>
            <option value="">Unassigned</option>
            {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="label">Follow-up Date</label>
        <input type="date" className={inputClass} value={form.followUpDate} onChange={e => set('followUpDate', e.target.value)} />
      </div>
      <div>
        <label className="label">Notes</label>
        <textarea className={`${inputClass} resize-none`} rows={3} placeholder="Additional notes..." value={form.notes} onChange={e => set('notes', e.target.value)} />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1 justify-center">Cancel</button>
        <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
          {loading ? <><Spinner size="sm" /> Saving...</> : lead ? 'Update Lead' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
};
