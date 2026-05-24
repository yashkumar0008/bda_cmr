import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Spinner } from '../components/common/Spinner';

export const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      showToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Login failed', 'error');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/25">
            <span className="text-white font-display font-bold text-2xl">B</span>
          </div>
          <h1 className="font-display font-bold text-white text-3xl mb-1">BDA CRM</h1>
          <p className="text-slate-400 text-sm">Sales Pipeline Management System</p>
        </div>

        <div className="card p-8">
          <h2 className="font-display font-semibold text-white text-xl mb-6">Sign in to your account</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input type="email" className="input pl-10" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input type={showPw ? 'text' : 'password'} className="input pl-10 pr-10" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 text-sm">
              {loading ? <><Spinner size="sm" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-slate-500 text-xs text-center mb-3">Demo Credentials</p>
            <div className="grid grid-cols-1 gap-2 text-xs">
              {[['Admin', 'admin@bdacrm.com', 'Admin@123'], ['Manager', 'sarah@bdacrm.com', 'Sarah@123'], ['BDA', 'raj@bdacrm.com', 'Raj@123']].map(([role, email, pw]) => (
                <button key={role} type="button" onClick={() => setForm({ email, password: pw })} className="bg-slate-800 hover:bg-slate-700 rounded-lg p-2.5 text-left transition-colors border border-slate-700 hover:border-slate-600">
                  <span className="text-brand-400 font-medium">{role}:</span> <span className="text-slate-400">{email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          New user? <Link to="/register" className="text-brand-400 hover:text-brand-300">Create account</Link>
        </p>
      </div>
    </div>
  );
};
