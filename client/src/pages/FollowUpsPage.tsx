import React, { useEffect, useState, useCallback } from 'react';
import { FiPlus, FiCheck, FiTrash2, FiCalendar, FiClock, FiPhone, FiMail, FiUsers, FiEdit2 } from 'react-icons/fi';
import api from '../api/axios';
import { FollowUp, Lead, User } from '../types';
import { formatDate, formatDateTime, FOLLOWUP_TYPES } from '../utils';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { Spinner } from '../components/common/Spinner';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const typeIcons: Record<string, any> = { Call: FiPhone, Email: FiMail, Meeting: FiUsers, Demo: FiUsers, 'Follow-up': FiCalendar, Proposal: FiEdit2, Other: FiClock };

const FollowUpForm = ({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ lead: '', assignedTo: user?._id || '', date: '', type: 'Call', notes: '' });

  useEffect(() => {
    Promise.all([api.get('/leads?limit=100'), api.get('/users')])
      .then(([lr, ur]) => { setLeads(lr.data.data.leads); setUsers(ur.data.data.users); })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/followups', form);
      showToast('Follow-up scheduled!', 'success');
      onSuccess();
    } catch (err: any) { showToast(err.response?.data?.message || 'Error', 'error'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Lead *</label>
        <select className="input" value={form.lead} onChange={e => setForm({ ...form, lead: e.target.value })} required>
          <option value="">Select a lead</option>
          {leads.map(l => <option key={l._id} value={l._id}>{l.companyName} — {l.contactPerson}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Type</label>
          <select className="input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            {FOLLOWUP_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Date & Time *</label>
          <input type="datetime-local" className="input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
        </div>
      </div>
      <div>
        <label className="label">Assign To</label>
        <select className="input" value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })}>
          {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
        </select>
      </div>
      <div>
        <label className="label">Notes</label>
        <textarea className="input resize-none" rows={3} placeholder="What's the agenda?" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1 justify-center">Cancel</button>
        <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
          {loading ? <><Spinner size="sm" /> Scheduling...</> : 'Schedule Follow-up'}
        </button>
      </div>
    </form>
  );
};

export const FollowUpsPage = () => {
  const { showToast } = useToast();
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Pending');
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [completing, setCompleting] = useState<string | null>(null);

  const fetchFollowUps = useCallback(async () => {
    setLoading(true);
    try {
      const params = filter ? `?status=${filter}` : '';
      const res = await api.get(`/followups${params}`);
      setFollowUps(res.data.data.followUps);
    } catch (e) { showToast('Failed to load follow-ups', 'error'); }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { fetchFollowUps(); }, [fetchFollowUps]);

  const handleComplete = async (id: string) => {
    setCompleting(id);
    try {
      await api.put(`/followups/${id}/complete`, { outcome: 'Completed successfully' });
      showToast('Follow-up marked complete!', 'success');
      fetchFollowUps();
    } catch (e) { showToast('Error', 'error'); }
    finally { setCompleting(null); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/followups/${deleteId}`);
      showToast('Follow-up deleted', 'success');
      fetchFollowUps();
    } catch (e) { showToast('Error', 'error'); }
    finally { setDeleting(false); setDeleteId(null); }
  };

  const isOverdue = (date: string) => new Date(date) < new Date();

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          {['Pending', 'Completed', 'Cancelled', ''].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === s ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <FiPlus className="w-4 h-4" /> Schedule Follow-up
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center items-center h-48"><Spinner /></div>
      ) : followUps.length === 0 ? (
        <EmptyState icon={<FiCalendar className="w-7 h-7" />} title="No follow-ups" description="Schedule a follow-up to stay on track with your leads" action={<button onClick={() => setShowForm(true)} className="btn-primary"><FiPlus className="w-4 h-4" /> Schedule</button>} />
      ) : (
        <div className="space-y-3">
          {followUps.map(fu => {
            const Icon = typeIcons[fu.type] || FiClock;
            const overdue = fu.status === 'Pending' && isOverdue(fu.date);
            return (
              <div key={fu._id} className={`card p-4 flex items-start gap-4 transition-all hover:border-slate-700 ${overdue ? 'border-red-500/20 bg-red-500/5' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${fu.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-400' : overdue ? 'bg-red-500/15 text-red-400' : 'bg-brand-500/15 text-brand-400'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-white font-medium text-sm">
                        {(fu.lead as any)?.companyName || 'Unknown Lead'}
                        <span className="text-slate-500 font-normal"> — {fu.type}</span>
                      </p>
                      <p className="text-slate-400 text-xs">{(fu.lead as any)?.contactPerson}</p>
                    </div>
                    <Badge label={fu.status} />
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className={`flex items-center gap-1.5 text-xs ${overdue ? 'text-red-400' : 'text-slate-400'}`}>
                      <FiClock className="w-3 h-3" />
                      <span>{formatDateTime(fu.date)}</span>
                      {overdue && <span className="text-red-400 font-medium">(Overdue)</span>}
                    </div>
                    {fu.assignedTo && <span className="text-slate-500 text-xs">👤 {fu.assignedTo.name}</span>}
                  </div>
                  {fu.notes && <p className="text-slate-500 text-xs mt-2 line-clamp-1">{fu.notes}</p>}
                </div>
                {fu.status === 'Pending' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleComplete(fu._id)} disabled={completing === fu._id} className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors" title="Mark complete">
                      {completing === fu._id ? <Spinner size="sm" /> : <FiCheck className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setDeleteId(fu._id)} className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors" title="Delete">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Schedule Follow-up" size="md">
        <FollowUpForm onSuccess={() => { setShowForm(false); fetchFollowUps(); }} onCancel={() => setShowForm(false)} />
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Follow-up?" message="This follow-up will be permanently deleted." isLoading={deleting} />
    </div>
  );
};
