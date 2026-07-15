import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import { Package, Ticket, CheckCircle, Clock } from 'lucide-react';
import './Employee.css';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { assets, tickets, loading } = useData();

  if (loading) return <div>Loading dashboard metrics...</div>;

  // Filter data for the logged in user
  const myAssets = assets.filter(a => a.Assigned_To_Email === user.email);
  const myTickets = tickets.filter(t => t.Requested_By_Email === user.email);
  
  const openTicketsCount = myTickets.filter(t => t.Status !== 'Resolved' && t.Status !== 'Closed').length;
  const resolvedTicketsCount = myTickets.filter(t => t.Status === 'Resolved' || t.Status === 'Closed').length;

  const recentTickets = myTickets.slice(0, 5); // top 5 most recent

  return (
    <div className="portal-container animate-fade-in">
      <div className="portal-header">
        <h1>Welcome back, {user.name ? user.name.split(' ')[0] : 'Employee'}!</h1>
        <p>Here is an overview of your assets and support requests.</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
            <Package size={24} />
          </div>
          <div className="metric-info">
            <h3>{myAssets.length}</h3>
            <p>Assigned Assets</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}>
            <Ticket size={24} />
          </div>
          <div className="metric-info">
            <h3>{openTicketsCount}</h3>
            <p>Open Tickets</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#dcfce7', color: '#22c55e' }}>
            <CheckCircle size={24} />
          </div>
          <div className="metric-info">
            <h3>{resolvedTicketsCount}</h3>
            <p>Resolved Tickets</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-card main-card">
          <div className="card-header">
            <h2>Recent Activity</h2>
            <Link to="/app/my-tickets" className="link-btn">View All</Link>
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
                  <div className="activity-details">
                    <h4>{t.Title}</h4>
                    <span className={`status-badge ${t.Status.toLowerCase().replace(' ', '-')}`}>
                      {t.Status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-card side-card">
          <div className="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <Link to="/app/raise-ticket" className="btn-primary w-full text-center block" style={{ padding: '12px', marginBottom: '12px', borderRadius: '8px', textDecoration: 'none' }}>
              Raise New Ticket
            </Link>
            <Link to="/app/my-assets" className="btn-outline w-full text-center block" style={{ padding: '12px', borderRadius: '8px', textDecoration: 'none' }}>
              View My Assets
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
