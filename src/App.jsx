import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Laptop, Ticket, Users, Activity, CheckCircle } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { 
  AssetManagement, TicketManagement, EngineerManagement, 
  InventoryManagement, ReportsAnalytics, AIAutomation, Integrations 
} from './pages/products';
import {
  ITCompanies, Manufacturing, Healthcare, Education, ByTeam
} from './pages/solutions';
import {
  ResourceHub, Documentation, Blog, HelpCenter, ReleaseNotes
} from './pages/resources';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Login from './pages/Login';
import CreateWorkspace from './pages/CreateWorkspace';
import WorkspaceSetup from './pages/WorkspaceSetup';
import ForceChangePassword from './pages/ForceChangePassword';

// Platform Admin Pages
import PlatformLogin from './pages/platform/PlatformLogin';
import PlatformLayout from './components/PlatformLayout';
import PlatformDashboard from './pages/platform/PlatformDashboard';
import PlatformWorkspaces from './pages/platform/PlatformWorkspaces';

import AppLayout from './components/AppLayout';
import RoleBasedDashboard from './pages/app/RoleBasedDashboard';
import MyAssets from './pages/app/MyAssets';
import MyTickets from './pages/app/MyTickets';
import RaiseTicket from './pages/app/RaiseTicket';
import SecurityProfile from './pages/app/SecurityProfile';

// Admin Portal Pages
import UserManagement from './pages/app/admin/UserManagement';
import AdminAssetManagement from './pages/app/admin/AssetManagement';
import AdminTicketManagement from './pages/app/admin/TicketManagement';
import AIPredictions from './pages/app/admin/AIPredictions';
import AdminInventory from './pages/app/admin/Inventory';

// Engineer Portal Pages
import AssignedTickets from './pages/app/engineer/AssignedTickets';

import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { DataProvider } from './context/DataContext';
import { NotificationProvider } from './context/NotificationContext';
import './App.css';

// Custom Cursor Hook
const useCustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => setPosition({ x: e.clientX, y: e.clientY });
    
    const handleMouseOver = (e) => {
      if (e.target.tagName.toLowerCase() === 'button' || 
          e.target.tagName.toLowerCase() === 'a' ||
          e.target.closest('.bento-item')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return { position, isHovering };
};

// Loading Screen Component
const LoadingScreen = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 800);
    const timer2 = setTimeout(() => setStep(2), 1600);
    const timer3 = setTimeout(() => setStep(3), 2400);
    const timer4 = setTimeout(() => {
      setOpacity(0);
      setTimeout(onComplete, 800);
    }, 3200);

    return () => {
      clearTimeout(timer1); clearTimeout(timer2); 
      clearTimeout(timer3); clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className={`loading-screen ${opacity === 0 ? 'fade-out' : ''}`}>
      <div className="loading-logo">AssetFlow</div>
      <div className="loading-flow">
        <div className={`flow-step ${step >= 0 ? 'active' : ''}`}><Laptop /></div>
        <div className="flow-line"></div>
        <div className={`flow-step ${step >= 1 ? 'active' : ''}`}><Ticket /></div>
        <div className="flow-line"></div>
        <div className={`flow-step ${step >= 2 ? 'active' : ''}`}><Users /></div>
        <div className="flow-line"></div>
        <div className={`flow-step ${step >= 3 ? 'active' : ''}`}><CheckCircle /></div>
      </div>
    </div>
  );
};

