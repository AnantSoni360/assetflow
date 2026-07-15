import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../config';
import { useAuth } from '../../context/AuthContext';
import { Shield, Key, Clock, Monitor, Smartphone, Globe, Eye, EyeOff } from 'lucide-react';
import './Employee.css';

const SecurityProfile = () => {
  const { user, changePassword, logout } = useAuth();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState({ type: '', msg: '' });
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Show Password States
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/sessions');
        if (res.ok) {
          const data = await res.json();
          setSessions(data.sessions);
        }
      } catch (err) {
        console.error("Failed to fetch sessions");
      } finally {
        setLoadingSessions(false);
      }
    };
    fetchSessions();
  }, []);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', msg: 'New passwords do not match' });
      return;
    }
    
    setPasswordStatus({ type: 'info', msg: 'Updating password...' });
    const result = await changePassword(currentPassword, newPassword);
    
    if (result.success) {
      setPasswordStatus({ type: 'success', msg: 'Password updated successfully. You will be logged out in 3 seconds.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => {
        logout();
      }, 3000);
    } else {
      setPasswordStatus({ type: 'error', msg: result.error || 'Failed to update password' });
    }
  };

  return (
    <div className="portal-container animate-fade-in">
      <div className="portal-header">
        <h1>Security & Profile</h1>
        <p>Manage your account security, passwords, and active sessions.</p>
      </div>

      <div className="dashboard-sections" style={{ gap: '32px' }}>
        
        {/* Password Management */}
        <div className="dashboard-card main-card" style={{ flex: 1 }}>
          <div className="card-header">
            <h2><Key size={18} style={{ marginRight: '8px' }} /> Change Password</h2>
          </div>
          
          <form className="ticket-form" onSubmit={handlePasswordSubmit} style={{ marginTop: '24px' }}>
            
            {passwordStatus.msg && (
              <div className="error-message" style={{ 
                color: passwordStatus.type === 'success' ? '#16a34a' : (passwordStatus.type === 'error' ? '#ef4444' : '#3b82f6'),
                backgroundColor: passwordStatus.type === 'success' ? '#dcfce7' : (passwordStatus.type === 'error' ? '#fef2f2' : '#eff6ff'),
                padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' 
              }}>
                {passwordStatus.msg}
              </div>
            )}

            <div className="form-group">
              <label>Current Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showCurrent ? "text" : "password"} 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{ paddingRight: '40px' }}
                  required 
                />
                <button 
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center' }}
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            
            <div className="form-group">
              <label>New Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showNew ? "text" : "password"} 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ paddingRight: '40px' }}
                  required 
                />
                <button 
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center' }}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                Must be at least 8 characters, with 1 uppercase, 1 lowercase, 1 number, and 1 special character.
              </p>
            </div>
            
            <div className="form-group">
              <label>Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showConfirm ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ paddingRight: '40px' }}
                  required 
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center' }}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">Update Password</button>
            </div>
          </form>
        </div>

        {/* Login History */}
        <div className="dashboard-card side-card" style={{ flex: 1 }}>
          <div className="card-header">
            <h2><Shield size={18} style={{ marginRight: '8px' }} /> Login History</h2>
          </div>
          
          <div className="activity-list" style={{ marginTop: '16px' }}>
            {loadingSessions ? (
              <p>Loading history...</p>
            ) : sessions.length === 0 ? (
              <p className="no-data">No recent login history.</p>
            ) : (
              sessions.map(session => (
                <div className="activity-item" key={session.id}>
                  <div className="activity-icon" style={{ background: session.status === 'Success' ? '#dcfce7' : '#fee2e2', color: session.status === 'Success' ? '#16a34a' : '#ef4444' }}>
                    {session.status === 'Success' ? <Globe size={20} /> : <Shield size={20} />}
                  </div>
                  <div className="activity-details" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0 }}>{session.ip === '::1' || session.ip === '127.0.0.1' ? 'Local Network' : session.ip}</h4>
                      <span className={`status-badge ${session.status === 'Success' ? 'resolved' : 'warning'}`}>
                        {session.status}
                      </span>
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B', display: 'flex', gap: '16px' }}>
                      <span><Monitor size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}/> {session.device.substring(0, 30)}...</span>
                      <span><Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}/> {new Date(session.login_time).toLocaleString()}</span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
            <button className="btn-outline w-full" style={{ color: '#ef4444', borderColor: '#ef4444' }} onClick={logout}>
              Log out of all devices
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SecurityProfile;

