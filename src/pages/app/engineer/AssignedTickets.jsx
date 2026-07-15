import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import { Search, Filter, CheckCircle, XCircle, Wrench, Package } from 'lucide-react';
import '../Employee.css';

const statusColor = {
  'New': '#f59e0b', 'Assigned': '#3b82f6', 'In Progress': '#8b5cf6',
  'Waiting Parts': '#f97316', 'Resolved': '#10b981', 'Closed': '#64748b',
  'Reopened': '#ef4444', 'Cancelled': '#94a3b8', 'Warranty Claim': '#eab308'
};

const AssignedTickets = () => {
  const { user } = useAuth();
  const { tickets, updateTicket, requestSparePart, inventory } = useData();

  const [filterStatus, setFilterStatus] = useState('All Open');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionTicket, setActionTicket] = useState(null);
  const [actionType, setActionType] = useState(''); // 'update' | 'reject' | 'spare-part'
  const [newStatus, setNewStatus] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [requestedPart, setRequestedPart] = useState('');
  const [saving, setSaving] = useState(false);

  // Only tickets assigned to this engineer
  const myTickets = tickets.filter(t => t.Assigned_To_Email === user.email);

  const filteredTickets = myTickets.filter(ticket => {
    let matchesStatus = true;
    if (filterStatus === 'All Open') {
      matchesStatus = !['Resolved', 'Closed', 'Cancelled'].includes(ticket.Status);
    } else if (filterStatus !== 'All') {
      matchesStatus = ticket.Status === filterStatus;
    }
    const searchString = `${ticket.Title} ${ticket.Requested_By_Email} ${ticket.TicketNumber || ''}`.toLowerCase();
    return matchesStatus && searchString.includes(searchQuery.toLowerCase());
  });

  const openUpdate = (ticket) => {
    setActionTicket(ticket);
    setActionType('update');
    setNewStatus(ticket.Status === 'Assigned' ? 'In Progress' : ticket.Status);
    setRejectionReason('');
    setRequestedPart('');
  };

  const openReject = (ticket) => {
    setActionTicket(ticket);
    setActionType('reject');
    setRejectionReason('');
  };

  const closeModal = () => {
    setActionTicket(null);
    setActionType('');
    setNewStatus('');
    setRejectionReason('');
    setRequestedPart('');
  };

  const handleUpdate = async () => {
    if (!newStatus) return;
    setSaving(true);

    if (newStatus === 'Waiting Parts') {
      if (!requestedPart) { alert('Please select a spare part to request.'); setSaving(false); return; }
      await requestSparePart(actionTicket._id || actionTicket.id, requestedPart);
    } else {
      await updateTicket(actionTicket._id || actionTicket.id, { Status: newStatus });
    }

    closeModal();
    setSaving(false);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) { alert('Please provide a reason for rejection.'); return; }
    setSaving(true);
    // Set status back to New with rejection reason — admin is notified by backend
    await updateTicket(actionTicket._id || actionTicket.id, {
      Status: 'New',
      Assigned_To_Email: null,
      rejection_reason: rejectionReason
    });
    closeModal();
    setSaving(false);
  };

  // Status options depend on current status
  const getStatusOptions = (currentStatus) => {
    if (currentStatus === 'Assigned') return [
      { value: 'In Progress', label: 'In Progress (Accept & Start Work)' },
      { value: 'Resolved', label: 'Resolved (Issue Fixed)' },
      { value: 'Waiting Parts', label: 'Waiting Parts (Request Spare Part)' },
      { value: 'Warranty Claim', label: 'Warranty Claim (Send to Vendor)' },
      { value: 'No Issue Found', label: 'No Issue Found (Close without action)' },
    ];
    if (currentStatus === 'In Progress' || currentStatus === 'Waiting Parts' || currentStatus === 'Warranty Claim') return [
      { value: 'In Progress', label: 'In Progress' },
      { value: 'Resolved', label: 'Resolved (Issue Fixed)' },
      { value: 'Waiting Parts', label: 'Waiting Parts (Request Spare Part)' },
      { value: 'Warranty Claim', label: 'Warranty Claim (Send to Vendor)' },
      { value: 'No Issue Found', label: 'No Issue Found' },
    ];
    return [
      { value: currentStatus, label: currentStatus },
      { value: 'Resolved', label: 'Resolved' },
    ];
  };

  return (
    <div className="portal-container animate-fade-in">
      <div className="portal-header">
        <h1>My Ticket Board</h1>
        <p>Manage your assigned tickets. Accept, reject, update, or request spare parts.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', gap: '16px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input
            type="text" placeholder="Search tickets..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Filter size={18} color="#64748B" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}>
            <option value="All Open">All Active</option>
            <option value="Assigned">Assigned (Pending Accept)</option>
            <option value="In Progress">In Progress</option>
            <option value="Waiting Parts">Waiting Parts</option>
            <option value="Warranty Claim">Warranty Claim</option>
            <option value="Resolved">Resolved</option>
            <option value="All">Full History</option>
          </select>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Ticket #</th>
              <th>Title</th>
              <th>Requested By</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>No tickets found.</td></tr>
            ) : (
              filteredTickets.map((ticket, idx) => (
                <tr key={idx}>
                  <td style={{ fontFamily: 'monospace', color: '#3b82f6', fontWeight: 600, fontSize: '13px' }}>
                    {ticket.TicketNumber || `#${ticket._id || ticket.id}`}
                  </td>
                  <td style={{ fontWeight: 500, color: '#0F172A' }}>{ticket.Title}</td>
                  <td style={{ color: '#64748B', fontSize: '13px' }}>
                    {(ticket.Requested_By_Email || '').split('@')[0].replace(/\./g, ' ') || '—'}
                  </td>
                  <td>
                    <span className={`status-badge ${ticket.Priority ? ticket.Priority.toLowerCase() : ''}`}>
                      {ticket.Priority}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-block', padding: '4px 10px', borderRadius: '100px',
                      fontSize: '12px', fontWeight: 600,
                      background: `${statusColor[ticket.Status] || '#64748b'}20`,
                      color: statusColor[ticket.Status] || '#64748b'
                    }}>
                      {ticket.Status}
                    </span>
                  </td>
                  <td>
                    {!['Closed', 'Cancelled', 'No Issue Found', 'Resolved'].includes(ticket.Status) && (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn-primary-small" onClick={() => openUpdate(ticket)}
                          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Wrench size={12} /> Update
                        </button>
                        {ticket.Status === 'Assigned' && (
                          <button onClick={() => openReject(ticket)}
                            style={{ fontSize: '12px', padding: '4px 10px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <XCircle size={12} /> Reject
                          </button>
                        )}
                      </div>
                    )}
                    {ticket.Status === 'Resolved' && (
                      <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                        <CheckCircle size={14} /> Resolved
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Update Status Modal */}
      {actionTicket && actionType === 'update' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Update Ticket Status</h3>
            <p><strong>{actionTicket.TicketNumber || `#${actionTicket._id || actionTicket.id}`}</strong> – {actionTicket.Title}</p>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
              Requested by: {(actionTicket.Requested_By_Email || '').split('@')[0].replace(/\./g, ' ') || '—'}
            </p>

            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="modal-input">
              <option value="">-- Select new status --</option>
              {getStatusOptions(actionTicket.Status).map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {newStatus === 'Waiting Parts' && (
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Select Spare Part to Request:</label>
                <select value={requestedPart} onChange={(e) => setRequestedPart(e.target.value)} className="modal-input">
                  <option value="">-- Select a part --</option>
                  {inventory.map(item => (
                    <option key={item._id || item.id} value={item.item_name || item.name}>{item.item_name || item.name} (Stock: {item.stock})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="modal-actions">
              <button className="btn-outline" onClick={closeModal} disabled={saving}>Cancel</button>
              <button className="btn-primary" onClick={handleUpdate} disabled={saving || !newStatus}>
                {saving ? 'Saving...' : 'Save Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {actionTicket && actionType === 'reject' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Reject Ticket Assignment</h3>
            <p style={{ marginBottom: '4px' }}>Ticket: <strong>{actionTicket.TicketNumber || `#${actionTicket._id || actionTicket.id}`}</strong></p>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
              The admin will be notified and will reassign this ticket to another engineer.
            </p>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Reason for rejection:</label>
            <select className="modal-input" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)}>
              <option value="">-- Select a reason --</option>
              <option value="On leave">On leave</option>
              <option value="Too busy - too many active tickets">Too busy</option>
              <option value="Wrong expertise - not my skill area">Wrong expertise</option>
              <option value="Other">Other</option>
            </select>
            <div className="modal-actions">
              <button className="btn-outline" onClick={closeModal} disabled={saving}>Cancel</button>
              <button onClick={handleReject} disabled={saving || !rejectionReason}
                style={{ padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                {saving ? 'Rejecting...' : 'Reject Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedTickets;
