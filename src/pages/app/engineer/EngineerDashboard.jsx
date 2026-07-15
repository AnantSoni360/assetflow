import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import { Link } from 'react-router-dom';
import { Ticket, CheckCircle, Clock, Wrench } from 'lucide-react';
import '../Employee.css';

const EngineerDashboard = () => {
  const { user } = useAuth();
  const { tickets, spareParts, loading } = useData();

  if (loading) return <div>Loading engineer metrics...</div>;

  const myTickets = tickets.filter(t => t.Assigned_To_Email === user.email);
  const openTickets = myTickets.filter(t => t.Status !== 'Resolved' && t.Status !== 'Closed');
  const resolvedTickets = myTickets.filter(t => t.Status === 'Resolved' || t.Status === 'Closed');
  
  // Sort open tickets by Priority (Critical first, then High, Medium, Low)
  const priorityScore = { Critical: 4, High: 3, Medium: 2, Low: 1 };
  const sortedQueue = [...openTickets].sort((a, b) => {
    return (priorityScore[b.Priority] || 0) - (priorityScore[a.Priority] || 0);
  });
  
  const activeJob = sortedQueue.length > 0 ? sortedQueue[0] : null;

  return (
    <div className="portal-container animate-fade-in">
      <div className="portal-header">
        <h1>Engineer Workspace</h1>
        <p>Welcome back, {user.name ? user.name.split(' ')[0] : 'Engineer'}. Here is your current workload.</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
            <Ticket size={24} />
          </div>
          <div className="metric-info">
            <h3>{openTickets.length}</h3>
            <p>My Open Tickets</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#dcfce7', color: '#22c55e' }}>
            <CheckCircle size={24} />
          </div>
          <div className="metric-info">
            <h3>{resolvedTickets.length}</h3>
            <p>Total Resolved</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}>
            <Clock size={24} />
          </div>
          <div className="metric-info">
            <h3>1.2h</h3>
            <p>Avg Resolution Time</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#f3e8ff', color: '#9333ea' }}>
            <Wrench size={24} />
          </div>
          <div className="metric-info">
            <h3>{(spareParts || []).filter(p => p.requested_by_email === user.email && p.status === 'Pending').length}</h3>
            <p>Pending Spare Parts</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-card main-card">
          <div className="card-header">
            <h2>Current Queue</h2>
            <Link to="/app/assigned-tickets" className="link-btn">View All</Link>
          </div>
          
          <div className="activity-list">
            {sortedQueue.length === 0 ? (
              <p className="no-data">Your queue is empty. Great job!</p>
            ) : (
              sortedQueue.slice(0, 5).map((t, idx) => (
                <div className="activity-item" key={idx} style={idx === 0 ? { background: '#f8fafc', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #3b82f6' } : {}}>
                  <div className="activity-icon">
                    <Clock size={20} color="#f59e0b" />
                  </div>
                  <div className="activity-details" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <h4 style={{ margin: 0 }}>{t.Title}</h4>
                      <span className={`status-badge ${t.Priority ? t.Priority.toLowerCase() : ''}`}>
                        {t.Priority}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
                      Requested by: <strong>{(t.Requested_By_Email || '').split('@')[0].replace(/\./g, ' ') || '—'}</strong>
                      {idx === 0 && <span style={{ marginLeft: '12px', color: '#3b82f6', fontWeight: 600 }}>← Active Job</span>}
                    </p>
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
            <Link to="/app/assigned-tickets" className="btn-primary w-full text-center block" style={{ padding: '12px', marginBottom: '12px', borderRadius: '8px', textDecoration: 'none' }}>
              Update Ticket Status
            </Link>
            <button className="btn-outline w-full text-center block" style={{ padding: '12px', borderRadius: '8px' }}>
              Request Spare Part
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineerDashboard;
