import React, { useState, useEffect } from 'react';
import { 
  Laptop, Ticket, Users, Activity, 
  ArrowRight, ShieldCheck, Zap, Server,
  BarChart, Map, Package, CheckCircle
} from 'lucide-react';

const DashboardDemo = () => {
  const [activeTab, setActiveTab] = useState('employee');

  return (
    <div className="glass-panel" style={{ marginTop: '100px', padding: '40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2>Product Demo</h2>
        <p>Experience the role-based interface instantly.</p>
      </div>
      
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '40px' }}>
        {['employee', 'admin', 'engineer'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'btn-primary' : 'btn-secondary'}
            style={{ textTransform: 'capitalize' }}
          >
            {tab} View
          </button>
        ))}
      </div>

      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        padding: '30px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        minHeight: '300px',
        transition: 'all 0.3s'
      }}>
        {activeTab === 'employee' && (
          <div className="animate-fade-in">
            <h3 style={{ marginBottom: '20px' }}>My Dashboard</h3>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1, padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
                <h4>My Assets</h4>
                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Laptop size={20} color="var(--primary)" /> MacBook Pro 16"
                </div>
              </div>
              <div style={{ flex: 1, padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
                <h4>Recent Tickets</h4>
                <div style={{ marginTop: '10px', color: 'var(--accent)' }}>
                  Ticket #2487 - In Progress
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'admin' && (
          <div className="animate-fade-in">
            <h3 style={{ marginBottom: '20px' }}>Global Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
                <Activity size={20} /> 99.9% Uptime
              </div>
              <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
                <Users size={20} /> 45 Active Engineers
              </div>
              <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px' }}>
                <BarChart size={20} /> 120 Open Tickets
              </div>
            </div>
          </div>
        )}
        {activeTab === 'engineer' && (
          <div className="animate-fade-in">
            <h3 style={{ marginBottom: '20px' }}>Today's Jobs</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '15px', borderLeft: '4px solid var(--accent)', background: '#f8fafc' }}>
                Fix MacBook Display - 10:00 AM <Map size={16} /> HQ Floor 3
              </div>
              <div style={{ padding: '15px', borderLeft: '4px solid var(--primary)', background: '#f8fafc' }}>
                Server Maintenance - 2:00 PM <Package size={16} /> Server Room B
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <main className="container animate-fade-in">
      {/* Hero Section */}
      <section className="section hero">
        <div className="hero-content">
          <div className="hero-text animate-slide-up">
            <h1 className="hero-title">
              Manage Every Asset.<br />
              Resolve Every Issue.<br />
              Without the Chaos.
            </h1>
            <p className="hero-subtitle">
              AssetFlow helps companies manage IT assets, service tickets, engineers, inventory, and maintenance—all from one platform.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary">
                Get Started <ArrowRight size={18} />
              </button>
              <button className="btn-secondary">
                Watch Demo
              </button>
            </div>
          </div>
          
          {/* 3D Floating Mockup */}
          <div className="hero-visual">
            <div className="floating-card card-1">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'var(--primary-light)', padding: '10px', borderRadius: '8px' }}>
                  <Ticket color="var(--primary)" size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>Ticket #2487</div>
                  <div style={{ fontSize: '12px', color: 'var(--accent)' }}>Assigned to Engineer</div>
                </div>
              </div>
            </div>

            <div className="floating-card card-2">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '8px' }}>
                  <Laptop color="#0F172A" size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>MacBook Pro 16"</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Status: Active</div>
                </div>
              </div>
            </div>

            <div className="floating-card card-3">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '8px' }}>
                  <BarChart color="#d97706" size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>System Health</div>
                  <div style={{ fontSize: '12px', color: '#d97706' }}>99.9% Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section">
        <div className="stats-section glass-panel">
          <div className="stat-card">
            <div className="stat-number">10,000+</div>
            <div className="stat-label">Assets Managed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">2,300+</div>
            <div className="stat-label">Tickets Solved</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">150+</div>
            <div className="stat-label">Companies</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">99.9%</div>
            <div className="stat-label">Uptime</div>
          </div>
        </div>
      </section>

      {/* Pipeline Section */}
      <section className="section">
        <h2 style={{ textAlign: 'center', fontSize: '40px' }}>Interactive Workflow</h2>
        <div className="pipeline-container">
          <div className="pipeline-step active">
            <div className="pipeline-icon"><Users size={32} /></div>
            <h4>Employee</h4>
          </div>
          <div className="pipeline-connector active"></div>
          
          <div className="pipeline-step">
            <div className="pipeline-icon"><Ticket size={32} /></div>
            <h4>Raise Ticket</h4>
          </div>
          <div className="pipeline-connector"></div>
          
          <div className="pipeline-step">
            <div className="pipeline-icon"><ShieldCheck size={32} /></div>
            <h4>Admin</h4>
          </div>
          <div className="pipeline-connector"></div>

          <div className="pipeline-step">
            <div className="pipeline-icon"><Server size={32} /></div>
            <h4>Engineer</h4>
          </div>
          <div className="pipeline-connector"></div>
          
          <div className="pipeline-step">
            <div className="pipeline-icon"><CheckCircle size={32} /></div>
            <h4>Completed</h4>
          </div>
        </div>
      </section>

      {/* Product Demo */}
      <DashboardDemo />

      {/* Bento Grid Features */}
      <section className="section">
        <h2 style={{ fontSize: '40px', marginBottom: '20px' }}>Everything you need.</h2>
        <div className="bento-grid">
          <div className="bento-item bento-large" style={{ background: 'linear-gradient(135deg, var(--primary-light), white)' }}>
            <div className="bento-icon"><Activity /></div>
            <h3 className="bento-title">Smart Dashboard</h3>
            <p>Real-time analytics and metrics at your fingertips. Monitor open tickets, active assets, and resolution times.</p>
          </div>
          
          <div className="bento-item">
            <div className="bento-icon"><Ticket /></div>
            <h3 className="bento-title">Smart Ticketing</h3>
            <p>AI-categorized tickets to the right engineer.</p>
          </div>
          
          <div className="bento-item">
            <div className="bento-icon"><Laptop /></div>
            <h3 className="bento-title">Asset Tracking</h3>
            <p>Complete lifecycle management of every device.</p>
          </div>
          
          <div className="bento-item bento-wide">
            <div className="bento-icon"><Package /></div>
            <h3 className="bento-title">Inventory Control</h3>
            <p>Never run out of spare parts. Automated alerts when stock is low.</p>
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="ai-section">
        <div className="ai-sphere"></div>
        <div className="ai-content">
          <Zap size={48} color="#a5b4fc" style={{ margin: '0 auto 24px' }} />
          <h2 className="ai-title">
            AI That Predicts Problems<br />
            Before They Become Downtime.
          </h2>
          <p style={{ fontSize: '20px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
            AssetFlow analyzes usage patterns and hardware diagnostics to suggest maintenance before an asset fails.
          </p>
        </div>
      </section>

    </main>
  );
}
