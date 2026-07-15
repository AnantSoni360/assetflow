import React, { useState } from 'react';
import { Outlet, Navigate, Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { 
  Activity, LayoutDashboard, Users, Package, Ticket, 
  Settings, Bell, LogOut, Wrench, BarChart, FileText,
  Search, Menu, User, Brain
} from 'lucide-react';
import Toast from './Toast';
import ConnectionStatus from './ConnectionStatus';
import './AppLayout.css';

const AppLayout = () => {
  const { user, logout, changePassword, loading } = useAuth();
  const { notifications, unreadCount, markAllAsRead, toasts, dismissToast } = useNotifications();
  const location = useLocation();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  if (loading) {
    return <div className="app-loading">Loading workspace...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.password_changed) {
    return <Navigate to="/force-change-password" replace />;
  }

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="app-sidebar">
        <div className="sidebar-brand">
          <Activity size={24} color="var(--primary)" />
          <span>AssetFlow</span>
        </div>
        
        <div className="sidebar-workspace">
          <div className="workspace-name">Intec Service Hub</div>
          <div className="workspace-role">{user.MappedRole} Portal</div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/app" end className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>

          {user.MappedRole === 'Admin' && (
            <>
              <NavLink to="/app/users" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Users size={18} /> User Management
              </NavLink>
              <NavLink to="/app/all-assets" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Package size={18} /> Asset Management
              </NavLink>
              <NavLink to="/app/inventory" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <FileText size={18} /> Inventory
              </NavLink>
              <NavLink to="/app/all-tickets" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Ticket size={18} /> Ticket Management
              </NavLink>
              <NavLink to="/app/ai-predictions" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Brain size={18} /> AI Predictions
              </NavLink>
            </>
          )}

          {user.MappedRole === 'Employee' && (
            <>
              <NavLink to="/app/my-assets" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Package size={18} /> My Assets
              </NavLink>
              <NavLink to="/app/my-tickets" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Ticket size={18} /> My Tickets
              </NavLink>
            </>
          )}

          {user.MappedRole === 'IT Engineer' && (
            <>
              <NavLink to="/app/assigned-tickets" className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <Ticket size={18} /> Assigned Tickets
              </NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <Link to="/app/notifications" className="sidebar-link">
            <Bell size={20} />
            Notifications
          </Link>
          <button className="sidebar-link btn-logout" onClick={logout}>
            <LogOut size={20} />
            Logout
          </button>
          {/* Inline connection status in sidebar */}
          <ConnectionStatus />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="app-main">
        {/* Topbar */}
        <header className="app-topbar">
          <div className="topbar-search">
            <Search size={20} className="text-gray-400" />
            <input type="text" placeholder="Search anything..." />
          </div>
          <div className="topbar-actions">
            <div style={{ position: 'relative' }}>
              <button 
                className="icon-btn relative" 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (unreadCount > 0 && !showNotifications) {
                    // Mark read when opening
                    markAllAsRead();
                  }
                }}
              >
                <Bell size={20} />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="notifications-dropdown">
                  <div className="notif-header">
                    <h4>Notifications</h4>
                  </div>
                  <div className="notif-list">
                    {notifications.length === 0 ? (
                      <div className="notif-empty">No notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                          <div className={`notif-indicator ${n.type}`}></div>
                          <div className="notif-content">
                            <p>{n.text}</p>
                            <span>{new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link to="/app/profile" className="user-profile-btn" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="user-avatar"><User size={16} /></div>
              <span>{user.name}</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="app-content-area">
          <Outlet />
        </div>
      </main>

      {/* Global Real-Time UI */}
      <Toast toasts={toasts} dismissToast={dismissToast} />
      <ConnectionStatus />
    </div>
  );
};

export default AppLayout;
