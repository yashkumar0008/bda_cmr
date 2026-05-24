import React, { useEffect, useState, useCallback } from 'react';
import { FiPlus, FiSearch, FiFilter, FiEdit2, FiTrash2, FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../api/axios';
import { Lead } from '../types';
import { formatCurrency, formatDate, getInitials, INDUSTRIES, LEAD_SOURCES, PRIORITIES, LEAD_STATUSES } from '../utils';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { LeadForm } from '../components/leads/LeadForm';
import { Spinner } from '../components/common/Spinner';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const LeadsPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '', industry: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10', ...filters });
      if (search) params.set('search', search);
      const res = await api.get(`/leads?${params}`);
      setLeads(res.data.data.leads);
      setTotal(res.data.data.total);
      setPages(res.data.data.pages);
    } catch (e) { showToast('Failed to fetch leads', 'error'); }
    finally { setLoading(false); }
  }, [page, search, filters]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/leads/${deleteId}`);
      showToast('Lead deleted', 'success');
      fetchLeads();
    } catch (e: any) { showToast(e.response?.data?.message || 'Delete failed', 'error'); }
    finally { setDeleting(false); setDeleteId(null); }
  };

  const canDelete = user?.role !== 'BDA Employee';

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input className="input pl-9" placeholder="Search leads..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`btn-secondary gap-2 ${showFilters ? 'bg-brand-500/15 text-brand-400 border-brand-500/20' : ''}`}>
            <FiFilter className="w-4 h-4" /> Filters
          </button>
        </div>
        <button onClick={() => { setSelectedLead(null); setShowForm(true); }} className="btn-primary">
          <FiPlus className="w-4 h-4" /> Add Lead
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card p-4 grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in">
          <select className="input text-sm" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All Status</option>
            {LEAD_STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select className="input text-sm" value={filters.priority} onChange={e => setFilters({ ...filters, priority: e.target.value })}>
            <option value="">All Priority</option>
            {PRIORITIES.map(p => <option key={p}>{p}</option>)}
          </select>
          <select className="input text-sm" value={filters.industry} onChange={e => setFilters({ ...filters, industry: e.target.value })}>
            <option value="">All Industries</option>
            {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
          </select>
          <button onClick={() => setFilters({ status: '', priority: '', industry: '' })} className="btn-secondary justify-center text-sm">Clear Filters</button>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <p className="text-slate-400 text-sm">{total} leads found</p>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-48"><Spinner /></div>
        ) : leads.length === 0 ? (
          <EmptyState icon={<FiSearch className="w-7 h-7" />} title="No leads found" description="Create your first lead to get started" action={<button onClick={() => setShowForm(true)} className="btn-primary"><FiPlus className="w-4 h-4" /> Add Lead</button>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  {['Company', 'Contact', 'Industry', 'Deal Value', 'Status', 'Priority', 'Assigned To', 'Follow-up', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-slate-400 text-xs uppercase tracking-wider font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {leads.map(lead => (
                  <tr key={lead._id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-4 py-3">
                      <p className="text-white font-medium text-sm">{lead.companyName}</p>
                      <p className="text-slate-500 text-xs">{lead.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-sm">{lead.contactPerson}</td>
                    <td className="px-4 py-3 text-slate-400 text-sm">{lead.industry}</td>
                    <td className="px-4 py-3 text-slate-300 text-sm font-mono">{formatCurrency(lead.dealValue)}</td>
                    <td className="px-4 py-3"><Badge label={lead.status} /></td>
                    <td className="px-4 py-3"><Badge label={lead.priority} /></td>
                    <td className="px-4 py-3">
                      {lead.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center text-xs text-brand-400 font-medium">
                            {getInitials(lead.assignedTo.name)}
                          </div>
                          <span className="text-slate-400 text-sm">{lead.assignedTo.name.split(' ')[0]}</span>
                        </div>
                      ) : <span className="text-slate-600 text-sm">Unassigned</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm">{lead.followUpDate ? formatDate(lead.followUpDate) : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setSelectedLead(lead); setShowDetail(true); }} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"><FiEye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => { setSelectedLead(lead); setShowForm(true); }} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"><FiEdit2 className="w-3.5 h-3.5" /></button>
                        {canDelete && <button onClick={() => setDeleteId(lead._id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors"><FiTrash2 className="w-3.5 h-3.5" /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800">
            <p className="text-slate-400 text-sm">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-40"><FiChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-40"><FiChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>

      {/* Lead Form Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={selectedLead ? 'Edit Lead' : 'Create New Lead'} size="lg">
        <LeadForm lead={selectedLead} onSuccess={() => { setShowForm(false); fetchLeads(); }} onCancel={() => setShowForm(false)} />
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Lead Details" size="lg">
        {selectedLead && (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display font-bold text-white text-xl">{selectedLead.companyName}</h3>
                <p className="text-slate-400">{selectedLead.contactPerson} • {selectedLead.email} • {selectedLead.phone}</p>
              </div>
              <Badge label={selectedLead.status} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Industry', selectedLead.industry], ['Deal Value', formatCurrency(selectedLead.dealValue)],
                ['Lead Source', selectedLead.leadSource], ['Priority', selectedLead.priority],
                ['Assigned To', selectedLead.assignedTo?.name || 'Unassigned'], ['Follow-up', selectedLead.followUpDate ? formatDate(selectedLead.followUpDate) : '—'],
                ['Created By', selectedLead.createdBy?.name || '—'], ['Created', selectedLead.createdAt ? formatDate(selectedLead.createdAt) : '—'],
              ].map(([label, value]) => (
                <div key={label} className="bg-slate-800/50 rounded-xl p-3">
                  <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-slate-200 text-sm font-medium">{value}</p>
                </div>
              ))}
            </div>
            {selectedLead.notes && (
              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Notes</p>
                <p className="text-slate-300 text-sm">{selectedLead.notes}</p>
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setShowDetail(false); setShowForm(true); }} className="btn-primary"><FiEdit2 className="w-4 h-4" /> Edit Lead</button>
              <button onClick={() => setShowDetail(false)} className="btn-secondary">Close</button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Lead?" message="This action cannot be undone. All associated data will be lost." isLoading={deleting} />
    </div>
  );
};
