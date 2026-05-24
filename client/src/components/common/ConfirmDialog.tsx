import React from 'react';
import { Modal } from './Modal';
import { FiAlertTriangle } from 'react-icons/fi';
interface Props { isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string; confirmText?: string; isLoading?: boolean; }
export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', isLoading }: Props) => (
  <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
    <div className="text-center py-2">
      <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4"><FiAlertTriangle className="w-7 h-7 text-red-400" /></div>
      <h3 className="font-display font-semibold text-white text-lg mb-2">{title}</h3>
      <p className="text-slate-400 text-sm mb-6">{message}</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
        <button onClick={onConfirm} disabled={isLoading} className="flex-1 justify-center bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50">
          {isLoading ? 'Deleting...' : confirmText}
        </button>
      </div>
    </div>
  </Modal>
);
