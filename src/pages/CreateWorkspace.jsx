import React, { useState } from 'react';
import { API_URL } from '../../config';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft, Building, User, Lock, Mail } from 'lucide-react';
import './Login.css';

const CreateWorkspace = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    workspaceId: '',
    adminName: '',
    adminEmail: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (formData.password.length < 8) {
      return setError('Password must be at least 8 characters');
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        // Workspace created and admin logged in successfully.
        // Force full reload so AuthContext picks up the new cookie session
        window.location.href = '/workspace-setup';
      } else {
        setError(data.error || 'Failed to create workspace');
      }
    } catch (err) {
      setError('Network error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-layout animate-fade-in">
      
      <Link to="/login" className="back-to-home">
        <ArrowLeft size={16} /> Back to Login
      </Link>

      {/* LEFT SIDE: Visual */}
      <div className="login-visual-panel" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}>
        <div className="visual-content">
          <div className="visual-logo">
            <Activity size={32} color="#ffffff" />
            <span>AssetFlow Enterprise</span>
          </div>
          
          <h1 className="visual-title">Create Your Corporate Workspace</h1>
          <p className="visual-subtitle">
            Set up your isolated, secure multi-tenant environment. Manage users, track assets, and resolve tickets all from one centralized hub.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="login-form-panel" style={{ overflowY: 'auto' }}>
        <div className="form-container" style={{ padding: '40px 0' }}>
          
          <div className="form-header">
            <h2>Let's set up your company</h2>
            <p>Create your secure workspace and Super Admin account.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="error-message" style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
            
            <div className="input-group">
              <label>Company Name</label>
              <div style={{ position: 'relative' }}>
                <Building size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="e.g. ABC Technologies Pvt. Ltd." style={{ paddingLeft: '36px' }} required />
              </div>
            </div>

            <div className="input-group">
              <label>Workspace URL ID</label>
              <div className="workspace-input-wrapper">
                <span className="workspace-prefix">assetflow.com/</span>
                <input type="text" name="workspaceId" value={formData.workspaceId} onChange={handleChange} placeholder="abc-tech" required />
              </div>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>This cannot be changed later.</p>
            </div>

            <div className="auth-divider" style={{ margin: '24px 0' }}>
              <span>Super Admin Account</span>
            </div>

            <div className="input-group">
              <label>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input type="text" name="adminName" value={formData.adminName} onChange={handleChange} placeholder="Rahul Sharma" style={{ paddingLeft: '36px' }} required />
              </div>
            </div>

            <div className="input-group">
              <label>Work Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input type="email" name="adminEmail" value={formData.adminEmail} onChange={handleChange} placeholder="admin@abctech.com" style={{ paddingLeft: '36px' }} required />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" style={{ paddingLeft: '36px' }} required />
                </div>
              </div>
              
              <div className="input-group" style={{ flex: 1 }}>
                <label>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" style={{ paddingLeft: '36px' }} required />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full login-btn" disabled={loading} style={{ marginTop: '16px' }}>
              {loading ? 'Creating Workspace...' : 'Create Workspace'}
            </button>
          </form>

        </div>
      </div>

    </div>
  );
};

export default CreateWorkspace;

