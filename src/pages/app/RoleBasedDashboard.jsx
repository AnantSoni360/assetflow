import React from 'react';
import { useAuth } from '../../context/AuthContext';
import EmployeeDashboard from './EmployeeDashboard';
import AdminDashboard from './admin/AdminDashboard';
import EngineerDashboard from './engineer/EngineerDashboard';

const RoleBasedDashboard = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const role = user.MappedRole;

  if (role === 'Admin') {
    return <AdminDashboard />;
  } else if (role === 'IT Engineer') {
    return <EngineerDashboard />;
  } else {
    // Default to Employee
    return <EmployeeDashboard />;
  }
};

export default RoleBasedDashboard;
