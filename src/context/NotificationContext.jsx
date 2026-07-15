import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_URL } from '../../config';
import { useSocket } from './SocketContext';

const NotificationContext = createContext();
export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  // Fetch persisted notifications from DB on mount
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications.map(n => ({ ...n, read: n.read === true })));
      }
    } catch {}
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  // Real-time: listen for incoming notifications via Socket.IO
  useEffect(() => {
    if (!socket) return;
    const handleNewNotif = (notif) => {
      setNotifications(prev => [{ ...notif, read: false }, ...prev]);
      // Show a toast
      showToast(notif.text, notif.type);
    };
    socket.on('notification_created', handleNewNotif);
    return () => socket.off('notification_created', handleNewNotif);
  }, [socket]);

  const showToast = (text, type = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const dismissToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  // Local-only add for optimistic feedback
  const addNotification = (text, type = 'info') => {
    showToast(text, type);
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try { await fetch(`${API_URL}/api/notifications/read-all', { method: 'PATCH' }); } catch {}
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAllAsRead, unreadCount, toasts, dismissToast, showToast }}>
      {children}
    </NotificationContext.Provider>
  );
};

