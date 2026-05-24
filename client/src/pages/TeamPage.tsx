import React, { useEffect, useState, useCallback } from 'react';
import { FiUserPlus, FiEdit2, FiTrash2, FiMail, FiPhone, FiShield } from 'react-icons/fi';
import api from '../api/axios';
import { User } from '../types';
import { formatDate, getInitials } from '../utils';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { Spinner } from '../components/common/Spinner';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const roleColors: Record<string, string> = {
  'Admin': 'bg-red-500/15 text-red-400 border-red-500/20',
  'Sales Manager': 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  'BDA Employee': 'bg-brand-500/15 text-brand-400 border-brand-500/20',
};

const UserFormModal = ({ user, onSuccess, onClose }: { user?: User; onSuccess: () => void; onClose: () => void }) => {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', role: user?.role || 'BDA Employee', phone: user?.phone || '', department: user?.department || '', password: '', isActive: user?.isActive !== false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (user) {
        await api.put(`/users/${user._id}`, form);
        showToast('User updated!', 'success');
      } else {
        await api.post('/auth/register', form);
        showToast('User created!', 'success');
      }
      onSuccess();
    } catch (err: any) { showToast(err.response?.data?.message || 'Error', 'error'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label">Full Name *</label><input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
        <div><label className="label">Email *</label><input type="email" className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
        <div><label className="label">Department</label><input className="input" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Role</label>
          <select className="input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value as any })}>
            <option>BDA Employee</option><option>Sales Manager</option><option>Admin</option>
          </select>
        </div>
        {!user && <div><label className="label">Password *</label><input type="password" className="input" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required={!user} minLength={6} /></div>}
      </div>
      {user && (
        <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
          <input type="checkbox" id="active" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 rounded" />
          <label htmlFor="active" className="text-slate-300 text-sm">Account Active</label>
        </div>
      )}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
        <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
          {loading ? <><Spinner size="sm" /> Saving...</> : user ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  );
};

export const TeamPage = () => {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data.data.users);
    } catch (e) { showToast('Failed to load team', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/users/${deleteId}`);
      showToast('User deleted', 'success');
      fetchUsers();
    } catch (e: any) { showToast(e.response?.data?.message || 'Error', 'error'); }
    finally { setDeleting(false); setDeleteId(null); }
  };

  const isAdmin = currentUser?.role === 'Admin';

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex justify-end">
        {isAdmin && (
          <button onClick={() => { setSelectedUser(undefined); setShowForm(true); }} className="btn-primary">
            <FiUserPlus className="w-4 h-4" /> Add Member
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48"><Spinner /></div>
      ) : users.length === 0 ? (
        <EmptyState icon={<FiUserPlus className="w-7 h-7" />} title="No team members" description="Add your first team member to get started" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(u => (
            <div key={u._id} className={`card p-5 flex flex-col gap-4 hover:border-slate-700 transition-all ${!u.isActive ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {u.avatar ? <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" /> : <span className="text-brand-400 text-lg font-display font-semibold">{getInitials(u.name)}</span>}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{u.name}</p>
                    <span className={`badge border text-xs mt-0.5 ${roleColors[u.role]}`}>
                      <FiShield className="w-3 h-3" />{u.role}
                    </span>
                  </div>
                </div>
                {!u.isActive && <span className="badge bg-slate-700/50 text-slate-400 text-xs">Inactive</span>}
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-400"><FiMail className="w-3.5 h-3.5 flex-shrink-0" /><span className="truncate">{u.email}</span></div>
                {u.phone && <div className="flex items-center gap-2 text-slate-400"><FiPhone className="w-3.5 h-3.5" /><span>{u.phone}</span></div>}
                {u.department && <p className="text-slate-500">Dept: <span className="text-slate-400">{u.department}</span></p>}
                <p className="text-slate-600">Joined {u.createdAt ? formatDate(u.createdAt) : '—'}</p>
              </div>

              {isAdmin && u._id !== currentUser?._id && (
                <div className="flex gap-2 pt-2 border-t border-slate-800">
                  <button onClick={() => { setSelectedUser(u); setShowForm(true); }} className="btn-secondary flex-1 justify-center text-xs py-1.5"><FiEdit2 className="w-3.5 h-3.5" /> Edit</button>
                  <button onClick={() => setDeleteId(u._id)} className="btn-danger flex-1 justify-center text-xs py-1.5"><FiTrash2 className="w-3.5 h-3.5" /> Remove</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={selectedUser ? 'Edit Team Member' : 'Add Team Member'} size="md">
        <UserFormModal user={selectedUser} onSuccess={() => { setShowForm(false); fetchUsers(); }} onClose={() => setShowForm(false)} />
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Remove Member?" message="This user will be permanently deleted from the system." isLoading={deleting} />
    </div>
  );
};
