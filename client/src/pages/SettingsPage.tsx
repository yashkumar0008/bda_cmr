import React from 'react';
import { FiSettings, FiDatabase, FiShield, FiBell, FiGlobe } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export const SettingsPage = () => {
  const { user } = useAuth();
  if (user?.role !== 'Admin') return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <FiShield className="w-12 h-12 text-slate-600" />
      <p className="text-slate-400">Admin access required</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="card p-6">
        <h3 className="font-display font-semibold text-white mb-1 flex items-center gap-2"><FiGlobe className="w-5 h-5 text-brand-400" /> General Settings</h3>
        <p className="text-slate-500 text-sm mb-5">Configure your CRM system preferences</p>
        <div className="space-y-4">
          {[['Company Name', 'BDA Manufacturing Co.'], ['Time Zone', 'Asia/Kolkata (IST)'], ['Currency', 'INR (₹)'], ['Date Format', 'DD/MM/YYYY']].map(([label, val]) => (
            <div key={label} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
              <div><p className="text-slate-200 text-sm font-medium">{label}</p></div>
              <span className="text-slate-400 text-sm font-mono">{val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-display font-semibold text-white mb-1 flex items-center gap-2"><FiBell className="w-5 h-5 text-amber-400" /> Notification Settings</h3>
        <p className="text-slate-500 text-sm mb-5">Manage system notifications</p>
        <div className="space-y-3">
          {[['Follow-up Reminders', true], ['New Lead Alerts', true], ['Status Change Emails', false], ['Weekly Reports', true]].map(([label, enabled]) => (
            <div key={label as string} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
              <p className="text-slate-300 text-sm">{label}</p>
              <div className={`w-10 h-5.5 rounded-full transition-colors cursor-pointer flex items-center px-0.5 ${enabled ? 'bg-brand-500' : 'bg-slate-700'}`} style={{ height: '22px' }}>
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-display font-semibold text-white mb-1 flex items-center gap-2"><FiDatabase className="w-5 h-5 text-violet-400" /> Data Management</h3>
        <p className="text-slate-500 text-sm mb-5">Backup and manage your CRM data</p>
        <div className="flex flex-col gap-3">
          <button className="btn-secondary justify-start gap-3 py-3"><FiDatabase className="w-4 h-4" /> Export All Data (CSV)</button>
          <button className="btn-secondary justify-start gap-3 py-3"><FiSettings className="w-4 h-4" /> Run Database Backup</button>
        </div>
      </div>

      <div className="card p-6 border-red-500/20">
        <h3 className="font-display font-semibold text-red-400 mb-1 flex items-center gap-2"><FiShield className="w-5 h-5" /> Danger Zone</h3>
        <p className="text-slate-500 text-sm mb-5">Irreversible system actions</p>
        <button className="btn-danger justify-start gap-3 py-3 w-full">Clear All Demo Data</button>
      </div>
    </div>
  );
};
