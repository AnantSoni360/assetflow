import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import './Employee.css';

const MyAssets = () => {
  const { user } = useAuth();
  const { assets, loading } = useData();

  if (loading) return <div>Loading assets...</div>;

  const myAssets = assets.filter(a => a.Assigned_To_Email === user.email);

  return (
    <div className="portal-container animate-fade-in">
      <div className="portal-header">
        <h1>My Assets</h1>
        <p>Hardware and software assets currently assigned to you.</p>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Asset Type</th>
              <th>Serial Number</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {myAssets.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '32px' }}>
                  No assets assigned to you.
                </td>
              </tr>
            ) : (
              myAssets.map((asset, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 500, color: '#0F172A' }}>{asset.Asset_Name}</td>
                  <td>{asset.Asset_Type}</td>
                  <td style={{ fontFamily: 'monospace', color: '#64748B' }}>{asset.Serial_Number}</td>
                  <td>
                    <span className="status-badge" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                      {asset.Status}
                    </span>
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

export default MyAssets;
