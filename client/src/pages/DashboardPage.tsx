import React, { useEffect, useState } from 'react';
import { FiTarget, FiTrendingUp, FiCheckCircle, FiXCircle, FiDollarSign, FiCalendar, FiActivity, FiUsers } from 'react-icons/fi';
import api from '../api/axios';
import { DashboardStats, Activity } from '../types';
import { formatCurrency, timeAgo } from '../utils';
import { Spinner } from '../components/common/Spinner';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ icon: Icon, label, value, color, sub }: { icon: any; label: string; value: string | number; color: string; sub?: string }) => (
  <div className="card p-5 flex items-start gap-4">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0">
      <p className="text-slate-400 text-xs uppercase tracking-wider font-medium mb-1">{label}</p>
      <p className="text-white font-display font-bold text-2xl">{value}</p>
      {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
    </div>
  </div>
);

const activityIcons: Record<string, string> = {
  'Lead Created': '🎯', 'Lead Updated': '✏️', 'Status Changed': '🔄',
  'Lead Assigned': '👤', 'Follow-up Added': '📅', 'Follow-up Completed': '✅',
  'Lead Deleted': '🗑️', 'Deal Won': '🏆', 'Deal Lost': '❌', 'Attachment Added': '📎',
};

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, actRes] = await Promise.all([
          api.get('/leads/stats'),
          api.get('/activities?limit=8'),
        ]);
        setStats(statsRes.data.data.stats);
        setMonthlyData(statsRes.data.data.monthlyLeads);
        setActivities(actRes.data.data.activities);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;

  const winRate = stats && stats.total > 0 ? Math.round((stats.won / stats.total) * 100) : 0;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const maxCount = Math.max(...monthlyData.map(d => d.count), 1);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <div className="card p-6 bg-gradient-to-r from-brand-500/10 to-violet-500/10 border-brand-500/20">
        <p className="text-slate-400 text-sm mb-1">Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},</p>
        <h2 className="font-display font-bold text-white text-2xl">{user?.name} 👋</h2>
        <p className="text-slate-400 text-sm mt-1">Here's what's happening with your pipeline today.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiTarget} label="Total Leads" value={stats?.total || 0} color="bg-brand-500/15 text-brand-400" sub={`${stats?.active || 0} active`} />
        <StatCard icon={FiTrendingUp} label="In Pipeline" value={stats?.active || 0} color="bg-violet-500/15 text-violet-400" sub="Active deals" />
        <StatCard icon={FiCheckCircle} label="Won Deals" value={stats?.won || 0} color="bg-emerald-500/15 text-emerald-400" sub={`${winRate}% win rate`} />
        <StatCard icon={FiDollarSign} label="Revenue" value={formatCurrency(stats?.revenue || 0)} color="bg-amber-500/15 text-amber-400" sub="From won deals" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiXCircle} label="Lost Deals" value={stats?.lost || 0} color="bg-red-500/15 text-red-400" />
        <StatCard icon={FiCalendar} label="Follow-ups" value={stats?.pendingFollowUps || 0} color="bg-cyan-500/15 text-cyan-400" sub="Pending" />
        <StatCard icon={FiActivity} label="Contacted" value={stats?.contacted || 0} color="bg-blue-500/15 text-blue-400" />
        <StatCard icon={FiUsers} label="Negotiation" value={stats?.negotiation || 0} color="bg-orange-500/15 text-orange-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly chart */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="font-display font-semibold text-white mb-5">Monthly Lead Activity</h3>
          {monthlyData.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-slate-500 text-sm">No data available yet</div>
          ) : (
            <div className="flex items-end gap-3 h-48">
              {monthlyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center justify-end" style={{ height: '160px' }}>
                    <div className="w-full bg-brand-500/20 hover:bg-brand-500/40 rounded-t-lg transition-all relative group" style={{ height: `${Math.round((d.count / maxCount) * 140)}px`, minHeight: '4px' }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 px-2 py-1 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">{d.count} leads</div>
                    </div>
                  </div>
                  <span className="text-slate-500 text-xs">{months[(d._id.month - 1)]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pipeline mini */}
        <div className="card p-6">
          <h3 className="font-display font-semibold text-white mb-4">Pipeline Status</h3>
          <div className="space-y-3">
            {[
              { label: 'New Lead', value: stats?.total ? stats.total - stats.active - stats.won - stats.lost : 0, color: 'bg-slate-500' },
              { label: 'Contacted', value: stats?.contacted || 0, color: 'bg-blue-500' },
              { label: 'Proposal', value: stats?.proposal || 0, color: 'bg-violet-500' },
              { label: 'Negotiation', value: stats?.negotiation || 0, color: 'bg-amber-500' },
              { label: 'Won', value: stats?.won || 0, color: 'bg-emerald-500' },
              { label: 'Lost', value: stats?.lost || 0, color: 'bg-red-500' },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">{label}</span><span className="text-slate-300 font-medium">{value}</span></div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${stats?.total ? (value / stats.total) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activities */}
      <div className="card p-6">
        <h3 className="font-display font-semibold text-white mb-5">Recent Activities</h3>
        {activities.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">No activities yet. Start by creating leads!</p>
        ) : (
          <div className="space-y-3">
            {activities.map((act) => (
              <div key={act._id} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors">
                <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-sm flex-shrink-0">
                  {activityIcons[act.action] || '📋'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 text-sm"><span className="font-medium text-white">{act.user?.name}</span> — {act.description || act.action}</p>
                  {act.lead && <p className="text-slate-500 text-xs mt-0.5">{(act.lead as any).companyName}</p>}
                </div>
                <span className="text-slate-500 text-xs whitespace-nowrap">{timeAgo(act.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
