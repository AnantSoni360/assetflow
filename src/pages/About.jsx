import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, XCircle, Lightbulb, Monitor, ShieldCheck, 
  Activity, Users, HeartHandshake, ChevronDown, ArrowRight 
} from 'lucide-react';
import './About.css';

const About = () => {
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    { q: "What is AssetFlow?", a: "AssetFlow is a modern IT Asset and Service Management platform designed to replace spreadsheets with intelligent, automated workflows." },
    { q: "Who is AssetFlow designed for?", a: "It's built for IT teams, Service Engineers, and Operations Managers in mid-market to enterprise companies." },
    { q: "Is AssetFlow cloud-based?", a: "Yes, AssetFlow is a fully cloud-native SaaS platform ensuring 99.9% uptime and zero maintenance overhead." },
    { q: "Can I import my existing asset data?", a: "Absolutely. We provide one-click CSV imports for all your existing assets and user records." },
    { q: "Does AssetFlow support multiple companies?", a: "Our Enterprise plan supports multi-workspace architecture, perfect for MSPs or conglomerates." },
    { q: "Is employee data secure?", a: "Data security is our top priority. We use end-to-end encryption and SOC2 compliant infrastructure." }
  ];

  return (
    <main className="about-page animate-fade-in">
      
      {/* 1. Hero Section */}
      <section className="about-hero">
        <div className="container about-hero-container">
          <div className="about-hero-text">
            <h1 className="about-title">Building the Future of IT Asset & Service Management</h1>
            <p className="about-subtitle">
              AssetFlow helps organizations simplify IT asset tracking, automate service requests, and empower IT teams with intelligent workflows—all from a single, secure platform.
            </p>
          </div>
          <div className="about-hero-visual">
            <div className="floating-stat stat-1 glass-panel">
              <span className="stat-number">5,000+</span>
              <span className="stat-label">Companies Onboarded</span>
            </div>
            <div className="floating-stat stat-2 glass-panel">
              <span className="stat-number">2M+</span>
              <span className="stat-label">Assets Managed</span>
            </div>
            <div className="floating-stat stat-3 glass-panel">
              <span className="stat-number">15m</span>
              <span className="stat-label">Avg. Resolution Time</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Our Story */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="story-container glass-panel">
            <h2>Our Story</h2>
            <p>
              Many organizations still rely on emails, spreadsheets, and manual processes to manage IT assets and support requests. As businesses grow, these methods become inefficient, making it difficult to track assets, assign engineers, and resolve issues on time.
            </p>
            <p>
              <strong>AssetFlow was built to replace these disconnected processes</strong> with one centralized platform that brings together asset management, ticketing, engineer workflows, inventory tracking, and analytics. We believe IT teams shouldn't be bogged down by chaos—they should be empowered by clarity.
            </p>
          </div>
        </div>
      </section>

      {/* 3. The Problem We Solve (Before vs After) */}
      <section className="section container">
        <h2 className="section-title text-center">The Problem We Solve</h2>
        <div className="comparison-grid">
          <div className="comparison-card before-card glass-panel">
            <h3>Before AssetFlow</h3>
            <ul className="comparison-list">
              <li><XCircle color="#ef4444" /> Excel spreadsheets</li>
              <li><XCircle color="#ef4444" /> Lost service requests</li>
              <li><XCircle color="#ef4444" /> No asset visibility</li>
              <li><XCircle color="#ef4444" /> Manual engineer assignment</li>
              <li><XCircle color="#ef4444" /> Slow issue resolution</li>
              <li><XCircle color="#ef4444" /> Poor reporting</li>
            </ul>
          </div>
          <div className="comparison-card after-card glass-panel">
            <h3>With AssetFlow</h3>
            <ul className="comparison-list">
              <li><CheckCircle2 color="#10b981" /> Centralized platform</li>
              <li><CheckCircle2 color="#10b981" /> Smart ticket management</li>
              <li><CheckCircle2 color="#10b981" /> Real-time asset tracking</li>
              <li><CheckCircle2 color="#10b981" /> Engineer workflow automation</li>
              <li><CheckCircle2 color="#10b981" /> Live analytics</li>
              <li><CheckCircle2 color="#10b981" /> AI-powered insights</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4 & 5. Mission & Vision */}
      <section className="section mission-vision-section text-center">
        <div className="container">
          <div className="mission-block">
            <h2 className="section-title">Our Mission</h2>
            <p className="statement-text">
              "To help organizations simplify IT operations through intelligent asset management, streamlined service workflows, and data-driven decision-making."
            </p>
          </div>
          <div className="vision-block mt-12">
            <h2 className="section-title">Our Vision</h2>
            <p className="statement-text">
              "To become a trusted platform that enables organizations of all sizes to manage their IT assets efficiently, reduce downtime, and deliver better support experiences."
            </p>
          </div>
        </div>
      </section>

      {/* 6. Core Values */}
      <section className="section bg-gray-50">
        <div className="container">
          <h2 className="section-title text-center">Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card glass-panel">
              <Lightbulb className="value-icon" />
              <h3>Innovation</h3>
              <p>Continuously improving how organizations manage IT operations.</p>
            </div>
            <div className="value-card glass-panel">
              <Monitor className="value-icon" />
              <h3>Simplicity</h3>
              <p>Making complex workflows easy to understand and use.</p>
            </div>
            <div className="value-card glass-panel">
              <ShieldCheck className="value-icon" />
              <h3>Security</h3>
              <p>Protecting organizational data with secure architecture.</p>
            </div>
            <div className="value-card glass-panel">
              <CheckCircle2 className="value-icon" />
              <h3>Reliability</h3>
              <p>Building dependable systems businesses can trust.</p>
            </div>
            <div className="value-card glass-panel">
              <Activity className="value-icon" />
              <h3>Transparency</h3>
              <p>Keeping every stakeholder informed with real-time updates.</p>
            </div>
            <div className="value-card glass-panel">
              <HeartHandshake className="value-icon" />
              <h3>Customer Success</h3>
              <p>Helping organizations improve productivity through better IT management.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Why Choose AssetFlow */}
      <section className="section container">
        <div className="why-choose-box glass-panel">
          <h2 className="section-title text-center">Why Choose AssetFlow</h2>
          <div className="features-list-grid">
            <span><CheckCircle2 size={16} /> Multi-workspace architecture</span>
            <span><CheckCircle2 size={16} /> Automatic user onboarding</span>
            <span><CheckCircle2 size={16} /> CSV data import</span>
            <span><CheckCircle2 size={16} /> Asset lifecycle management</span>
            <span><CheckCircle2 size={16} /> Smart ticket workflow</span>
            <span><CheckCircle2 size={16} /> Engineer assignment</span>
            <span><CheckCircle2 size={16} /> Inventory management</span>
            <span><CheckCircle2 size={16} /> AI-powered analytics</span>
            <span><CheckCircle2 size={16} /> Cloud-based access</span>
            <span><CheckCircle2 size={16} /> Scalable architecture</span>
          </div>
        </div>
      </section>

      {/* 8. Our Journey (Animated Timeline) */}
      <section className="section bg-gray-50">
        <div className="container">
          <h2 className="section-title text-center">Our Journey</h2>
          <div className="journey-timeline">
            <div className="journey-item">
              <div className="journey-dot"></div>
              <div className="journey-content glass-panel">
                <h3>Idea</h3>
                <p>Recognizing the pain of spreadsheet-based IT management.</p>
              </div>
            </div>
            <div className="journey-item">
              <div className="journey-dot"></div>
              <div className="journey-content glass-panel">
                <h3>Research</h3>
                <p>Interviewing hundreds of IT admins and engineers.</p>
              </div>
            </div>
            <div className="journey-item">
              <div className="journey-dot"></div>
              <div className="journey-content glass-panel">
                <h3>Design</h3>
                <p>Crafting a premium, consumer-grade SaaS interface.</p>
              </div>
            </div>
            <div className="journey-item">
              <div className="journey-dot"></div>
              <div className="journey-content glass-panel">
                <h3>Development</h3>
                <p>Building the core infrastructure and workflow engines.</p>
              </div>
            </div>
            <div className="journey-item">
              <div className="journey-dot"></div>
              <div className="journey-content glass-panel">
                <h3>Testing</h3>
                <p>Rigorous security audits and beta customer onboarding.</p>
              </div>
            </div>
            <div className="journey-item">
              <div className="journey-dot highlight"></div>
              <div className="journey-content glass-panel border-primary">
                <h3>Launch</h3>
                <p>AssetFlow v1 goes live to the public.</p>
              </div>
            </div>
            <div className="journey-item">
              <div className="journey-dot pulse"></div>
              <div className="journey-content glass-panel">
                <h3>Continuous Improvement</h3>
                <p>Shipping updates, listening to feedback, and scaling up.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Built By Developers */}
      <section className="section container text-center">
        <h2 className="section-title">Built by Developers Passionate About Better IT Management</h2>
        <div className="team-card glass-panel mx-auto">
          <div className="team-avatar">
            <Users size={40} color="var(--primary)" />
          </div>
          <h3>AssetFlow Engineering</h3>
          <p className="team-role">Product & Development Team</p>
          <p className="team-bio">
            We are a group of former IT admins, software engineers, and product designers who experienced the chaos of enterprise hardware management firsthand. We built AssetFlow to be the tool we always wished we had.
          </p>
        </div>
      </section>

      {/* 10. FAQs */}
      <section className="section bg-gray-50">
        <div className="container">
          <h2 className="section-title text-center">Frequently Asked Questions</h2>
          <div className="faq-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {faqs.map((faq, idx) => (
              <div key={idx} className={`faq-item glass-panel ${openFaq === idx ? 'open' : ''}`} style={{ background: 'white', marginBottom: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div className="faq-question" onClick={() => toggleFaq(idx)} style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
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

      {/* 11. Final CTA */}
      <section className="section text-center">
        <div className="container">
          <h2 className="section-title">Ready to Transform Your IT Operations?</h2>
          <div className="hero-buttons justify-center mt-8">
            <button className="btn-primary">Start Free Trial <ArrowRight size={18} /></button>
            <button className="btn-outline">Book a Demo</button>
          </div>
        </div>
      </section>

    </main>
  );
};

export default About;
