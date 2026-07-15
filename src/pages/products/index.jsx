import React from 'react';
import ProductPageLayout from '../../components/ProductPageLayout';
import { Laptop, QrCode, ArrowRightLeft, Shield, Clock, Search, ListTodo, MessageSquare, Zap, BarChart, Server, Link, UserCheck } from 'lucide-react';
import './Demos.css';

// --- Custom Demos ---

const AssetDemo = () => (
  <div className="demo-asset">
    <div className="demo-inventory-box">
      <Laptop size={32} className="text-gray-400" />
      <span>Inventory</span>
    </div>
    <div className="demo-path">
      <div className="demo-moving-laptop"><Laptop size={24} color="var(--primary)" /></div>
    </div>
    <div className="demo-employee-box">
      <UserCheck size={32} className="text-gray-400" />
      <span>Employee</span>
    </div>
  </div>
);

const TicketDemo = () => (
  <div className="demo-kanban">
    <div className="kanban-col">
      <h5>New</h5>
      <div className="kanban-card start-pos">Ticket #2487</div>
    </div>
    <div className="kanban-col"><h5>Assigned</h5></div>
    <div className="kanban-col"><h5>In Progress</h5></div>
    <div className="kanban-col"><h5>Completed</h5></div>
  </div>
);

const EngineerDemo = () => (
  <div className="demo-engineer">
    <div className="eng-map">
      <div className="eng-node eng-1">Tech A</div>
      <div className="eng-node eng-2">Tech B</div>
      <div className="eng-job pulse-job">New Ticket</div>
      <div className="eng-assignment-line"></div>
    </div>
  </div>
);

const InventoryDemo = () => (
  <div className="demo-inventory">
    <div className="stock-card">
      <div className="stock-title">Keyboard Stock</div>
      <div className="stock-count">25</div>
    </div>
    <div className="stock-arrow">→ Used 1 →</div>
    <div className="stock-card highlight">
      <div className="stock-title">Keyboard Stock</div>
      <div className="stock-count update">24</div>
    </div>
  </div>
);

const ReportsDemo = () => (
  <div className="demo-reports">
    <div className="bar-chart">
      <div className="bar bar-1"></div>
      <div className="bar bar-2"></div>
      <div className="bar bar-3"></div>
      <div className="bar bar-4"></div>
      <div className="bar bar-5"></div>
    </div>
  </div>
);

const AIDemo = () => (
  <div className="demo-ai">
    <div className="ai-brain-demo">
      <Zap size={48} color="#f97316" />
    </div>
    <div className="ai-lines">
      <div className="ai-line l1">Predict Failure</div>
      <div className="ai-line l2">Assign Priority</div>
      <div className="ai-line l3">Suggest Engineer</div>
    </div>
  </div>
);

const IntegrationsDemo = () => (
  <div className="demo-integrations">
    <div className="integ-center">AssetFlow</div>
    <div className="integ-node top">Slack</div>
    <div className="integ-node right">Outlook</div>
    <div className="integ-node bottom">Teams</div>
    <div className="integ-node left">Entra ID</div>
    <div className="integ-packet p1"></div>
    <div className="integ-packet p2"></div>
    <div className="integ-packet p3"></div>
    <div className="integ-packet p4"></div>
  </div>
);


// --- Pages ---

export const AssetManagement = () => (
  <ProductPageLayout 
    title="Manage Every Company Asset from One Dashboard"
    subtitle="Track laptops, desktops, monitors, keyboards, software licenses, and every IT asset throughout its lifecycle."
    demoComponent={<AssetDemo />}
    features={[
      { icon: <QrCode />, title: 'QR Code Generation', desc: 'Scan and track instantly.' },
      { icon: <ArrowRightLeft />, title: 'Asset Transfers', desc: 'Move assets between employees.' },
      { icon: <Shield />, title: 'Warranty Tracking', desc: 'Never miss an expiration date.' },
      { icon: <Clock />, title: 'Maintenance Schedule', desc: 'Automate periodic checks.' },
      { icon: <Search />, title: 'Advanced Search', desc: 'Find any asset in seconds.' },
      { icon: <Laptop />, title: 'Asset Registration', desc: 'Onboard new hardware easily.' }
    ]}
    workflowSteps={[
      { title: 'Purchase', desc: 'Asset acquired and registered in AssetFlow.' },
      { title: 'Added to Inventory', desc: 'Asset is tagged and ready for deployment.' },
      { title: 'Assigned to Employee', desc: 'Asset is checked out to a user.' },
      { title: 'Maintenance & Repair', desc: 'Track all service history.' },
      { title: 'Retired', desc: 'Securely decommission old assets.' }
    ]}
    benefits={['Reduce lost assets', 'Complete asset visibility', 'Faster asset allocation']}
  />
);

