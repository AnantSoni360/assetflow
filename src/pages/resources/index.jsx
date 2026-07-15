import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, BookOpen, FileText, LifeBuoy, HelpCircle, 
  Clock, Download, MessageSquare, ChevronDown, Image, 
  Terminal, FileOutput 
} from 'lucide-react';
import './Resources.css';

// --- Shared Data ---
const faqs = [
  { q: "How do I create a workspace?", a: "Sign up for an account, and you will be prompted to create your first workspace during onboarding." },
  { q: "Can I import my existing data?", a: "Yes, use the CSV import tool to bring in all your existing assets and user data." },
  { q: "How are employee accounts created?", a: "You can invite them via email, import via CSV, or use Active Directory SSO." },
  { q: "Is my company data secure?", a: "Yes, we use 256-bit encryption and are fully SOC2 compliant." },
  { q: "Can I assign multiple assets to one employee?", a: "Yes, an employee can have multiple assets checked out to them simultaneously." }
];

// --- 1. Resource Hub Page ---
export const ResourceHub = () => {
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="animate-fade-in">
      <section className="resource-hero">
        <div className="container">
          <h1 className="resource-title">AssetFlow Resources</h1>
          <p className="resource-subtitle">Everything you need to manage your IT assets like a pro. Find guides, read our blog, or get help.</p>
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input type="text" className="search-input" placeholder="Search documentation, articles, or FAQs..." />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section bg-gray-50">
        <div className="container">
          <h2 className="section-title text-center">Browse by Category</h2>
          <div className="categories-grid">
            <Link to="/resources/documentation" className="category-card" style={{ textDecoration: 'none' }}>
              <div className="category-icon"><BookOpen size={24} /></div>
              <h3 style={{ color: '#0F172A', marginBottom: '8px' }}>Documentation</h3>
              <p style={{ color: '#64748B', fontSize: '14px' }}>Detailed guides on setting up and using AssetFlow.</p>
            </Link>
            <Link to="/resources/blog" className="category-card" style={{ textDecoration: 'none' }}>
              <div className="category-icon"><FileText size={24} /></div>
              <h3 style={{ color: '#0F172A', marginBottom: '8px' }}>Blog</h3>
              <p style={{ color: '#64748B', fontSize: '14px' }}>Insights, tips, and best practices for IT management.</p>
            </Link>
            <Link to="/resources/help-center" className="category-card" style={{ textDecoration: 'none' }}>
              <div className="category-icon"><LifeBuoy size={24} /></div>
              <h3 style={{ color: '#0F172A', marginBottom: '8px' }}>Help Center</h3>
              <p style={{ color: '#64748B', fontSize: '14px' }}>Troubleshooting and account management help.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Blogs */}
      <section className="section container">
        <h2 className="section-title">Latest from the Blog</h2>
        <div className="blog-grid">
          <div className="blog-card">
            <div className="blog-image"><Image size={40} /></div>
            <div className="blog-content">
              <div className="blog-meta"><span>May 12, 2026</span><span>5 min read</span></div>
              <h3 className="blog-title">10 Best Practices for IT Asset Management</h3>
              <span className="blog-author">By Sarah Jenkins</span>
            </div>
          </div>
          <div className="blog-card">
            <div className="blog-image"><Image size={40} /></div>
            <div className="blog-content">
              <div className="blog-meta"><span>May 08, 2026</span><span>4 min read</span></div>
              <h3 className="blog-title">How to Reduce IT Support Response Time</h3>
              <span className="blog-author">By Alex Chen</span>
            </div>
          </div>
          <div className="blog-card">
            <div className="blog-image"><Image size={40} /></div>
            <div className="blog-content">
              <div className="blog-meta"><span>Apr 29, 2026</span><span>6 min read</span></div>
              <h3 className="blog-title">Getting Started with AssetFlow AI</h3>
              <span className="blog-author">By Michael Ross</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section bg-gray-50" id="faqs">
        <div className="container">
          <h2 className="section-title text-center">Frequently Asked Questions</h2>
          <div className="faq-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {faqs.map((faq, idx) => (
              <div key={idx} className={`faq-item glass-panel ${openFaq === idx ? 'open' : ''}`} style={{ background: 'white', marginBottom: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div className="faq-question" onClick={() => setOpenFaq(openFaq === idx ? null : idx)} style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <h4 style={{ margin: 0, fontSize: '16px', color: '#0F172A' }}>{faq.q}</h4>
                  <ChevronDown size={20} style={{ color: 'var(--primary)', transform: openFaq === idx ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                </div>
                <div className="faq-answer" style={{ padding: openFaq === idx ? '0 20px 20px' : '0 20px', maxHeight: openFaq === idx ? '200px' : '0', overflow: 'hidden', opacity: openFaq === idx ? 1 : 0, transition: '0.3s' }}>
                  <p style={{ color: '#475569', fontSize: '14px' }}>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Downloads */}
      <section className="section container" id="downloads">
        <h2 className="section-title text-center">Downloads & Templates</h2>
        <div className="downloads-list">
          <div className="download-item">
            <div className="dl-left"><FileOutput size={20} color="var(--primary)"/> Users CSV Template</div>
            <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '13px' }}><Download size={14} style={{ display: 'inline', marginRight: '6px' }}/> Download</button>
          </div>
          <div className="download-item">
            <div className="dl-left"><FileOutput size={20} color="var(--primary)"/> Assets CSV Template</div>
            <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '13px' }}><Download size={14} style={{ display: 'inline', marginRight: '6px' }}/> Download</button>
          </div>
          <div className="download-item">
            <div className="dl-left"><BookOpen size={20} color="var(--primary)"/> User Manual (PDF)</div>
            <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '13px' }}><Download size={14} style={{ display: 'inline', marginRight: '6px' }}/> Download</button>
          </div>
          <div className="download-item">
            <div className="dl-left"><FileText size={20} color="var(--primary)"/> Company Brochure</div>
            <button className="btn-outline" style={{ padding: '8px 16px', fontSize: '13px' }}><Download size={14} style={{ display: 'inline', marginRight: '6px' }}/> Download</button>
          </div>
        </div>
      </section>

    </main>
  );
};

