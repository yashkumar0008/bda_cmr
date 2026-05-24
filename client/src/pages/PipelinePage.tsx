import React, { useEffect, useState, useCallback } from 'react';
import { FiPlus, FiDollarSign, FiCalendar } from 'react-icons/fi';
import api from '../api/axios';
import { Lead, Pipeline, LeadStatus } from '../types';
import { formatCurrency, formatDate, getInitials } from '../utils';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { LeadForm } from '../components/leads/LeadForm';
import { Spinner } from '../components/common/Spinner';
import { useToast } from '../context/ToastContext';

const COLUMNS: LeadStatus[] = ['New Lead', 'Contacted', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];

const colColors: Record<string, string> = {
  'New Lead': 'border-slate-500/30',
  'Contacted': 'border-blue-500/30',
  'Proposal Sent': 'border-violet-500/30',
  'Negotiation': 'border-amber-500/30',
  'Won': 'border-emerald-500/30',
  'Lost': 'border-red-500/30',
};
const colHeaderColors: Record<string, string> = {
  'New Lead': 'text-slate-400 bg-slate-500/10',
  'Contacted': 'text-blue-400 bg-blue-500/10',
  'Proposal Sent': 'text-violet-400 bg-violet-500/10',
  'Negotiation': 'text-amber-400 bg-amber-500/10',
  'Won': 'text-emerald-400 bg-emerald-500/10',
  'Lost': 'text-red-400 bg-red-500/10',
};

const LeadCard = ({ lead, onDragStart, onClick }: { lead: Lead; onDragStart: (e: React.DragEvent, leadId: string) => void; onClick: () => void }) => (
  <div
    draggable
    onDragStart={e => onDragStart(e, lead._id)}
    onClick={onClick}
    className="bg-slate-800 border border-slate-700 rounded-xl p-4 cursor-pointer hover:border-slate-600 hover:bg-slate-750 transition-all active:scale-95 group"
  >
    <div className="flex items-start justify-between mb-2">
      <h4 className="text-white font-medium text-sm leading-tight">{lead.companyName}</h4>
      <Badge label={lead.priority} />
    </div>
    <p className="text-slate-400 text-xs mb-3">{lead.contactPerson} • {lead.industry}</p>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1 text-emerald-400">
        <FiDollarSign className="w-3 h-3" />
        <span className="text-xs font-mono font-medium">{formatCurrency(lead.dealValue)}</span>
      </div>
      {lead.followUpDate && (
        <div className="flex items-center gap-1 text-slate-500 text-xs">
          <FiCalendar className="w-3 h-3" />
          <span>{formatDate(lead.followUpDate)}</span>
        </div>
      )}
    </div>
    {lead.assignedTo && (
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700">
        <div className="w-5 h-5 rounded-full bg-brand-500/20 flex items-center justify-center text-xs text-brand-400 font-medium">
          {getInitials(lead.assignedTo.name)}
        </div>
        <span className="text-slate-500 text-xs">{lead.assignedTo.name}</span>
      </div>
    )}
  </div>
);

export const PipelinePage = () => {
  const { showToast } = useToast();
  const [pipeline, setPipeline] = useState<Pipeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const fetchPipeline = useCallback(async () => {
    try {
      const res = await api.get('/leads/pipeline');
      setPipeline(res.data.data.pipeline);
    } catch (e) { showToast('Failed to load pipeline', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPipeline(); }, [fetchPipeline]);

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('leadId', leadId);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: LeadStatus) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    setDragOver(null);
    try {
      await api.put(`/leads/${leadId}/status`, { status: newStatus });
      showToast(`Lead moved to ${newStatus}`, 'success');
      fetchPipeline();
    } catch (err: any) { showToast(err.response?.data?.message || 'Failed to update status', 'error'); }
  };

  const totalValue = pipeline ? COLUMNS.reduce((sum, col) => sum + (pipeline[col]?.reduce((s, l) => s + l.dealValue, 0) || 0), 0) : 0;

  if (loading) return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="card px-4 py-2 flex items-center gap-2">
            <span className="text-slate-400 text-sm">Total Pipeline Value:</span>
            <span className="text-emerald-400 font-mono font-bold">{formatCurrency(totalValue)}</span>
          </div>
        </div>
        <button onClick={() => { setSelectedLead(null); setShowForm(true); }} className="btn-primary">
          <FiPlus className="w-4 h-4" /> New Lead
        </button>
      </div>

      {/* Kanban */}
      <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: '600px' }}>
        {COLUMNS.map(col => (
          <div
            key={col}
            className={`flex-shrink-0 w-72 border rounded-2xl flex flex-col transition-all ${colColors[col]} ${dragOver === col ? 'bg-slate-800/60 scale-[1.01]' : 'bg-slate-900/50'}`}
            onDragOver={e => { e.preventDefault(); setDragOver(col); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={e => handleDrop(e, col)}
          >
            {/* Column header */}
            <div className="p-4 border-b border-slate-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${colHeaderColors[col]}`}>{col}</span>
                </div>
                <span className="text-slate-400 text-sm font-medium">{pipeline?.[col]?.length || 0}</span>
              </div>
              {pipeline?.[col] && pipeline[col].length > 0 && (
                <p className="text-slate-600 text-xs mt-1.5">{formatCurrency(pipeline[col].reduce((s, l) => s + l.dealValue, 0))}</p>
              )}
            </div>

            {/* Cards */}
            <div className="flex-1 p-3 space-y-3 kanban-col">
              {pipeline?.[col]?.map(lead => (
                <LeadCard key={lead._id} lead={lead} onDragStart={handleDragStart} onClick={() => { setSelectedLead(lead); setShowDetail(true); }} />
              ))}
              {(!pipeline?.[col] || pipeline[col].length === 0) && (
                <div className="h-24 flex items-center justify-center text-slate-600 text-sm border border-dashed border-slate-800 rounded-xl">
                  Drop leads here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Create New Lead" size="lg">
        <LeadForm lead={selectedLead} onSuccess={() => { setShowForm(false); fetchPipeline(); }} onCancel={() => setShowForm(false)} />
      </Modal>

      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Lead Details" size="md">
        {selectedLead && (
          <div className="space-y-4">
            <div>
              <h3 className="font-display font-bold text-white text-lg">{selectedLead.companyName}</h3>
              <p className="text-slate-400 text-sm">{selectedLead.contactPerson}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge label={selectedLead.status} />
              <Badge label={selectedLead.priority} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[['Email', selectedLead.email], ['Phone', selectedLead.phone], ['Industry', selectedLead.industry], ['Deal Value', formatCurrency(selectedLead.dealValue)], ['Source', selectedLead.leadSource], ['Assigned', selectedLead.assignedTo?.name || 'None']].map(([k, v]) => (
                <div key={k} className="bg-slate-800/50 rounded-xl p-3"><p className="text-slate-500 text-xs mb-1">{k}</p><p className="text-slate-200 text-sm">{v}</p></div>
              ))}
            </div>
            {selectedLead.notes && <div className="bg-slate-800/50 rounded-xl p-4"><p className="text-slate-500 text-xs mb-2">Notes</p><p className="text-slate-300 text-sm">{selectedLead.notes}</p></div>}
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setShowDetail(false); setShowForm(true); }} className="btn-primary">Edit Lead</button>
              <button onClick={() => setShowDetail(false)} className="btn-secondary">Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
