import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../config';
import { Building2, Users, Laptop, TicketCheck, TrendingUp, Activity } from 'lucide-react';
import './Platform.css';

const PlatformDashboard = () => {
  const [stats, setStats] = useState({
    companies: 0,
    users: 0,
    assets: 0,
    tickets: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${API_URL}/api/platform/analytics');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch global analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const statCards = [
    { title: 'Total Companies', value: stats.companies, icon: <Building2 size={24} />, color: '#3b82f6', bg: '#eff6ff' },
    { title: 'Active Users', value: stats.users, icon: <Users size={24} />, color: '#10b981', bg: '#dcfce7' },
    { title: 'Assets Tracked', value: stats.assets, icon: <Laptop size={24} />, color: '#8b5cf6', bg: '#f3e8ff' },
    { title: 'Tickets Processed', value: stats.tickets, icon: <TicketCheck size={24} />, color: '#f59e0b', bg: '#fef3c7' }
  ];

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Activity className="animate-spin" size={32} color="#3b82f6" /></div>;
  }

  return (
    <div className="platform-page animate-fade-in">
      <div className="page-header" style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', color: '#0f172a', marginBottom: '8px' }}>Platform Overview</h1>
        <p style={{ color: '#64748b', fontSize: '16px' }}>Global analytics across all registered workspaces.</p>
      </div>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        {statCards.map((stat, i) => (
          <div key={i} className="stat-card" style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>{stat.title}</p>
              <h3 style={{ color: '#0f172a', fontSize: '28px', fontWeight: '700' }}>{stat.value.toLocaleString()}</h3>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a' }}>Growth Analytics</h3>
            <button className="btn-outline" style={{ fontSize: '13px', padding: '6px 12px' }}>This Month</button>
          </div>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
            <p style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} /> Chart Module Placeholder
            </p>
          </div>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', marginBottom: '24px' }}>Recent Workspaces</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Will fetch actual recent later, using a placeholder for aesthetic */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontWeight: '600' }}>IN</div>
              <div>
                <p style={{ fontWeight: '600', color: '#0f172a', fontSize: '14px' }}>Intec Service Hub</p>
                <p style={{ color: '#64748b', fontSize: '12px' }}>Created recently</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PlatformDashboard;

