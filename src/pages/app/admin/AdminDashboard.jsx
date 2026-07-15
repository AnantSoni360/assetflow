import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import { Users, Package, Ticket, Activity, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import '../Employee.css';

const AdminDashboard = () => {
  const { user, usersList } = useAuth();
  const { assets, tickets, inventory, spareParts, loading } = useData();

  if (loading) return <div>Loading admin metrics...</div>;

  // ── Real metrics from live data ──────────────────────────────
  const totalUsers = usersList.length;
  const itEngineers = usersList.filter(u => u.MappedRole === 'IT Engineer' || u.role === 'IT Engineer').length;
  const totalAssets = assets.length;
  const availableAssets = assets.filter(a => a.Status === 'Available').length;

  const activeTickets = tickets.filter(t =>
    !['Resolved', 'Closed', 'Cancelled', 'Closed - Duplicate'].includes(t.Status)
  ).length;
  const resolvedTickets = tickets.filter(t => t.Status === 'Resolved' || t.Status === 'Closed').length;
  const pendingSpareParts = (spareParts || []).filter(p => p.status === 'Pending').length;

  // Total inventory stock
  const totalStock = inventory.reduce((sum, item) => sum + (item.stock || 0), 0);

  const recentTickets = [...tickets].slice(0, 6);

  return (
    <div className="portal-container animate-fade-in">
      <div className="portal-header">
        <h1>Intec Service Hub Admin</h1>
        <p>Command center for IT operations, asset management, and employee support.</p>
      </div>

      {/* Live Metrics */}
      <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#f3e8ff', color: '#9333ea' }}>
            <Users size={24} />
          </div>
          <div className="metric-info">
            <h3>{totalUsers}</h3>
            <p>Total Employees</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
            <Package size={24} />
          </div>
          <div className="metric-info">
            <h3>{totalAssets}</h3>
            <p>Total Assets</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}>
            <Ticket size={24} />
          </div>
          <div className="metric-info">
            <h3>{activeTickets}</h3>
            <p>Active Tickets</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#dcfce7', color: '#22c55e' }}>
            <CheckCircle size={24} />
          </div>
          <div className="metric-info">
            <h3>{resolvedTickets}</h3>
            <p>Resolved Tickets</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#e0f2fe', color: '#0ea5e9' }}>
            <Users size={24} />
          </div>
          <div className="metric-info">
            <h3>{itEngineers}</h3>
            <p>IT Engineers</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
            <Package size={24} />
          </div>
          <div className="metric-info">
            <h3>{availableAssets}</h3>
            <p>Available Assets</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Activity size={24} />
          </div>
          <div className="metric-info">
            <h3>{totalStock}</h3>
            <p>Inventory Stock</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: pendingSpareParts > 0 ? '#fee2e2' : '#dcfce7', color: pendingSpareParts > 0 ? '#ef4444' : '#16a34a' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="metric-info">
            <h3>{pendingSpareParts}</h3>
            <p>Spare Part Requests</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-card main-card">
          <div className="card-header">
            <h2>Recent Global Activity</h2>
          </div>

          <div className="activity-list">
            {recentTickets.length === 0 ? (
              <p className="no-data">No recent ticket activity.</p>
            ) : (
              recentTickets.map((t, idx) => (
                <div className="activity-item" key={idx}>
                  <div className="activity-icon">
                    {t.Status === 'Resolved' || t.Status === 'Closed' ? (
                      <CheckCircle size={20} color="#22c55e" />
                    ) : (
                      <Clock size={20} color="#f59e0b" />
                    )}
                  </div>
                  <div className="activity-details" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <h4 style={{ margin: 0 }}>{t.Title}</h4>
                      <span className={`status-badge ${t.Status.toLowerCase().replace(/ /g, '-')}`}>
                        {t.Status}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
                      Requested by: <strong>{(t.Requested_By_Email || '').split('@')[0].replace(/\./g, ' ') || '—'}</strong>
                      {t.Assigned_To_Email && ` • Assigned to: ${t.Assigned_To_Email.split('@')[0].replace(/\./g, ' ')}`}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-card side-card">
          <div className="card-header">
            <h2>Ticket Breakdown</h2>
          </div>
          <div style={{ padding: '24px' }}>
            {[
              { label: 'New', color: '#f59e0b' },
              { label: 'Assigned', color: '#3b82f6' },
              { label: 'In Progress', color: '#8b5cf6' },
              { label: 'Waiting Parts', color: '#f97316' },
              { label: 'Resolved', color: '#10b981' },
              { label: 'Closed', color: '#64748b' },
            ].map(({ label, color }) => {
              const count = tickets.filter(t => t.Status === label).length;
              const pct = tickets.length > 0 ? Math.round((count / tickets.length) * 100) : 0;
              return (
                <div key={label} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                    <span style={{ color: '#0f172a', fontWeight: 500 }}>{label}</span>
                    <span style={{ color: '#64748b' }}>{count}</span>
                  </div>
                  <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '100px', transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
