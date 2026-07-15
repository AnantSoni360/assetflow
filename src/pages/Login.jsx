import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Activity, ArrowLeft, Package, Ticket, Users, BarChart, 
  Rocket, Mail, Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('demo@intec.com');
  const [password, setPassword] = useState('password123');
  const [workspace, setWorkspace] = useState('intec');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Authenticate with backend API
    const result = await login(workspace, email, password);
    if (result.success) {
      if (!result.user.password_changed) {
        navigate('/force-change-password');
      } else {
        navigate('/app');
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="login-layout animate-fade-in">
      
      {/* Back to Home (Absolute positioning) */}
      <Link to="/" className="back-to-home">
        <ArrowLeft size={16} /> Back to Website
      </Link>

      {/* LEFT SIDE: Visual & Branding */}
      <div className="login-visual-panel">
        <div className="visual-content">
          <div className="visual-logo">
            <Activity size={32} color="#ffffff" />
            <span>AssetFlow</span>
          </div>
          
          <h1 className="visual-title">Welcome Back to AssetFlow</h1>
          <p className="visual-subtitle">
            Securely access your company's workspace to manage assets, service requests, and IT operations from one centralized platform.
          </p>

          <div className="floating-ui-container">
            <div className="floating-ui-card ui-1">
              <Package size={24} color="var(--primary)" />
              <div className="ui-text">
                <strong>Assets</strong>
                <span>2,401 Tracked</span>
              </div>
            </div>
            <div className="floating-ui-card ui-2">
              <Ticket size={24} color="var(--accent)" />
              <div className="ui-text">
                <strong>Tickets</strong>
                <span>14 Active</span>
              </div>
            </div>
            <div className="floating-ui-card ui-3">
              <Users size={24} color="#10b981" />
              <div className="ui-text">
                <strong>Engineers</strong>
                <span>8 Online</span>
              </div>
            </div>
            <div className="floating-ui-card ui-4">
              <BarChart size={24} color="#8b5cf6" />
              <div className="ui-text">
                <strong>Analytics</strong>
                <span>Live Status</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Authentication Flow */}
      <div className="login-form-panel">
        <div className="form-container">
          
          <div className="form-header">
            <h2>Log in to your workspace</h2>
            <p>Enter your workspace name and credentials to access your account.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="error-message" style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
            
            <div className="input-group">
              <label>Workspace Name / URL</label>
              <div className="workspace-input-wrapper">
                <span className="workspace-prefix">assetflow.com/</span>
                <input 
                  type="text" 
                  placeholder="e.g. intec" 
                  value={workspace} 
                  onChange={(e) => setWorkspace(e.target.value)} 
                />
              </div>
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="you@company.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  style={{ paddingRight: '40px' }}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ 
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', 
                    background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" defaultChecked />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>

            <button type="submit" className="btn-primary w-full login-btn">Login</button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <div className="social-logins">
            <button className="btn-social">
              <Mail size={18} /> Continue with Google
            </button>
            <button className="btn-social">
              <svg width="18" height="18" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg"><path d="M10 0H0v10h10V0zM21 0H11v10h10V0zM10 11H0v10h10V11zM21 11H11v10h10V11z" fill="#00a4ef"/></svg>
              Continue with Microsoft
            </button>
          </div>

          <div className="demo-highlight-box">
            <div className="demo-header">
              <div className="demo-badge"><Rocket size={14} /> Try the Demo</div>
            </div>
            <h3>Intec Service Hub</h3>
            <p>Explore a live demonstration of AssetFlow using a preconfigured sample company workspace.</p>
            <button className="btn-outline w-full mt-4">Access Demo Workspace</button>
          </div>

          <div className="create-workspace-prompt">
            <p>New to AssetFlow?</p>
            <Link to="/create-workspace" className="create-link">Create a Workspace</Link>
            <span className="create-subtext">Set up your company's secure workspace in just a few minutes.</span>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;
