import React, { ReactNode, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
interface ModalProps { isOpen: boolean; onClose: () => void; title: string; children: ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl'; }
export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  useEffect(() => { if (isOpen) document.body.style.overflow = 'hidden'; else document.body.style.overflow = ''; return () => { document.body.style.overflow = ''; }; }, [isOpen]);
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl animate-fade-in max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 flex-shrink-0">
          <h2 className="font-display font-semibold text-white text-lg">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"><FiX className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">{children}</div>
      </div>
    </div>
  );
};
