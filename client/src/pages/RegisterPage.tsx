import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Spinner } from '../components/common/Spinner';

export const RegisterPage = () => {
  const { updateUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'BDA Employee' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      const { token, user } = res.data.data;
      localStorage.setItem('bda_token', token);
      localStorage.setItem('bda_user', JSON.stringify(user));
      updateUser(user);
      showToast('Account created!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/25">
            <span className="text-white font-display font-bold text-2xl">B</span>
          </div>
          <h1 className="font-display font-bold text-white text-3xl mb-1">BDA CRM</h1>
          <p className="text-slate-400 text-sm">Create your account</p>
        </div>
        <div className="card p-8">
          <h2 className="font-display font-semibold text-white text-xl mb-6">Get started</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative"><FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input type="text" className="input pl-10" placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <div className="relative"><FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input type="email" className="input pl-10" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="label">Role</label>
              <select className="input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option>BDA Employee</option>
                <option>Sales Manager</option>
                <option>Admin</option>
              </select>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative"><FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input type={showPw ? 'text' : 'password'} className="input pl-10 pr-10" placeholder="Min 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 mt-2">
              {loading ? <><Spinner size="sm" /> Creating...</> : 'Create Account'}
            </button>
          </form>
        </div>
        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account? <Link to="/login" className="text-brand-400 hover:text-brand-300">Sign in</Link>
        </p>
      </div>
    </div>
  );
};
