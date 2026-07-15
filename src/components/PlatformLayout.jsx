import React from 'react';
import { Navigate, Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LayoutDashboard, Building2, CreditCard, Settings, LogOut, Bell, Search, User } from 'lucide-react';
import './AppLayout.css';

const PlatformLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // If not logged in, or not a platform admin, redirect
  if (!user || user.role !== 'Platform_Super_Admin') {
    return <Navigate to="/platform/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/platform/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/platform' },
    { name: 'Workspaces', icon: <Building2 size={20} />, path: '/platform/workspaces' },
    { name: 'Subscriptions', icon: <CreditCard size={20} />, path: '/platform/billing' },
    { name: 'Global Settings', icon: <Settings size={20} />, path: '/platform/settings' },
  ];

  return (
    <div className="app-layout" style={{ background: '#f8fafc' }}>
      
      {/* Sidebar */}
      <aside className="app-sidebar" style={{ background: '#0f172a', borderRight: 'none', color: '#f8fafc' }}>
        <div className="sidebar-brand" style={{ borderBottom: '1px solid #1e293b', flexDirection: 'column', height: 'auto', padding: '24px', alignItems: 'flex-start' }}>
          <div className="logo" style={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={28} color="#3b82f6" />
            <span style={{ fontWeight: '700' }}>AssetFlow</span>
          </div>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8', marginTop: '12px', display: 'block', fontWeight: '600' }}>
            Platform Admin
          </span>
        </div>

        <nav className="sidebar-nav" style={{ marginTop: '24px' }}>
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end={item.path === '/platform'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                color: isActive ? '#ffffff' : '#94a3b8',
                background: isActive ? '#1e293b' : 'transparent',
                border: 'none',
              })}
            >
              {React.cloneElement(item.icon, { color: 'currentColor' })}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer" style={{ borderTop: '1px solid #1e293b' }}>
          <button className="sidebar-link btn-logout" onClick={handleLogout} style={{ color: '#ef4444', background: 'transparent', cursor: 'pointer' }}>
            <LogOut size={20} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="app-main">
        <header className="app-topbar" style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
          <div className="topbar-search">
            <Search size={20} color="#64748b" />
            <input type="text" placeholder="Search across all workspaces..." />
          </div>

          <div className="topbar-actions">
            <button className="icon-btn" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px' }}>
              <Bell size={20} color="#64748b" />
            </button>
            <div className="user-profile-btn" style={{ border: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <div className="user-avatar" style={{ background: '#3b82f6', width: '32px', height: '32px' }}>
                <User size={18} color="#ffffff" />
              </div>
              <div className="user-info" style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: '1.2' }}>
                <span className="user-name" style={{ fontSize: '13px', fontWeight: '600' }}>{user.name}</span>
                <span className="user-role" style={{ fontSize: '11px', color: '#64748b' }}>Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        <div className="app-content-area">
          <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
            <Outlet />
          </div>
        </div>
      </main>

    </div>
  );
};

export default PlatformLayout;