// --- 2. Documentation Page ---
export const Documentation = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="docs-layout animate-fade-in">
      <aside className="docs-sidebar">
        <h4>Getting Started</h4>
        <ul>
          <li><a href="#" className="active">Introduction</a></li>
          <li><a href="#">Create a Workspace</a></li>
          <li><a href="#">Import CSV Files</a></li>
        </ul>
        <h4>Core Modules</h4>
        <ul>
          <li><a href="#">Asset Management</a></li>
          <li><a href="#">Ticket Management</a></li>
          <li><a href="#">Engineer Workflow</a></li>
        </ul>
        <h4>Advanced</h4>
        <ul>
          <li><a href="#">Reports & Analytics</a></li>
          <li><a href="#">AI Features</a></li>
          <li><a href="#">Integrations</a></li>
        </ul>
      </aside>
      <main className="docs-content">
        <h1>Introduction to AssetFlow</h1>
        <p>Welcome to the AssetFlow documentation. AssetFlow is a comprehensive IT Asset and Service Management platform designed for modern enterprises.</p>
        
        <h2>Core Concepts</h2>
        <p>Before you begin, it's helpful to understand the three main entities in AssetFlow:</p>
        <ul>
          <li style={{ marginBottom: '8px' }}><strong>Assets:</strong> Physical or digital items (laptops, monitors, software licenses).</li>
          <li style={{ marginBottom: '8px' }}><strong>Employees:</strong> The end-users in your organization who use the assets.</li>
          <li style={{ marginBottom: '8px' }}><strong>Tickets:</strong> Service requests raised by employees for repair or maintenance.</li>
        </ul>

        <h2>Quick Start</h2>
        <p>To get started quickly, we recommend navigating to the <strong>Settings</strong> panel and using our CSV Import tool to bring in your existing employee and asset lists.</p>
        
        <div style={{ padding: '20px', background: '#eff6ff', borderLeft: '4px solid var(--primary)', borderRadius: '4px', marginTop: '24px' }}>
          <strong>Pro Tip:</strong> You can integrate AssetFlow with Entra ID (Azure AD) for automatic employee syncing.
        </div>
      </main>
    </div>
  );
};

// --- 3. Blog Page ---
export const Blog = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <main className="animate-fade-in" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="container">
        <h1 className="resource-title text-center">AssetFlow Blog</h1>
        <p className="resource-subtitle text-center">Insights, tips & best practices for modern IT teams.</p>
        
        <div className="blog-grid mt-8">
          {[1,2,3,4,5,6].map((i) => (
            <div className="blog-card" key={i}>
              <div className="blog-image"><Image size={40} /></div>
              <div className="blog-content">
                <div className="blog-meta"><span>May {15-i}, 2026</span><span>{i+3} min read</span></div>
                <h3 className="blog-title">Sample Blog Title {i}: How to optimize your workflow</h3>
                <span className="blog-author">By AssetFlow Team</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

// --- 4. Help Center Page ---
export const HelpCenter = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <main className="animate-fade-in">
      <section className="resource-hero">
        <div className="container">
          <h1 className="resource-title">Need Help? We're Here for You</h1>
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input type="text" className="search-input" placeholder="Search for troubleshooting guides..." />
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="categories-grid">
          <div className="category-card"><h3 style={{ marginBottom: '12px' }}>Account & Login</h3><p style={{ fontSize: '14px', color: '#64748B' }}>Password resets, SSO issues, and profile settings.</p></div>
          <div className="category-card"><h3 style={{ marginBottom: '12px' }}>Workspace Setup</h3><p style={{ fontSize: '14px', color: '#64748B' }}>Inviting users, roles, and permissions.</p></div>
          <div className="category-card"><h3 style={{ marginBottom: '12px' }}>Billing</h3><p style={{ fontSize: '14px', color: '#64748B' }}>Invoices, upgrading plans, and payment methods.</p></div>
        </div>
      </section>
    </main>
  );
};

// --- 5. Release Notes Page ---
export const ReleaseNotes = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <main className="animate-fade-in" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="container">
        <h1 className="resource-title text-center">Release Notes</h1>
        <p className="resource-subtitle text-center">Keep track of the newest features, updates, and bug fixes.</p>
        
        <div className="timeline mt-8">
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h3>Version 2.1 <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 'normal', marginLeft: '12px' }}>May 10, 2026</span></h3>
              <ul>
                <li>Added QR Code Asset Tracking for mobile devices.</li>
                <li>Improved Dashboard rendering performance by 40%.</li>
                <li>New Engineer Assignment Workflow with drag-and-drop support.</li>
                <li>Fixed a bug where CSV imports timed out on large files.</li>
              </ul>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h3>Version 2.0 <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 'normal', marginLeft: '12px' }}>April 02, 2026</span></h3>
              <ul>
                <li>Introduced AI Ticket Priority classification.</li>
                <li>Added Multi-Workspace Support for enterprise customers.</li>
                <li>Redesigned the main navigation experience.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
