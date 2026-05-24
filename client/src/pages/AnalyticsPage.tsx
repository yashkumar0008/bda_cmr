import React, { useEffect, useState } from 'react';
import { FiTrendingUp, FiTrendingDown, FiTarget, FiDollarSign, FiAward, FiBarChart2 } from 'react-icons/fi';
import api from '../api/axios';
import { formatCurrency } from '../utils';
import { Spinner } from '../components/common/Spinner';

export const AnalyticsPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/leads/stats').then(res => {
      setStats(res.data.data.stats);
      setMonthlyData(res.data.data.monthlyLeads);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;

  const winRate = stats?.total > 0 ? ((stats.won / stats.total) * 100).toFixed(1) : 0;
  const lossRate = stats?.total > 0 ? ((stats.lost / stats.total) * 100).toFixed(1) : 0;
  const conversionRate = stats?.total > 0 ? (((stats.won + stats.lost) / stats.total) * 100).toFixed(1) : 0;
  const avgDealSize = stats?.won > 0 ? Math.round(stats.revenue / stats.won) : 0;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const maxCount = Math.max(...monthlyData.map(d => d.count), 1);
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue || 0), 1);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Win Rate', value: `${winRate}%`, icon: FiAward, color: 'text-emerald-400 bg-emerald-500/15', trend: '+' },
          { label: 'Loss Rate', value: `${lossRate}%`, icon: FiTrendingDown, color: 'text-red-400 bg-red-500/15', trend: '-' },
          { label: 'Conversion', value: `${conversionRate}%`, icon: FiTrendingUp, color: 'text-brand-400 bg-brand-500/15', trend: '+' },
          { label: 'Avg Deal Size', value: formatCurrency(avgDealSize), icon: FiDollarSign, color: 'text-amber-400 bg-amber-500/15', trend: '+' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5 flex items-start gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}><Icon className="w-5 h-5" /></div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wider font-medium mb-1">{label}</p>
              <p className="text-white font-display font-bold text-2xl">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads per month bar chart */}
        <div className="card p-6">
          <h3 className="font-display font-semibold text-white mb-2">Leads Per Month</h3>
          <p className="text-slate-500 text-xs mb-5">Last 6 months activity</p>
          {monthlyData.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-slate-500 text-sm">No data available</div>
          ) : (
            <div className="flex items-end gap-3" style={{ height: '180px' }}>
              {monthlyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-slate-400 text-xs">{d.count}</span>
                  <div className="w-full flex flex-col justify-end" style={{ height: '140px' }}>
                    <div
                      className="w-full bg-brand-500 hover:bg-brand-400 rounded-t-lg transition-all"
                      style={{ height: `${Math.max((d.count / maxCount) * 130, 4)}px` }}
                    />
                  </div>
                  <span className="text-slate-500 text-xs">{months[d._id.month - 1]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Revenue bar chart */}
        <div className="card p-6">
          <h3 className="font-display font-semibold text-white mb-2">Monthly Revenue</h3>
          <p className="text-slate-500 text-xs mb-5">Won deals revenue trend</p>
          {monthlyData.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-slate-500 text-sm">No data available</div>
          ) : (
            <div className="flex items-end gap-3" style={{ height: '180px' }}>
              {monthlyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-slate-400 text-xs">{d.revenue ? `₹${Math.round(d.revenue / 1000)}K` : '0'}</span>
                  <div className="w-full flex flex-col justify-end" style={{ height: '140px' }}>
                    <div
                      className="w-full bg-emerald-500 hover:bg-emerald-400 rounded-t-lg transition-all"
                      style={{ height: `${Math.max(((d.revenue || 0) / maxRevenue) * 130, 4)}px` }}
                    />
                  </div>
                  <span className="text-slate-500 text-xs">{months[d._id.month - 1]}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-display font-semibold text-white mb-5">Lead Status Breakdown</h3>
          <div className="space-y-4">
            {[
              { label: 'New Lead', value: stats?.total - stats?.active - stats?.won - stats?.lost || 0, color: 'bg-slate-500', total: stats?.total },
              { label: 'Contacted', value: stats?.contacted || 0, color: 'bg-blue-500', total: stats?.total },
              { label: 'Proposal Sent', value: stats?.proposal || 0, color: 'bg-violet-500', total: stats?.total },
              { label: 'Negotiation', value: stats?.negotiation || 0, color: 'bg-amber-500', total: stats?.total },
              { label: 'Won', value: stats?.won || 0, color: 'bg-emerald-500', total: stats?.total },
              { label: 'Lost', value: stats?.lost || 0, color: 'bg-red-500', total: stats?.total },
            ].map(({ label, value, color, total }) => {
              const pct = total > 0 ? Math.round((value / total) * 100) : 0;
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-300">{label}</span>
                    <span className="text-slate-400">{value} <span className="text-slate-600">({pct}%)</span></span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary stats */}
        <div className="card p-6">
          <h3 className="font-display font-semibold text-white mb-5">Performance Summary</h3>
          <div className="space-y-3">
            {[
              { label: 'Total Leads', value: stats?.total || 0, icon: FiTarget, color: 'text-brand-400' },
              { label: 'Active Pipeline', value: stats?.active || 0, icon: FiBarChart2, color: 'text-violet-400' },
              { label: 'Deals Won', value: stats?.won || 0, icon: FiAward, color: 'text-emerald-400' },
              { label: 'Deals Lost', value: stats?.lost || 0, icon: FiTrendingDown, color: 'text-red-400' },
              { label: 'Total Revenue', value: formatCurrency(stats?.revenue || 0), icon: FiDollarSign, color: 'text-amber-400' },
              { label: 'Avg Deal Size', value: formatCurrency(avgDealSize), icon: FiDollarSign, color: 'text-cyan-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-slate-300 text-sm">{label}</span>
                </div>
                <span className="text-white font-semibold text-sm">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
