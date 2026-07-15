import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, XCircle, ChevronDown, Lock, Server, Shield, 
  RefreshCw, Users, Database, Zap, Quote, ArrowRight, Laptop 
} from 'lucide-react';
import './Pricing.css';

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  
  // Calculator State
  const [calcEmployees, setCalcEmployees] = useState(50);
  const [calcAssets, setCalcAssets] = useState(100);
  const [calcEngineers, setCalcEngineers] = useState(2);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const getRecommendedPlan = () => {
    if (calcEmployees > 250 || calcAssets > 1000 || calcEngineers > 15) return 'Enterprise';
    if (calcEmployees > 25 || calcAssets > 100 || calcEngineers > 0) return 'Professional';
    return 'Starter';
  };

  const recommendedPlan = getRecommendedPlan();

  return (
    <main className="pricing-page animate-fade-in">
      
      {/* Hero Section */}
      <section className="pricing-hero text-center">
        <div className="container">
          <h1 className="pricing-title">Simple, Transparent Pricing</h1>
          <p className="pricing-subtitle">
            Choose the plan that fits your organization's size and scale. Start free and upgrade as your business grows.
          </p>
          <div className="hero-buttons justify-center mt-8">
            <button className="btn-primary">Start Free</button>
            <button className="btn-outline">Book a Demo</button>
          </div>
        </div>
      </section>

      {/* Pricing Toggle */}
      <section className="pricing-toggle-section">
        <div className="toggle-wrapper">
          <span className={`toggle-label ${!isYearly ? 'active' : ''}`}>Monthly</span>
          <div className="toggle-switch" onClick={() => setIsYearly(!isYearly)}>
            <div className={`toggle-knob ${isYearly ? 'yearly' : 'monthly'}`}></div>
          </div>
          <span className={`toggle-label ${isYearly ? 'active' : ''}`}>
            Yearly <span className="save-badge">Save 20%</span>
          </span>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pricing-cards-section container">
        <div className="pricing-grid">
          
          {/* Starter */}
          <div className="pricing-card glass-panel">
            <div className="plan-header">
              <h3>Starter</h3>
              <p>Perfect for startups and small businesses.</p>
            </div>
            <div className="plan-price">
              <span className="currency">$</span>
              <span className="amount">{isYearly ? '0' : '0'}</span>
              <span className="period">/mo</span>
            </div>
            <button className="btn-outline w-full mb-8">Start Free</button>
            <ul className="plan-features">
              <li><CheckCircle2 size={18} className="feature-check" /> Up to 25 employees</li>
              <li><CheckCircle2 size={18} className="feature-check" /> Asset Management</li>
              <li><CheckCircle2 size={18} className="feature-check" /> Ticket Management</li>
              <li><CheckCircle2 size={18} className="feature-check" /> Email Notifications</li>
              <li><CheckCircle2 size={18} className="feature-check" /> Dashboard</li>
              <li><CheckCircle2 size={18} className="feature-check" /> Basic Reports</li>
              <li><CheckCircle2 size={18} className="feature-check" /> CSV Import</li>
              <li><CheckCircle2 size={18} className="feature-check" /> Community Support</li>
            </ul>
          </div>

          {/* Professional */}
          <div className="pricing-card glass-panel popular-card">
            <div className="popular-badge">⭐ Most Popular</div>
            <div className="plan-header">
              <h3>Professional</h3>
              <p>For growing companies that need more power.</p>
            </div>
            <div className="plan-price">
              <span className="currency">$</span>
              <span className="amount">{isYearly ? '79' : '99'}</span>
              <span className="period">/mo</span>
            </div>
            <button className="btn-primary w-full mb-8">Start Free Trial</button>
            <ul className="plan-features">
              <li><CheckCircle2 size={18} className="feature-check" /> <b>Up to 250 employees</b></li>
              <li><CheckCircle2 size={18} className="feature-check" /> <b>Engineer Management</b></li>
              <li><CheckCircle2 size={18} className="feature-check" /> <b>Inventory Management</b></li>
              <li><CheckCircle2 size={18} className="feature-check" /> <b>QR Code Tracking</b></li>
              <li><CheckCircle2 size={18} className="feature-check" /> Advanced Analytics</li>
              <li><CheckCircle2 size={18} className="feature-check" /> Custom Roles</li>
              <li><CheckCircle2 size={18} className="feature-check" /> AI Ticket Priority</li>
              <li><CheckCircle2 size={18} className="feature-check" /> Priority Support</li>
            </ul>
          </div>

          {/* Enterprise */}
          <div className="pricing-card glass-panel">
            <div className="plan-header">
              <h3>Enterprise</h3>
              <p>For large organizations with complex needs.</p>
            </div>
            <div className="plan-price">
              <span className="amount custom-price">Custom</span>
            </div>
            <button className="btn-outline w-full mb-8" style={{ marginTop: '6px' }}>Contact Sales</button>
            <ul className="plan-features">
              <li><CheckCircle2 size={18} className="feature-check" /> Unlimited employees</li>
              <li><CheckCircle2 size={18} className="feature-check" /> Unlimited assets</li>
              <li><CheckCircle2 size={18} className="feature-check" /> Multi-location support</li>
              <li><CheckCircle2 size={18} className="feature-check" /> Single Sign-On (SSO)</li>
              <li><CheckCircle2 size={18} className="feature-check" /> Audit Logs</li>
              <li><CheckCircle2 size={18} className="feature-check" /> Custom Integrations</li>
              <li><CheckCircle2 size={18} className="feature-check" /> Dedicated Account Manager</li>
              <li><CheckCircle2 size={18} className="feature-check" /> AI Predictive Maintenance</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Feature Comparison */}
      <section className="section container">
        <h2 className="section-title text-center">Compare Plans</h2>
        <div className="table-wrapper glass-panel">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Starter</th>
                <th>Professional</th>
                <th>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Asset Management</td>
                <td><CheckCircle2 size={20} className="text-green" /></td>
                <td><CheckCircle2 size={20} className="text-green" /></td>
                <td><CheckCircle2 size={20} className="text-green" /></td>
              </tr>
              <tr>
                <td>Ticket Management</td>
                <td><CheckCircle2 size={20} className="text-green" /></td>
                <td><CheckCircle2 size={20} className="text-green" /></td>
                <td><CheckCircle2 size={20} className="text-green" /></td>
              </tr>
              <tr>
                <td>Engineer Management</td>
                <td><XCircle size={20} className="text-gray" /></td>
                <td><CheckCircle2 size={20} className="text-green" /></td>
                <td><CheckCircle2 size={20} className="text-green" /></td>
              </tr>
              <tr>
                <td>Inventory Tracking</td>
                <td><XCircle size={20} className="text-gray" /></td>
                <td><CheckCircle2 size={20} className="text-green" /></td>
                <td><CheckCircle2 size={20} className="text-green" /></td>
              </tr>
              <tr>
                <td>QR Codes</td>
                <td><XCircle size={20} className="text-gray" /></td>
                <td><CheckCircle2 size={20} className="text-green" /></td>
                <td><CheckCircle2 size={20} className="text-green" /></td>
              </tr>
              <tr>
                <td>Reports</td>
                <td>Basic</td>
                <td>Advanced</td>
                <td>Advanced</td>
              </tr>
              <tr>
                <td>AI Features</td>
                <td><XCircle size={20} className="text-gray" /></td>
                <td>Limited</td>
                <td>Full Suite</td>
              </tr>
              <tr>
                <td>API Access</td>
                <td><XCircle size={20} className="text-gray" /></td>
                <td><CheckCircle2 size={20} className="text-green" /></td>
                <td><CheckCircle2 size={20} className="text-green" /></td>
              </tr>
              <tr>
                <td>SSO</td>
                <td><XCircle size={20} className="text-gray" /></td>
                <td><XCircle size={20} className="text-gray" /></td>
                <td><CheckCircle2 size={20} className="text-green" /></td>
              </tr>
              <tr>
                <td>Support</td>
                <td>Community</td>
                <td>Priority</td>
                <td>Dedicated</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Everything Included */}
      <section className="section bg-gray-50">
        <div className="container">
          <h2 className="section-title text-center">Included in every plan</h2>
          <div className="included-grid">
            <div className="included-card glass-panel">
              <Server className="included-icon" />
              <h4>Secure Cloud Hosting</h4>
              <p>99.9% uptime guaranteed.</p>
            </div>
            <div className="included-card glass-panel">
              <Lock className="included-icon" />
              <h4>SSL Encryption</h4>
              <p>Bank-level security for your data.</p>
            </div>
            <div className="included-card glass-panel">
              <Database className="included-icon" />
              <h4>Automatic Backups</h4>
              <p>Daily backups kept in multiple regions.</p>
            </div>
            <div className="included-card glass-panel">
              <RefreshCw className="included-icon" />
              <h4>Regular Updates</h4>
              <p>Free access to new standard features.</p>
            </div>
            <div className="included-card glass-panel">
              <Shield className="included-icon" />
              <h4>Role-Based Access</h4>
              <p>Control who sees what.</p>
            </div>
            <div className="included-card glass-panel">
              <Laptop className="included-icon" />
              <h4>Responsive Design</h4>
              <p>Works flawlessly on desktop and mobile.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="section container">
        <div className="roi-banner glass-panel">
          <div className="roi-header">
            <h2>The AssetFlow ROI</h2>
            <p>Average results reported by our enterprise customers in their first year.</p>
          </div>
          <div className="roi-stats">
            <div className="roi-stat">
              <span className="roi-value">40%</span>
              <span className="roi-label">Faster Ticket Resolution ⏱</span>
            </div>
            <div className="roi-stat">
              <span className="roi-value">100%</span>
              <span className="roi-label">Asset Visibility 📦</span>
            </div>
            <div className="roi-stat">
              <span className="roi-value">-85%</span>
              <span className="roi-label">Lower Asset Loss 📉</span>
            </div>
            <div className="roi-stat">
              <span className="roi-value">2.5x</span>
              <span className="roi-label">IT Productivity 📊</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Calculator */}
      <section className="section bg-gray-50">
        <div className="container">
          <h2 className="section-title text-center">Find your perfect plan</h2>
          <p className="text-center" style={{ marginBottom: '40px' }}>Adjust the sliders to see our recommendation.</p>
          
          <div className="calculator-container glass-panel">
            <div className="calc-sliders">
              
              <div className="slider-group">
                <div className="slider-header">
                  <label>Employees</label>
                  <span>{calcEmployees}</span>
                </div>
                <input 
                  type="range" min="1" max="500" value={calcEmployees} 
                  onChange={(e) => setCalcEmployees(parseInt(e.target.value))}
                  className="calc-range"
                />
              </div>

              <div className="slider-group">
                <div className="slider-header">
                  <label>Assets</label>
                  <span>{calcAssets}</span>
                </div>
                <input 
                  type="range" min="10" max="2000" value={calcAssets} 
                  onChange={(e) => setCalcAssets(parseInt(e.target.value))}
                  className="calc-range"
                />
              </div>

              <div className="slider-group">
                <div className="slider-header">
                  <label>Service Engineers</label>
                  <span>{calcEngineers}</span>
                </div>
                <input 
                  type="range" min="0" max="30" value={calcEngineers} 
                  onChange={(e) => setCalcEngineers(parseInt(e.target.value))}
                  className="calc-range"
                />
              </div>

            </div>
            
            <div className="calc-result">
              <h4>Recommended Plan:</h4>
              <div className={`result-badge ${recommendedPlan.toLowerCase()}`}>
                {recommendedPlan}
              </div>
              <p>Based on your input, the {recommendedPlan} plan provides the best value and necessary feature set for your scale.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section container">
        <h2 className="section-title text-center">Frequently Asked Questions</h2>
        <div className="faq-container">
          {[
            { q: "Can I change plans later?", a: "Yes, you can upgrade or downgrade your plan at any time. Prorated charges will be applied automatically." },
            { q: "Is there a free trial?", a: "We offer a 14-day free trial on the Professional plan. No credit card required." },
            { q: "Is my data secure?", a: "Absolutely. We use bank-level 256-bit AES encryption and host our infrastructure on highly secure, compliant AWS servers." },
            { q: "Can I import existing assets?", a: "Yes, you can easily upload your existing inventory using our simple CSV import tool on all plans." },
            { q: "Do you provide onboarding support?", a: "Professional and Enterprise plans include dedicated onboarding sessions to ensure your team is set up for success." },
            { q: "Can I cancel anytime?", a: "Yes, AssetFlow is a month-to-month service by default, and you can cancel at any time without penalty." }
          ].map((faq, idx) => (
            <div key={idx} className={`faq-item glass-panel ${openFaq === idx ? 'open' : ''}`}>
              <div className="faq-question" onClick={() => toggleFaq(idx)}>
                <h4>{faq.q}</h4>
                <ChevronDown size={20} className="faq-icon" />
              </div>
              <div className="faq-answer">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="testimonial-card glass-panel">
            <Quote size={40} color="var(--primary)" className="quote-icon" />
            <p className="testimonial-text">
              "AssetFlow helped us reduce IT support response time by 40% in just the first two months. We finally have complete visibility over our global hardware fleet."
            </p>
            <div className="testimonial-author">
              <strong>Sarah Jenkins</strong>
              <span>Director of IT, TechCorp</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section text-center">
        <div className="container">
          <h2 className="section-title">Ready to Simplify IT Asset Management?</h2>
          <p className="pricing-subtitle" style={{ margin: '0 auto 40px' }}>Join the thousands of modern teams running on AssetFlow.</p>
          <div className="hero-buttons justify-center">
            <button className="btn-primary">Start Free Trial <ArrowRight size={18} /></button>
            <button className="btn-outline">Contact Sales</button>
          </div>
        </div>
      </section>

    </main>
  );
};

export default Pricing;
