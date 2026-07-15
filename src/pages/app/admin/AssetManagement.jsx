import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { useNotifications } from '../../../context/NotificationContext';
import { Package, Search, Filter } from 'lucide-react';
import '../Employee.css';

const AssetManagement = () => {
  const { assets, setAssets } = useData();
  const { usersList } = useAuth();
  const { addNotification } = useNotifications();

  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [assigningAsset, setAssigningAsset] = useState(null);
  const [selectedUser, setSelectedUser] = useState('');
  const [saving, setSaving] = useState(false);

  const filteredAssets = assets.filter(asset => {
    const matchesStatus = filterStatus === 'All' || asset.Status === filterStatus;
    const searchString = `${asset.Asset_Name} ${asset.Serial_Number} ${asset.Assigned_To_Email || ''}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleAssign = async () => {
    if (!selectedUser) {
      alert('Please select a user to assign the asset to.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/assets/${assigningAsset._id || assigningAsset.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assigned_to_email: selectedUser })
      });
      if (res.ok) {
        addNotification(`Asset "${assigningAsset.Asset_Name}" assigned successfully.`, 'success');
      } else {
        const err = await res.json();
        addNotification(err.error || 'Failed to assign asset.', 'error');
      }
    } catch {
      addNotification('Network error. Could not assign asset.', 'error');
    }
    setAssigningAsset(null);
    setSelectedUser('');
    setSaving(false);
  };

  const handleUnassign = async (asset) => {
    if (!window.confirm(`Unassign "${asset.Asset_Name}" from ${asset.Assigned_To_Email}?`)) return;
    try {
      const res = await fetch(`/api/assets/${asset._id || asset.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assigned_to_email: null })
      });
      if (res.ok) {
        addNotification(`Asset "${asset.Asset_Name}" unassigned.`, 'success');
      } else {
        addNotification('Failed to unassign asset.', 'error');
      }
    } catch {
      addNotification('Network error.', 'error');
    }
  };

  return (
    <div className="portal-container animate-fade-in">
      <div className="portal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Asset Inventory</h1>
          <p>Track, manage, and assign hardware across the organization.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '400px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search assets by name, serial, or user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Filter size={18} color="#64748B" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
          >
            <option value="All">All Statuses</option>
            <option value="Assigned">Assigned</option>
            <option value="Available">Available</option>
            <option value="Retired">Retired</option>
          </select>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Type</th>
              <th>Serial Number</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>
                  No assets found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredAssets.slice(0, 100).map((asset, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 500, color: '#0F172A' }}>{asset.Asset_Name}</td>
                  <td>{asset.Asset_Type}</td>
                  <td style={{ fontFamily: 'monospace', color: '#64748B' }}>{asset.Serial_Number}</td>
                  <td>
                    <span className={`status-badge ${asset.Status === 'Available' ? 'resolved' : asset.Status === 'Retired' ? 'critical' : 'open'}`}>
                      {asset.Status}
                    </span>
                  </td>
                  <td style={{ color: '#64748B' }}>
                    {asset.Assigned_To_Email
                      ? asset.Assigned_To_Email.split('@')[0].replace(/\./g, ' ')
                      : <span style={{ color: '#cbd5e1' }}>—</span>}
                  </td>
                  <td>
                    {asset.Status === 'Available' && (
                      <button
                        className="btn-primary-small"
                        onClick={() => { setAssigningAsset(asset); setSelectedUser(''); }}
                      >
                        Assign
                      </button>
                    )}
                    {asset.Status === 'Assigned' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn-primary-small"
                          onClick={() => { setAssigningAsset(asset); setSelectedUser(asset.Assigned_To_Email || ''); }}
                        >
                          Reassign
                        </button>
                        <button
                          onClick={() => handleUnassign(asset)}
                          style={{ fontSize: '12px', padding: '4px 10px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          Unassign
                        </button>
                      </div>
                    )}
                    {asset.Status === 'Retired' && (
                      <span style={{ color: '#cbd5e1', fontSize: '12px' }}>Retired</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Assignment Modal */}
      {assigningAsset && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Assign Asset</h3>
            <p>Select a user to assign <strong>{assigningAsset.Asset_Name}</strong> ({assigningAsset.Serial_Number}) to.</p>

            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="modal-input"
            >
              <option value="">-- Select User --</option>
              {usersList.map((u, idx) => (
                <option key={idx} value={u.email || u.Email}>{u.name || u.Name} ({u.email || u.Email})</option>
              ))}
            </select>

            <div className="modal-actions">
              <button className="btn-outline" onClick={() => { setAssigningAsset(null); setSelectedUser(''); }} disabled={saving}>Cancel</button>
              <button className="btn-primary" onClick={handleAssign} disabled={saving || !selectedUser}>
                {saving ? 'Assigning...' : 'Confirm Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetManagement;


