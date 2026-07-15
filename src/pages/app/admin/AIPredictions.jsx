import React from 'react';
import { Brain, TrendingUp, AlertTriangle, BatteryWarning, Cpu, HardDrive } from 'lucide-react';
import '../Employee.css';

const AIPredictions = () => {
  return (
    <div className="portal-container animate-fade-in">
      <div className="portal-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Brain color="#8b5cf6" size={32} /> 
          AI Predictions & Analytics
        </h1>
        <p>Proactive hardware forecasting and ticket volume analysis powered by machine learning.</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card" style={{ background: '#f5f3ff', borderColor: '#ddd6fe' }}>
          <div className="metric-info" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <p style={{ color: '#6d28d9', margin: 0 }}>Predicted Ticket Volume (Next 7 Days)</p>
              <TrendingUp color="#7c3aed" size={20} />
            </div>
            <h3 style={{ color: '#4c1d95', fontSize: '32px' }}>+14%</h3>
            <p style={{ fontSize: '13px', color: '#7c3aed' }}>Expect ~45 new tickets (Software focus)</p>
          </div>
        </div>

        <div className="metric-card" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
          <div className="metric-info" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <p style={{ color: '#b91c1c', margin: 0 }}>High Risk Hardware</p>
              <AlertTriangle color="#dc2626" size={20} />
            </div>
            <h3 style={{ color: '#7f1d1d', fontSize: '32px' }}>12 Assets</h3>
            <p style={{ fontSize: '13px', color: '#dc2626' }}>Requires immediate inspection</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-card main-card">
          <div className="card-header">
            <h2>Hardware Failure Forecasts</h2>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>
                <BatteryWarning size={20} />
              </div>
              <div className="activity-details" style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0' }}>Lenovo ThinkPad T14 Battery Degradation</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
                  Serial: PFF-062980 • Assigned to: gaurav.kulkarni99@intec-demo.com
                </p>
                <div style={{ marginTop: '8px', background: '#f1f5f9', borderRadius: '4px', height: '6px', width: '100%', overflow: 'hidden' }}>
                  <div style={{ background: '#ef4444', height: '100%', width: '18%' }}></div>
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#ef4444', fontWeight: 600 }}>18% capacity remaining - Failure likely in 14 days</p>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>
                <HardDrive size={20} />
              </div>
              <div className="activity-details" style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0' }}>Dell PowerEdge R740 Storage Pre-failure</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
                  Serial: RMX-006026 • Server Infrastructure
                </p>
                <div style={{ marginTop: '8px', background: '#f1f5f9', borderRadius: '4px', height: '6px', width: '100%', overflow: 'hidden' }}>
                  <div style={{ background: '#f59e0b', height: '100%', width: '92%' }}></div>
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#f59e0b', fontWeight: 600 }}>Increased read errors detected - Monitor closely</p>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>
                <Cpu size={20} />
              </div>
              <div className="activity-details" style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px 0' }}>Dell OptiPlex 7090 Thermal Event</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
                  Serial: DYO-478104 • Assigned to: rohit.chopra1@intec-demo.com
                </p>
                <div style={{ marginTop: '8px', background: '#f1f5f9', borderRadius: '4px', height: '6px', width: '100%', overflow: 'hidden' }}>
                  <div style={{ background: '#f59e0b', height: '100%', width: '85%' }}></div>
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#f59e0b', fontWeight: 600 }}>Running 15% above normal average - Recommend cleaning</p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card side-card">
          <div className="card-header">
            <h2>AI Action Items</h2>
          </div>
          <div style={{ padding: '24px' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong style={{ display: 'block', fontSize: '14px', color: '#0F172A', marginBottom: '4px' }}>Order Replacement Batteries</strong>
                <span style={{ fontSize: '13px', color: '#64748B' }}>5 ThinkPad batteries are approaching EOL. Order now to prevent downtime.</span>
                <button className="btn-primary-small" style={{ marginTop: '12px', width: '100%' }}>Create Purchase Order</button>
              </li>
              <li style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong style={{ display: 'block', fontSize: '14px', color: '#0F172A', marginBottom: '4px' }}>Staffing Recommendation</strong>
                <span style={{ fontSize: '13px', color: '#64748B' }}>Predicted ticket spike on Monday. Schedule 1 additional IT Engineer.</span>
                <button className="btn-outline" style={{ marginTop: '12px', width: '100%', padding: '6px' }}>View Schedule</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPredictions;
