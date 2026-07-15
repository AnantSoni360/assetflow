import React, { useEffect } from 'react';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import './SolutionPageLayout.css';

const SolutionPageLayout = ({ 
  title, 
  subtitle,
  challenges,
  solutions,
  features, 
  demoComponent,
  workflowSteps,
  benefits
}) => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="solution-page animate-fade-in">
      {/* Hero Section */}
      <section className="solution-hero">
        <div className="container">
          <div className="solution-hero-content">
            <h1 className="solution-title">{title}</h1>
            {subtitle && <p className="solution-subtitle">{subtitle}</p>}
            <div className="hero-buttons">
              <button className="btn-primary">Get Started <ArrowRight size={18} /></button>
              <button className="btn-outline">Talk to Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges vs Solutions */}
      {(challenges && solutions) && (
        <section className="solution-challenges section">
          <div className="container">
            <h2 className="section-title text-center">Why do you need AssetFlow?</h2>
            <div className="challenges-grid">
              <div className="challenges-card glass-panel">
                <h3 className="challenges-heading text-red">The Challenges</h3>
                <ul className="challenges-list">
                  {challenges.map((challenge, idx) => (
                    <li key={idx}>
                      <XCircle color="#ef4444" size={20} className="flex-shrink-0" />
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="solutions-card glass-panel">
                <h3 className="challenges-heading text-blue">The AssetFlow Solution</h3>
                <ul className="challenges-list">
                  {solutions.map((solution, idx) => (
                    <li key={idx}>
                      <CheckCircle2 color="var(--primary)" size={20} className="flex-shrink-0" />
                      <span>{solution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Interactive Demo */}
      {demoComponent && (
        <section className="solution-demo section bg-gray-50">
          <div className="container">
            <h2 className="section-title text-center">See how it works</h2>
            <div className="demo-wrapper glass-panel">
              {demoComponent}
            </div>
          </div>
        </section>
      )}

      {/* Features Grid */}
      {features && (
        <section className="solution-features section">
          <div className="container">
            <h2 className="section-title text-center">Everything you need</h2>
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
      )}

      {/* Workflow Timeline */}
      {workflowSteps && (
        <section className="solution-workflow section bg-gray-50">
          <div className="container">
            <h2 className="section-title text-center">Optimized Workflow</h2>
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

      {/* Benefits */}
      {benefits && (
        <section className="solution-benefits section">
          <div className="container">
            <div className="benefits-container glass-panel">
              <div className="benefits-text">
                <h2>The Results</h2>
                <p>What you can expect after implementing AssetFlow.</p>
              </div>
              <div className="benefits-list">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="benefit-item">
                    <CheckCircle2 color="var(--accent)" size={24} className="flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="solution-cta section text-center">
        <div className="container">
          <h2>Ready to transform your operations?</h2>
          <p>Join the thousands of modern teams running on AssetFlow.</p>
          <button className="btn-primary mt-6">Start Your Free Trial</button>
        </div>
      </section>
    </main>
  );
};

export default SolutionPageLayout;