const AppContent = ({ scrolled }) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/create-workspace', '/workspace-setup', '/force-change-password', '/platform/login'].includes(location.pathname);
  const isAppRoute = location.pathname.startsWith('/app');
  const isPlatformRoute = location.pathname.startsWith('/platform') && location.pathname !== '/platform/login';
  const hideChrome = isAuthPage || isAppRoute || isPlatformRoute;

  return (
    <>
      {!hideChrome && <Navbar scrolled={scrolled} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/asset-management" element={<AssetManagement />} />
        <Route path="/products/ticket-management" element={<TicketManagement />} />
        <Route path="/products/engineer-management" element={<EngineerManagement />} />
        <Route path="/products/inventory" element={<InventoryManagement />} />
        <Route path="/products/reports" element={<ReportsAnalytics />} />
        <Route path="/products/ai-automation" element={<AIAutomation />} />
        <Route path="/products/integrations" element={<Integrations />} />
        
        {/* Solutions Routes */}
        <Route path="/solutions/it-companies" element={<ITCompanies />} />
        <Route path="/solutions/manufacturing" element={<Manufacturing />} />
        <Route path="/solutions/healthcare" element={<Healthcare />} />
        <Route path="/solutions/education" element={<Education />} />
        <Route path="/solutions/by-team" element={<ByTeam />} />
        
        {/* Pricing Route */}
        <Route path="/pricing" element={<Pricing />} />
        
        {/* Resources Routes */}
        <Route path="/resources" element={<ResourceHub />} />
        <Route path="/resources/documentation" element={<Documentation />} />
        <Route path="/resources/blog" element={<Blog />} />
        <Route path="/resources/help-center" element={<HelpCenter />} />
        <Route path="/resources/release-notes" element={<ReleaseNotes />} />
        
        {/* About Route */}
        <Route path="/about" element={<About />} />

        {/* Public / Onboarding Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/create-workspace" element={<CreateWorkspace />} />
        
        {/* Protected Onboarding Routes */}
        <Route path="/workspace-setup" element={<WorkspaceSetup />} />
        <Route path="/force-change-password" element={<ForceChangePassword />} />

        {/* Platform Admin Routes */}
        <Route path="/platform/login" element={<PlatformLogin />} />
        <Route path="/platform" element={<PlatformLayout />}>
          <Route index element={<PlatformDashboard />} />
          <Route path="workspaces" element={<PlatformWorkspaces />} />
          {/* Add more platform routes later as needed */}
        </Route>

        {/* Protected App Routes */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<RoleBasedDashboard />} />
          
          {/* Employee Routes */}
          <Route path="my-assets" element={<MyAssets />} />
          <Route path="my-tickets" element={<MyTickets />} />
          <Route path="raise-ticket" element={<RaiseTicket />} />
          
          {/* Security & Profile (All Roles) */}
          <Route path="profile" element={<SecurityProfile />} />
          
          {/* Admin Routes */}
          <Route path="users" element={<UserManagement />} />
          <Route path="all-assets" element={<AdminAssetManagement />} />
          <Route path="all-tickets" element={<AdminTicketManagement />} />
          <Route path="ai-predictions" element={<AIPredictions />} />
          <Route path="inventory" element={<AdminInventory />} />
          
          {/* Engineer Routes */}
          <Route path="assigned-tickets" element={<AssignedTickets />} />
          
          {/* Sub-routes will be added here in subsequent phases */}
          <Route path="*" element={<div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}><h2>Under Construction</h2><p>This module is being built.</p></div>} />
        </Route>
      </Routes>

      {!hideChrome && (
        <footer style={{ padding: '80px 0', borderTop: '1px solid #e2e8f0', marginTop: '100px', textAlign: 'center' }}>
          <div className="logo" style={{ justifyContent: 'center', marginBottom: '20px' }}>
            <Activity size={24} /> AssetFlow
          </div>
          <p style={{ color: 'var(--text-muted)' }}>© 2026 AssetFlow Inc. All rights reserved.</p>
        </footer>
      )}
    </>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const { position, isHovering } = useCustomCursor();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return <LoadingScreen onComplete={() => setLoading(false)} />;

  return (
    <Router>
      <div className="app-container animate-fade-in">
        <div className="bg-grid"></div>
        
        {/* Custom Cursor */}
        <div 
          className={`custom-cursor ${isHovering ? 'hovering' : ''}`}
          style={{ left: `${position.x}px`, top: `${position.y}px` }}
        ></div>

        <AuthProvider>
          <SocketProvider>
            <NotificationProvider>
              <DataProvider>
                <AppContent scrolled={scrolled} />
              </DataProvider>
            </NotificationProvider>
          </SocketProvider>
        </AuthProvider>
      </div>
    </Router>
  );
}
