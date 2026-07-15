import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../config';
import { Search, MoreVertical, Trash2, ShieldBan, ShieldCheck, AlertTriangle } from 'lucide-react';
import './Platform.css';

const PlatformWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchWorkspaces = async () => {
    try {
      const res = await fetch(`${API_URL}/api/platform/workspaces');
      if (res.ok) {
        const data = await res.json();
        setWorkspaces(data.workspaces);
      }
    } catch (err) {
      console.error("Failed to fetch workspaces", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const openDeleteModal = (ws) => {
    setWorkspaceToDelete(ws);
    setDeleteConfirmText('');
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    
    setDeleteLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/platform/workspaces/${workspaceToDelete.workspace_id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setDeleteModalOpen(false);
        fetchWorkspaces(); // Refresh list
      }
    } catch (err) {
      console.error('Failed to delete workspace', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="platform-page animate-fade-in">
      <div className="page-header" style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: '#0f172a', marginBottom: '8px' }}>Workspace Management</h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>View and manage all active company workspaces on AssetFlow.</p>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="search-box" style={{ background: 'white', display: 'flex', alignItems: 'center', padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '300px' }}>
            <Search size={18} color="#64748b" style={{ marginRight: '8px' }} />
            <input type="text" placeholder="Search workspaces..." style={{ border: 'none', outline: 'none', width: '100%' }} />
          </div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <th style={{ padding: '16px 24px', fontWeight: '600' }}>Company Name</th>
              <th style={{ padding: '16px 24px', fontWeight: '600' }}>Workspace ID</th>
              <th style={{ padding: '16px 24px', fontWeight: '600' }}>Admin Email</th>
              <th style={{ padding: '16px 24px', fontWeight: '600', textAlign: 'center' }}>Users</th>
              <th style={{ padding: '16px 24px', fontWeight: '600', textAlign: 'center' }}>Assets</th>
              <th style={{ padding: '16px 24px', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '16px 24px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading workspaces...</td></tr>
            ) : workspaces.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No workspaces found.</td></tr>
            ) : (
              workspaces.map((ws, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s', ':hover': { background: '#f8fafc' } }}>
                  <td style={{ padding: '16px 24px', fontWeight: '500', color: '#0f172a' }}>{ws.name}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', color: '#475569', fontSize: '13px', fontFamily: 'monospace' }}>
                      {ws.workspace_id}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', color: '#475569' }}>{ws.admin_email}</td>
                  <td style={{ padding: '16px 24px', color: '#475569', textAlign: 'center' }}>{ws.userCount}</td>
                  <td style={{ padding: '16px 24px', color: '#475569', textAlign: 'center' }}>{ws.assetCount}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#dcfce7', color: '#16a34a', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: '600' }}>
                      <ShieldCheck size={14} /> Active
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button className="icon-btn" style={{ color: '#ef4444', background: '#fee2e2', padding: '8px' }} onClick={() => openDeleteModal(ws)} title="Delete Workspace">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && workspaceToDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="animate-fade-in" style={{ background: 'white', width: '100%', maxWidth: '500px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            
            <div style={{ background: '#fef2f2', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: '#ef4444' }}>
                <AlertTriangle size={32} />
              </div>
              <h2 style={{ fontSize: '24px', color: '#991b1b', marginBottom: '8px' }}>Delete {workspaceToDelete.name}?</h2>
              <p style={{ color: '#b91c1c', fontSize: '15px' }}>
                This action will permanently delete <strong>{workspaceToDelete.userCount} Users</strong>, <strong>{workspaceToDelete.assetCount} Assets</strong>, and <strong>{workspaceToDelete.ticketCount} Tickets</strong>.
              </p>
            </div>

            <div style={{ padding: '32px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <p style={{ fontSize: '14px', color: '#475569', marginBottom: '12px' }}>
                  This action <strong>cannot be undone</strong>. All inventory, reports, settings, and activity logs belonging to Company ID <strong style={{ color: '#0f172a' }}>{workspaceToDelete.workspace_id}</strong> will be permanently removed.
                </p>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', display: 'block', marginBottom: '8px' }}>
                  Type <span style={{ color: '#ef4444' }}>DELETE</span> to continue:
                </label>
                <input 
                  type="text" 
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }}
                  placeholder="DELETE"
                />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button 
                  style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer' }}
                  onClick={() => setDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  style={{ flex: 1, padding: '12px', background: '#ef4444', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: deleteConfirmText === 'DELETE' ? 'pointer' : 'not-allowed', opacity: deleteConfirmText === 'DELETE' ? 1 : 0.5 }}
                  onClick={handleDelete}
                  disabled={deleteConfirmText !== 'DELETE' || deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Permanently Delete'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default PlatformWorkspaces;

