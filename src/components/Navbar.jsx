import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, Menu, X, Search, Moon, Globe, 
  Laptop, Ticket, Users, Package, Zap, BarChart, 
  Activity, Link as LinkIcon, Building, Factory, HeartPulse, GraduationCap,
  BookOpen, FileText, LifeBuoy, HelpCircle, Clock, Download, Terminal, MessageSquare
} from 'lucide-react';
import './Navbar.css';

const Navbar = ({ scrolled }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (name) => {
    if (activeDropdown === name) setActiveDropdown(null);
    else setActiveDropdown(name);
  };

  const handleMouseEnter = (name) => {
    if (window.innerWidth > 768) {
      setActiveDropdown(name);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth > 768) {
      setActiveDropdown(null);
    }
  };

  return (
    <nav className={`modern-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setActiveDropdown(null)}>
          <div className="logo-icon-wrapper">
            <Activity size={24} color="#2563EB" />
          </div>
          <span className="logo-text">AssetFlow</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-nav">
          <div 
            className="nav-item has-dropdown mega-menu-trigger"
            onMouseEnter={() => handleMouseEnter('products')}
            onMouseLeave={handleMouseLeave}
          >
            <span className="nav-link">Products <ChevronDown size={14} className="dropdown-icon" /></span>
            
            {/* Products Mega Menu */}
            <div className={`mega-menu ${activeDropdown === 'products' ? 'active' : ''}`}>
              <div className="mega-menu-grid">
                <Link to="/products/asset-management" className="mega-menu-item" onClick={() => setActiveDropdown(null)}>
                  <div className="mega-menu-icon"><Laptop /></div>
                  <div>
                    <h4>Asset Management</h4>
                    <p>Track every company asset</p>
                  </div>
                </Link>
                <Link to="/products/ticket-management" className="mega-menu-item" onClick={() => setActiveDropdown(null)}>
                  <div className="mega-menu-icon"><Ticket /></div>
                  <div>
                    <h4>Ticket System</h4>
                    <p>Resolve issues faster</p>
                  </div>
                </Link>
                <Link to="/products/engineer-management" className="mega-menu-item" onClick={() => setActiveDropdown(null)}>
                  <div className="mega-menu-icon"><Users /></div>
                  <div>
                    <h4>Engineer Management</h4>
                    <p>Assign work intelligently</p>
                  </div>
                </Link>
                <Link to="/products/inventory" className="mega-menu-item" onClick={() => setActiveDropdown(null)}>
                  <div className="mega-menu-icon"><Package /></div>
                  <div>
                    <h4>Inventory</h4>
                    <p>Manage spare parts</p>
                  </div>
                </Link>
                <Link to="/products/ai-automation" className="mega-menu-item" onClick={() => setActiveDropdown(null)}>
                  <div className="mega-menu-icon"><Zap /></div>
                  <div>
                    <h4>AI Automation</h4>
                    <p>Predict failures</p>
                  </div>
                </Link>
                <Link to="/products/reports" className="mega-menu-item" onClick={() => setActiveDropdown(null)}>
                  <div className="mega-menu-icon"><BarChart /></div>
                  <div>
                    <h4>Analytics</h4>
                    <p>Business insights</p>
                  </div>
                </Link>
                <Link to="/products/integrations" className="mega-menu-item" onClick={() => setActiveDropdown(null)}>
                  <div className="mega-menu-icon"><LinkIcon /></div>
                  <div>
                    <h4>Integrations</h4>
                    <p>Connect your tools</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <div 
            className="nav-item has-dropdown mega-menu-trigger"
            onMouseEnter={() => handleMouseEnter('solutions')}
            onMouseLeave={handleMouseLeave}
          >
            <span className="nav-link">Solutions <ChevronDown size={14} className="dropdown-icon" /></span>
            
            {/* Solutions Mega Menu */}
            <div className={`mega-menu ${activeDropdown === 'solutions' ? 'active' : ''}`} style={{ width: '700px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                
                {/* Column 1: By Industry */}
                <div>
                  <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#64748B', marginBottom: '16px', letterSpacing: '1px' }}>By Industry</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Link to="/solutions/it-companies" className="mega-menu-item" onClick={() => setActiveDropdown(null)}>
                      <div className="mega-menu-icon" style={{ width: '36px', height: '36px' }}><Building size={18} /></div>
                      <div>
                        <h4>IT Companies</h4>
                        <p style={{ fontSize: '12px' }}>Centralize IT infrastructure</p>
                      </div>
                    </Link>
                    <Link to="/solutions/manufacturing" className="mega-menu-item" onClick={() => setActiveDropdown(null)}>
                      <div className="mega-menu-icon" style={{ width: '36px', height: '36px' }}><Factory size={18} /></div>
                      <div>
                        <h4>Manufacturing</h4>
                        <p style={{ fontSize: '12px' }}>Manage plants & floors</p>
                      </div>
                    </Link>
                    <Link to="/solutions/healthcare" className="mega-menu-item" onClick={() => setActiveDropdown(null)}>
                      <div className="mega-menu-icon" style={{ width: '36px', height: '36px' }}><HeartPulse size={18} /></div>
                      <div>
                        <h4>Healthcare</h4>
                        <p style={{ fontSize: '12px' }}>Ensure device readiness</p>
                      </div>
                    </Link>
                    <Link to="/solutions/education" className="mega-menu-item" onClick={() => setActiveDropdown(null)}>
                      <div className="mega-menu-icon" style={{ width: '36px', height: '36px' }}><GraduationCap size={18} /></div>
                      <div>
                        <h4>Education</h4>
                        <p style={{ fontSize: '12px' }}>Streamline school IT</p>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Column 2: By Team */}
                <div>
                  <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#64748B', marginBottom: '16px', letterSpacing: '1px' }}>By Team</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Link to="/solutions/by-team" className="mega-menu-item" onClick={() => setActiveDropdown(null)}>
                      <div className="mega-menu-icon" style={{ width: '36px', height: '36px' }}><Users size={18} /></div>
                      <div>
                        <h4>Unified Platform</h4>
                        <p style={{ fontSize: '12px' }}>Explore tailored workflows for IT Admins, Engineers, HR, and Employees.</p>
                      </div>
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>
          
          <Link to="/pricing" className="nav-link" onClick={() => setActiveDropdown(null)}>Pricing</Link>

          <div 
            className="nav-item has-dropdown mega-menu-trigger"
            onMouseEnter={() => handleMouseEnter('resources')}
            onMouseLeave={handleMouseLeave}
          >
            <span className="nav-link">Resources <ChevronDown size={14} className="dropdown-icon" /></span>
            
            {/* Resources Mega Menu */}
            <div className={`mega-menu ${activeDropdown === 'resources' ? 'active' : ''}`} style={{ width: '700px', left: '-200px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                
                {/* Column 1: Learn */}
                <div>
                  <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#64748B', marginBottom: '16px', letterSpacing: '1px' }}>Learn</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Link to="/resources/documentation" className="mega-menu-item" onClick={() => setActiveDropdown(null)}>
                      <div className="mega-menu-icon" style={{ width: '36px', height: '36px' }}><BookOpen size={18} /></div>
                      <div>
                        <h4>Documentation</h4>
                        <p style={{ fontSize: '12px' }}>Guides to set up AssetFlow</p>
                      </div>
                    </Link>
                    <Link to="/resources#api" className="mega-menu-item" onClick={() => setActiveDropdown(null)}>
                      <div className="mega-menu-icon" style={{ width: '36px', height: '36px' }}><Terminal size={18} /></div>
                      <div>
                        <h4>API Documentation</h4>
                        <p style={{ fontSize: '12px' }}>Build custom integrations</p>
                      </div>
                    </Link>
                    <Link to="/resources/blog" className="mega-menu-item" onClick={() => setActiveDropdown(null)}>
                      <div className="mega-menu-icon" style={{ width: '36px', height: '36px' }}><FileText size={18} /></div>
                      <div>
                        <h4>Blog</h4>
                        <p style={{ fontSize: '12px' }}>Insights and best practices</p>
                      </div>
                    </Link>
                    <Link to="/resources/release-notes" className="mega-menu-item" onClick={() => setActiveDropdown(null)}>
                      <div className="mega-menu-icon" style={{ width: '36px', height: '36px' }}><Clock size={18} /></div>
                      <div>
                        <h4>Release Notes</h4>
                        <p style={{ fontSize: '12px' }}>See what's new in AssetFlow</p>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Column 2: Support */}
                <div>
                  <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#64748B', marginBottom: '16px', letterSpacing: '1px' }}>Support</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Link to="/resources/help-center" className="mega-menu-item" onClick={() => setActiveDropdown(null)}>
                      <div className="mega-menu-icon" style={{ width: '36px', height: '36px' }}><LifeBuoy size={18} /></div>
                      <div>
                        <h4>Help Center</h4>
                        <p style={{ fontSize: '12px' }}>Troubleshooting and account help</p>
                      </div>
                    </Link>
                    <Link to="/resources#faqs" className="mega-menu-item" onClick={() => setActiveDropdown(null)}>
                      <div className="mega-menu-icon" style={{ width: '36px', height: '36px' }}><HelpCircle size={18} /></div>
                      <div>
                        <h4>FAQs</h4>
                        <p style={{ fontSize: '12px' }}>Common questions answered</p>
                      </div>
                    </Link>
                    <Link to="/resources#downloads" className="mega-menu-item" onClick={() => setActiveDropdown(null)}>
                      <div className="mega-menu-icon" style={{ width: '36px', height: '36px' }}><Download size={18} /></div>
                      <div>
                        <h4>Downloads</h4>
                        <p style={{ fontSize: '12px' }}>CSV Templates and Manuals</p>
                      </div>
                    </Link>
                    <Link to="/resources/help-center" className="mega-menu-item" onClick={() => setActiveDropdown(null)}>
                      <div className="mega-menu-icon" style={{ width: '36px', height: '36px' }}><MessageSquare size={18} /></div>
                      <div>
                        <h4>Contact Support</h4>
                        <p style={{ fontSize: '12px' }}>Get in touch with our team</p>
                      </div>
                    </Link>
                  </div>
                </div>

              </div>
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
                <Link to="/resources" style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }} onClick={() => setActiveDropdown(null)}>
                  View Resource Hub →
                </Link>
              </div>
            </div>
          </div>

          <Link to="/about" className="nav-link" onClick={() => setActiveDropdown(null)}>About</Link>
        </div>

        {/* Right Side Actions */}
        <div className="navbar-actions desktop-actions">
          <div className="action-icons">
            <Search size={18} className="icon-btn" />
            <Globe size={18} className="icon-btn" />
            <Moon size={18} className="icon-btn" />
          </div>
          <button className="btn-outline">Book Demo</button>
          
          <Link to="/login" className="btn-login" style={{ textDecoration: 'none', padding: '8px 16px', background: '#f1f5f9', color: '#0F172A', borderRadius: '4px', fontWeight: '500' }}>Login</Link>

          <button className="btn-primary">Start Free</button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>
      </div>

      {/* Mobile Menu Slide-in */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-links">
          <a href="#">Home</a>
          <a href="#">Products</a>
          <a href="#">Solutions</a>
          <a href="#">Pricing</a>
          <a href="#">Resources</a>
          <a href="#">About</a>
        </div>
        <div className="mobile-actions">
          <button className="btn-outline full-width">Book Demo</button>
          <Link to="/login" className="btn-text full-width">Login</Link>
          <button className="btn-primary full-width">Start Free</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
