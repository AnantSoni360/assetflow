import React, { useEffect } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import './ProductPageLayout.css';

const ProductPageLayout = ({ 
  title, 
  subtitle, 
  heroAnimation, 
  workflowSteps, 
  features, 
  demoComponent,
  benefits
}) => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="product-page animate-fade-in">
      {/* Hero Section */}
      <section className="product-hero">
        <div className="container">
          <div className="product-hero-content">
            <h1 className="product-title">{title}</h1>
            <p className="product-subtitle">{subtitle}</p>
            <div className="hero-buttons">
              <button className="btn-primary">Start Free Trial</button>
              <button className="btn-outline">Talk to Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo / Workflow Animation */}
      <section className="product-demo-section section">
        <div className="container">
          <div className="glass-panel p-8">
            <h2 className="section-title text-center">See it in action</h2>
            <div className="demo-container">
              {demoComponent}
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Steps */}
      {workflowSteps && (
        <section className="product-workflow section bg-gray-50">
          <div className="container">
            <h2 className="section-title text-center">How it works</h2>
            <div className="workflow-timeline">
              {workflowSteps.map((step, idx) => (
                <div key={idx} className="workflow-item">
                  <div className="workflow-dot"></div>
                  <div className="workflow-content glass-panel">
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="product-features section">
        <div className="container">
          <h2 className="section-title text-center">Core Features</h2>
          <div className="features-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card glass-panel">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="product-benefits section">
        <div className="container">
          <div className="benefits-container glass-panel">
            <div className="benefits-text">
              <h2>Why choose AssetFlow?</h2>
              <p>Experience the enterprise difference.</p>
            </div>
            <div className="benefits-list">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="benefit-item">
                  <CheckCircle2 color="var(--primary)" size={24} />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="product-cta section text-center">
        <div className="container">
          <h2>Ready to transform your IT operations?</h2>
          <p>Join thousands of companies using AssetFlow.</p>
          <button className="btn-primary mt-6">Get Started Now <ArrowRight size={18} /></button>
        </div>
      </section>
    </main>
  );
};

export default ProductPageLayout;
