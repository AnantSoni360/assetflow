import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Users, Filter } from 'lucide-react';
import '../Employee.css';

const UserManagement = () => {
  const { usersList } = useAuth();
  const [filterRole, setFilterRole] = useState('All');

  // Filter users based on selected role
  const filteredUsers = usersList.filter(user => {
    if (filterRole === 'All') return true;
    return user.MappedRole === filterRole;
  });

  return (
    <div className="portal-container animate-fade-in">
      <div className="portal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>User Management</h1>
          <p>Manage employees, engineers, and administrators across the organization.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Filter size={18} color="#64748B" />
          <select 
            value={filterRole} 
            onChange={(e) => setFilterRole(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
          >
            <option value="All">All Roles</option>
            <option value="Employee">Employees</option>
            <option value="IT Engineer">IT Engineers</option>
            <option value="Admin">Administrators</option>
          </select>
          <button className="btn-primary">Add New User</button>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '32px' }}>
                  No users found for this role.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 500, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="user-avatar" style={{ width: '28px', height: '28px', fontSize: '12px' }}>
                      <Users size={14} />
                    </div>
                    {u.Name}
                  </td>
                  <td style={{ color: '#64748B' }}>{u.Email}</td>
                  <td>{u.Department}</td>
                  <td>
                    <span className={`status-badge ${u.MappedRole === 'Admin' ? 'error' : u.MappedRole === 'IT Engineer' ? 'warning' : 'info'}`}>
                      {u.MappedRole}
                    </span>
                  </td>
                  <td>
                    <span className="status-badge resolved">Active</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
