import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, Mail, Lock } from 'lucide-react';
import '../Login.css';

const PlatformLogin = () => {
  const [email, setEmail] = useState('admin@assetflow.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { platformLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await platformLogin(email, password);
    if (result.success) {
      navigate('/platform');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="login-layout animate-fade-in" style={{ justifyContent: 'center', alignItems: 'center', background: '#0f172a' }}>
      
      <div style={{ maxWidth: '440px', width: '100%', background: 'white', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', padding: '40px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <Activity size={24} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>AssetFlow Admin</h2>
          <p style={{ color: '#64748b', fontSize: '15px' }}>
            Sign in to the global platform management console.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="error-message" style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
          
          <div className="input-group">
            <label>Platform Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ paddingLeft: '36px' }} required />
            </div>
          </div>

          <div className="input-group">
            <label>Master Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingLeft: '36px' }} required />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading} style={{ marginTop: '24px', padding: '12px', background: '#3b82f6' }}>
            {loading ? 'Authenticating...' : 'Access Platform'}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link to="/login" style={{ color: '#64748b', fontSize: '14px', textDecoration: 'none' }}>Return to Workspace Login</Link>
          </div>
        </form>

      </div>
    </div>
  );
};

export default PlatformLogin;
