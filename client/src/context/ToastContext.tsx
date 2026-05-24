import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';

type ToastType = 'success' | 'error' | 'warning' | 'info';
interface Toast { id: string; type: ToastType; message: string; }
interface ToastContextType { showToast: (message: string, type?: ToastType) => void; }

const ToastContext = createContext<ToastContextType | null>(null);

const icons = { success: FiCheckCircle, error: FiXCircle, warning: FiAlertTriangle, info: FiInfo };
const colors = {
  success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  error: 'bg-red-500/10 border-red-500/30 text-red-400',
  warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
  info: 'bg-brand-500/10 border-brand-500/30 text-brand-400',
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const remove = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-80">
        {toasts.map(toast => {
          const Icon = icons[toast.type];
          return (
            <div key={toast.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm animate-slide-in ${colors[toast.type]}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm flex-1 text-slate-200">{toast.message}</span>
              <button onClick={() => remove(toast.id)}><FiX className="w-4 h-4 text-slate-500 hover:text-slate-300" /></button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
};