export const TicketManagement = () => (
  <ProductPageLayout 
    title="Resolve IT Issues Faster with Smart Ticketing"
    subtitle="Streamline helpdesk requests, organize workflows, and keep employees informed with our intelligent ticketing system."
    demoComponent={<TicketDemo />}
    features={[
      { icon: <ListTodo />, title: 'Create Ticket', desc: 'Easy submission for employees.' },
      { icon: <Zap />, title: 'Priority Levels', desc: 'Auto-assign SLA based on urgency.' },
      { icon: <MessageSquare />, title: 'Comments & Updates', desc: 'Keep everyone in the loop.' },
      { icon: <Clock />, title: 'SLA Tracking', desc: 'Ensure timely resolutions.' },
    ]}
    workflowSteps={[
      { title: 'Raise Ticket', desc: 'Employee reports an issue.' },
      { title: 'Admin Reviews', desc: 'Ticket is categorized and prioritized.' },
      { title: 'Assign Engineer', desc: 'The right tech is dispatched.' },
      { title: 'Repair & Close', desc: 'Issue resolved and confirmed.' }
    ]}
    benefits={['Faster response times', 'Organized workflow', 'No lost requests']}
  />
);

export const EngineerManagement = () => (
  <ProductPageLayout 
    title="Empower Your IT Team with Smart Engineer Assignment"
    subtitle="Balance workloads, track performance, and deploy your technicians efficiently."
    demoComponent={<EngineerDemo />}
    features={[
      { icon: <UserCheck />, title: 'Workload Balancing', desc: 'Distribute tickets evenly.' },
      { icon: <Map />, title: 'Route Planning', desc: 'Optimize on-site visits.' },
      { icon: <Clock />, title: 'Time Tracking', desc: 'Monitor time spent on jobs.' }
    ]}
    benefits={['Optimized technician time', 'Fair workload distribution', 'Faster resolution']}
  />
);

export const InventoryManagement = () => (
  <ProductPageLayout 
    title="Track Spare Parts and Inventory in Real Time"
    subtitle="Never run out of critical components. Automate stock alerts and track part usage."
    demoComponent={<InventoryDemo />}
    features={[
      { icon: <Package />, title: 'Stock Levels', desc: 'Live view of available parts.' },
      { icon: <Zap />, title: 'Low Stock Alerts', desc: 'Automated warnings.' },
      { icon: <ListTodo />, title: 'Purchase Orders', desc: 'Manage vendor relationships.' }
    ]}
    benefits={['No more stockouts', 'Accurate cost tracking', 'Automated reordering']}
  />
);

export const ReportsAnalytics = () => (
  <ProductPageLayout 
    title="Turn IT Data into Actionable Insights"
    subtitle="Visualize asset failures, engineer performance, and ticket trends."
    demoComponent={<ReportsDemo />}
    features={[
      { icon: <BarChart />, title: 'Monthly Tickets', desc: 'Track volume over time.' },
      { icon: <Laptop />, title: 'Asset Distribution', desc: 'See where hardware is deployed.' },
      { icon: <UserCheck />, title: 'Engineer Performance', desc: 'Measure resolution metrics.' }
    ]}
    benefits={['Data-driven decisions', 'Identify bottlenecks', 'Predict future IT needs']}
  />
);

export const AIAutomation = () => (
  <ProductPageLayout 
    title="Smarter IT Operations Powered by Artificial Intelligence"
    subtitle="Let AssetFlow's AI predict failures, classify tickets, and recommend solutions."
    demoComponent={<AIDemo />}
    features={[
      { icon: <Zap />, title: 'Predictive Maintenance', desc: 'Know when parts will fail.' },
      { icon: <MessageSquare />, title: 'AI Chat Assistant', desc: 'Help users self-solve basic issues.' },
      { icon: <UserCheck />, title: 'Engineer Recommendation', desc: 'Assign tickets based on skill.' }
    ]}
    workflowSteps={[
      { title: 'Employee Reports', desc: 'Natural language input.' },
      { title: 'AI Analyzes', desc: 'Detects intent and category.' },
      { title: 'Recommends Action', desc: 'Suggests fix or creates ticket.' }
    ]}
    benefits={['Reduced manual triage', 'Fewer critical failures', 'Instant user support']}
  />
);

export const Integrations = () => (
  <ProductPageLayout 
    title="Connect AssetFlow with Your Existing Tools"
    subtitle="Seamlessly integrate with the software your company already uses."
    demoComponent={<IntegrationsDemo />}
    features={[
      { icon: <Link />, title: 'Slack & Teams', desc: 'Get ticket updates in chat.' },
      { icon: <Shield />, title: 'Active Directory', desc: 'Single Sign-On (SSO) support.' },
      { icon: <Server />, title: 'REST API', desc: 'Build custom workflows.' }
    ]}
    benefits={['Faster communication', 'Automated notifications', 'Easy data synchronization']}
  />
);
