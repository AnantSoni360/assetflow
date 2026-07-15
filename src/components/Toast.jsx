import React, { useEffect, useState } from 'react';
import { CheckCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react';

const icons = {
  success: <CheckCircle size={18} color="#16a34a" />,
  info: <Info size={18} color="#2563eb" />,
  warning: <AlertTriangle size={18} color="#d97706" />,
  error: <XCircle size={18} color="#dc2626" />,
};

const colors = {
  success: { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
  info: { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
  warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e' },
  error: { bg: '#fef2f2', border: '#fecaca', text: '#991b1b' },
};

const ToastItem = ({ toast, onDismiss }) => {
  const [visible, setVisible] = useState(false);
  const c = colors[toast.type] || colors.info;

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 3700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: '10px',
      background: c.bg, border: `1px solid ${c.border}`, borderRadius: '10px',
      padding: '12px 14px', minWidth: '280px', maxWidth: '360px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
      transform: visible ? 'translateX(0)' : 'translateX(120%)',
      opacity: visible ? 1 : 0,
      transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
      pointerEvents: 'all',
    }}>
      <span style={{ marginTop: '1px', flexShrink: 0 }}>{icons[toast.type] || icons.info}</span>
      <span style={{ fontSize: '13px', fontWeight: 500, color: c.text, flex: 1, lineHeight: 1.4 }}>{toast.text}</span>
      <button onClick={() => { setVisible(false); setTimeout(() => onDismiss(toast.id), 300); }}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', flexShrink: 0, opacity: 0.5 }}>
        <X size={14} color={c.text} />
      </button>
    </div>
  );
};

const Toast = ({ toasts, dismissToast }) => {
  if (!toasts || toasts.length === 0) return null;
  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      display: 'flex', flexDirection: 'column', gap: '10px',
      zIndex: 9999, pointerEvents: 'none',
    }}>
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
};

export default Toast;
