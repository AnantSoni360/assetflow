import React from 'react';
import SolutionPageLayout from '../../components/SolutionPageLayout';
import { 
  Laptop, QrCode, Shield, Activity, Users, 
  Map, Factory, HeartPulse, GraduationCap,
  Building, Rocket, CheckCircle, Database
} from 'lucide-react';
import '../products/Demos.css';

// Reusing some of the demos from products for visual consistency
const SimpleKanbanDemo = () => (
  <div className="demo-kanban" style={{maxWidth: '800px', margin: '0 auto'}}>
    <div className="kanban-col">
      <h5>New</h5>
      <div className="kanban-card start-pos">Laptop Won't Turn On</div>
    </div>
    <div className="kanban-col"><h5>Assigned (Tech A)</h5></div>
    <div className="kanban-col"><h5>In Progress</h5></div>
    <div className="kanban-col"><h5>Resolved</h5></div>
  </div>
);

const PlantDemo = () => (
  <div className="demo-integrations">
    <div className="integ-center" style={{background: '#0f172a'}}>HQ Dashboard</div>
    <div className="integ-node top">Plant A</div>
    <div className="integ-node right">Plant B</div>
    <div className="integ-node bottom">Warehouse</div>
    <div className="integ-packet p1"></div>
    <div className="integ-packet p2"></div>
    <div className="integ-packet p3"></div>
  </div>
);

// --- Pages ---

export const ITCompanies = () => (
  <SolutionPageLayout
    title="Keep Your IT Infrastructure Running Smoothly"
    subtitle="Centralize asset management and ticketing to eliminate chaos in your IT department."
    challenges={[
      'Hundreds of laptops to track manually',
      'Service requests scattered across emails and Slack',
      'Lost or unassigned assets',
      'Delayed issue resolution due to poor routing',
      'Reliance on outdated manual spreadsheets'
    ]}
    solutions={[
      'Centralized asset management dashboard',
      'Automated ticket routing via AI',
      'Smart engineer assignment based on workload',
      'Real-time notifications for status changes',
      'Live analytics and health dashboards'
    ]}
    features={[
      { icon: <Database />, title: 'Asset Database', desc: 'A single source of truth for hardware.' },
      { icon: <Activity />, title: 'Live Dashboard', desc: 'Monitor the health of your entire fleet.' },
      { icon: <Users />, title: 'Engineer Routing', desc: 'Automatically dispatch the right tech.' }
    ]}
    demoComponent={<SimpleKanbanDemo />}
    workflowSteps={[
      { title: 'Employee', desc: 'Raises a ticket via the self-serve portal.' },
      { title: 'Admin', desc: 'Ticket is auto-categorized and reviewed.' },
      { title: 'Engineer', desc: 'Receives the assignment with context.' },
      { title: 'Resolved', desc: 'Employee confirms the fix.' }
    ]}
    benefits={['Faster IT support', 'Better asset tracking', 'Lower downtime', 'Higher employee productivity']}
  />
);

export const Manufacturing = () => (
  <SolutionPageLayout
    title="Manage Assets Across Plants and Factory Floors"
    subtitle="Ensure your manufacturing equipment is tracked, maintained, and operational."
    challenges={[
      'Assets scattered across multiple locations',
      'Difficult maintenance tracking',
      'Machine downtime causing production delays',
      'Missing or misplaced equipment'
    ]}
    solutions={[
      'QR Code asset tracking for quick scanning',
      'Location-wise asset grouping (Plant A, Plant B)',
      'Automated preventive maintenance schedules',
      'Live spare parts management and reordering'
    ]}
    features={[
      { icon: <QrCode />, title: 'QR Tracking', desc: 'Scan machinery instantly.' },
      { icon: <Map />, title: 'Location Mapping', desc: 'Know exactly where every asset is.' },
      { icon: <Factory />, title: 'Preventive Maintenance', desc: 'Schedule checks before failure.' }
    ]}
    demoComponent={<PlantDemo />}
    benefits={['Reduced production downtime', 'Accurate audits', 'Centralized plant visibility']}
  />
);

export const Healthcare = () => (
  <SolutionPageLayout
    title="Ensure Medical Equipment is Always Ready"
    subtitle="Maintain compliance and guarantee device availability for critical care."
    challenges={[
      'Strict equipment maintenance compliance',
      'Uncertain device availability',
      'Critical repairs needed immediately',
      'Complex audit trails'
    ]}
    solutions={[
      'Complete asset lifecycle and audit logs',
      'Automated maintenance reminders',
      'Emergency ticket routing (high priority)',
      'Smart engineer scheduling'
    ]}
    features={[
      { icon: <HeartPulse />, title: 'Emergency Routing', desc: 'Highest priority for critical assets.' },
      { icon: <Shield />, title: 'Compliance Logs', desc: 'Detailed history for audits.' },
      { icon: <Activity />, title: 'Availability Status', desc: 'Live view of ready equipment.' }
    ]}
    benefits={['100% Audit Readiness', 'Zero lost critical equipment', 'Faster emergency response']}
  />
);

export const Education = () => (
  <SolutionPageLayout
    title="Streamline IT for Schools and Universities"
    subtitle="Manage computer labs, projectors, and staff hardware effortlessly."
    challenges={[
      'Maintaining hundreds of lab computers',
      'Tracking shared assets like projectors',
      'Handling sudden faculty requests',
      'Managing library and administrative systems'
    ]}
    solutions={[
      'Department-wise asset grouping',
      'Dedicated faculty request portal',
      'Student lab maintenance tracking',
      'Rapid repair routing'
    ]}
    features={[
      { icon: <GraduationCap />, title: 'Department Hubs', desc: 'Separate views for Science, Arts, etc.' },
      { icon: <Users />, title: 'Faculty Portal', desc: 'Easy requests for teachers.' },
      { icon: <Laptop />, title: 'Lab Management', desc: 'Bulk update lab computer statuses.' }
    ]}
    benefits={['Less classroom disruption', 'Better budgeting for departments', 'Organized hardware refresh cycles']}
  />
);

export const ByTeam = () => (
  <SolutionPageLayout
    title="A Unified Platform for Every Role"
    subtitle="AssetFlow provides tailored interfaces whether you're an Admin, Engineer, HR, or Employee."
    features={[
      { 
        icon: <Building />, 
        title: 'IT Administrators', 
        desc: 'Asset Dashboard, Ticket Assignment, Reports, Analytics. Gain complete visibility into operations.' 
      },
      { 
        icon: <Users />, 
        title: 'Service Engineers', 
        desc: 'Assigned tickets, Mobile updates, Spare parts requests. Complete every job faster.' 
      },
      { 
        icon: <Activity />, 
        title: 'Operations Managers', 
        desc: 'Performance dashboards, SLA tracking, Cost analysis. Make data-driven decisions.' 
      },
      { 
        icon: <Shield />, 
        title: 'HR & Administration', 
        desc: 'Onboarding, Offboarding, Asset assignment. Simplify employee hardware allocation.' 
      },
      { 
        icon: <Laptop />, 
        title: 'Employees', 
        desc: 'Raise tickets, Track status, View assigned assets. Get IT support without waiting.' 
      }
    ]}
    benefits={['Tailored workflows for everyone', 'Zero training required', 'Cross-department synchronization']}
  />
);
