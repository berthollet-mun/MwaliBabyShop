import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, MessageCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'whatsapp';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
  showWhatsApp: (title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const newToast: Toast = { ...toast, id };
    const duration = toast.duration ?? (toast.type === 'whatsapp' ? 5000 : 4000);

    setToasts(prev => [newToast, ...prev.slice(0, 4)]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const showSuccess = useCallback((title: string, message?: string) => {
    showToast({ type: 'success', title, message });
  }, [showToast]);

  const showError = useCallback((title: string, message?: string) => {
    showToast({ type: 'error', title, message });
  }, [showToast]);

  const showInfo = useCallback((title: string, message?: string) => {
    showToast({ type: 'info', title, message });
  }, [showToast]);

  const showWhatsApp = useCallback((title: string, message?: string) => {
    showToast({ type: 'whatsapp', title, message, duration: 5500 });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, showSuccess, showError, showInfo, showWhatsApp, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map(toast => {
          const isWhatsApp = toast.type === 'whatsapp';
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in ${
                isWhatsApp
                  ? 'bg-emerald-950/95 text-white border-emerald-700/80 shadow-emerald-950/40'
                  : isSuccess
                  ? 'bg-stone-900/95 text-white border-stone-800 shadow-black/30'
                  : isError
                  ? 'bg-rose-950/95 text-white border-rose-800/80 shadow-rose-950/40'
                  : 'bg-white text-stone-900 border-stone-200 shadow-stone-300/40'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isWhatsApp && <MessageCircle className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />}
                {isSuccess && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
                {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
                {!isWhatsApp && !isSuccess && !isError && <Info className="w-5 h-5 text-amber-600" />}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold leading-snug tracking-wide">
                  {toast.title}
                </h4>
                {toast.message && (
                  <p className="text-[11px] mt-0.5 text-stone-300 leading-relaxed break-words">
                    {toast.message}
                  </p>
                )}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-1 text-stone-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                aria-label="Fermer la notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
};
