import React, { useState } from 'react';
import { FiEdit2, FiCamera, FiLock, FiUser, FiMail, FiPhone, FiBriefcase } from 'react-icons/fi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getInitials } from '../utils';
import { Spinner } from '../components/common/Spinner';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [tab, setTab] = useState<'profile' | 'password'>('profile');
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', department: user?.department || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', form);
      updateUser(res.data.data.user);
      showToast('Profile updated!', 'success');
    } catch (err: any) { showToast(err.response?.data?.message || 'Error', 'error'); }
    finally { setLoading(false); }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await api.post('/auth/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser({ ...user!, avatar: res.data.data.avatar });
      showToast('Avatar updated!', 'success');
    } catch (err: any) { showToast(err.response?.data?.message || 'Upload failed', 'error'); }
    finally { setUploading(false); }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { showToast('Passwords do not match', 'error'); return; }
    if (pwForm.newPassword.length < 6) { showToast('Password must be at least 6 characters', 'error'); return; }
    setLoading(true);
    try {
      await api.put('/auth/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      showToast('Password changed!', 'success');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) { showToast(err.response?.data?.message || 'Error', 'error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Avatar card */}
      <div className="card p-6 flex items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-brand-500/20 border-2 border-brand-500/30 flex items-center justify-center overflow-hidden">
            {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <span className="text-brand-400 text-2xl font-display font-bold">{getInitials(user?.name || 'U')}</span>}
          </div>
          <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-brand-600 transition-colors">
            {uploading ? <Spinner size="sm" /> : <FiCamera className="w-3.5 h-3.5 text-white" />}
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </label>
        </div>
        <div>
          <h2 className="font-display font-bold text-white text-xl">{user?.name}</h2>
          <p className="text-slate-400 text-sm">{user?.email}</p>
          <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 bg-brand-500/15 text-brand-400 border border-brand-500/20 rounded-full text-xs font-medium">
            <FiBriefcase className="w-3 h-3" />{user?.role}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
        {[['profile', 'Edit Profile', FiUser], ['password', 'Change Password', FiLock]].map(([t, label, Icon]: any) => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-brand-500/15 text-brand-400' : 'text-slate-400 hover:text-white'}`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {tab === 'profile' ? (
        <div className="card p-6">
          <h3 className="font-display font-semibold text-white mb-5">Personal Information</h3>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative"><FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input className="input pl-10" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="label">Email Address</label>
              <div className="relative"><FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input className="input pl-10 opacity-60 cursor-not-allowed" value={user?.email} disabled />
              </div>
              <p className="text-slate-600 text-xs mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="label">Phone Number</label>
              <div className="relative"><FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input className="input pl-10" placeholder="+91-9876543210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">Department</label>
              <div className="relative"><FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input className="input pl-10" placeholder="Sales, Business Dev..." value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 mt-2">
              {loading ? <><Spinner size="sm" /> Saving...</> : <><FiEdit2 className="w-4 h-4" /> Save Changes</>}
            </button>
          </form>
        </div>
      ) : (
        <div className="card p-6">
          <h3 className="font-display font-semibold text-white mb-5">Change Password</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {[['Current Password', 'currentPassword'], ['New Password', 'newPassword'], ['Confirm New Password', 'confirmPassword']].map(([label, field]) => (
              <div key={field}>
                <label className="label">{label}</label>
                <div className="relative"><FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input type="password" className="input pl-10" placeholder="••••••••" value={(pwForm as any)[field]} onChange={e => setPwForm({ ...pwForm, [field]: e.target.value })} required />
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 mt-2">
              {loading ? <><Spinner size="sm" /> Updating...</> : <><FiLock className="w-4 h-4" /> Update Password</>}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
