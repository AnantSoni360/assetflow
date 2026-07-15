import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { Ticket, Search, Filter, User, AlertCircle } from 'lucide-react';
import '../Employee.css';

const statusColor = {
  'New': '#f59e0b', 'Assigned': '#3b82f6', 'In Progress': '#8b5cf6',
  'Waiting Parts': '#f97316', 'Resolved': '#10b981', 'Closed': '#64748b',
  'Reopened': '#ef4444', 'Cancelled': '#94a3b8',
};

const TicketManagement = () => {
  const { tickets, updateTicket, mergeTicket } = useData();
  const { usersList } = useAuth();

  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [assigningTicket, setAssigningTicket] = useState(null);
  const [selectedEngineer, setSelectedEngineer] = useState('');
  const [mergingTicket, setMergingTicket] = useState(null);
  const [parentTicketNumber, setParentTicketNumber] = useState('');
  const [saving, setSaving] = useState(false);

  // Only show IT Engineers from this workspace (already filtered by backend)
  const itEngineers = usersList.filter(u => u.MappedRole === 'IT Engineer' || u.role === 'IT Engineer');

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'All' || ticket.Status === filterStatus;
    const searchString = `${ticket.Title} ${ticket.Requested_By_Email} ${ticket.Assigned_To_Email || ''} ${ticket.TicketNumber || ''}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleAssign = async () => {
    if (!selectedEngineer) { alert('Please select an engineer.'); return; }
    setSaving(true);
    await updateTicket(assigningTicket._id || assigningTicket.id, {
      Status: 'Assigned',
      Assigned_To_Email: selectedEngineer
    });
    setAssigningTicket(null);
    setSelectedEngineer('');
    setSaving(false);
  };

  const openAssignModal = (ticket) => {
    setAssigningTicket(ticket);
    setSelectedEngineer(ticket.Assigned_To_Email || '');
  };

  const handleMerge = async () => {
    if (!parentTicketNumber) { alert('Please enter the parent ticket number.'); return; }
    setSaving(true);
    const result = await mergeTicket(mergingTicket.id || mergingTicket._id, parentTicketNumber);
    if (!result.success) {
      alert(result.error);
    } else {
      setMergingTicket(null);
      setParentTicketNumber('');
    }
    setSaving(false);
  };

  return (
    <div className="portal-container animate-fade-in">
      <div className="portal-header">
        <h1>Ticket Management</h1>
        <p>Review, assign, and track all IT support requests in your workspace.</p>
      </div>

      {/* Filters & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', gap: '16px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input
            type="text"
            placeholder="Search by title, ticket number, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Filter size={18} color="#64748B" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}>
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Waiting Parts">Waiting Parts</option>
            <option value="Resolved">Resolved</option>
            <option value="Reopened">Reopened</option>
            <option value="Closed">Closed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Ticket #</th>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Requested By</th>
              <th>Assigned To</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>No tickets found.</td></tr>
            ) : (
              filteredTickets.slice(0, 50).map((ticket, idx) => (
                <tr key={idx}>
                  <td style={{ fontFamily: 'monospace', color: '#3b82f6', fontWeight: 600, fontSize: '13px' }}>
                    {ticket.TicketNumber || `#${ticket._id || ticket.id}`}
                  </td>
                  <td style={{ fontWeight: 500, color: '#0F172A' }}>{ticket.Title}</td>
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
                      color: statusColor[ticket.Status] || '#64748b',
                    }}>
                      {ticket.Status}
                    </span>
                  </td>
                  <td style={{ color: '#64748B', fontSize: '13px' }}>
                    {(ticket.Requested_By_Email || '').split('@')[0].replace(/\./g, ' ') || '—'}
                  </td>
                  <td style={{ color: '#64748B', fontSize: '13px' }}>
                    {ticket.Assigned_To_Email ? ticket.Assigned_To_Email.split('@')[0].replace(/\./g, ' ') : '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {(['New', 'Reopened', 'Assigned'].includes(ticket.Status)) && (
                        <button className="btn-primary-small" onClick={() => openAssignModal(ticket)}>
                          {ticket.Assigned_To_Email ? 'Reassign' : 'Assign'}
                        </button>
                      )}
                      {!['Closed', 'Closed - Duplicate', 'Resolved', 'Cancelled'].includes(ticket.Status) && (
                        <button className="btn-outline" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => setMergingTicket(ticket)}>
                          Merge
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Assignment Modal */}
      {assigningTicket && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <h3>Assign Engineer</h3>
            <p style={{ marginBottom: '4px' }}>Ticket: <strong>{assigningTicket.TicketNumber || `#${assigningTicket._id || assigningTicket.id}`}</strong></p>
            <p style={{ marginBottom: '20px', color: '#64748b', fontSize: '14px' }}>{assigningTicket.Title}</p>

            {itEngineers.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', padding: '12px', background: '#fef3c7', borderRadius: '8px', marginBottom: '20px' }}>
                <AlertCircle size={18} />
                <span style={{ fontSize: '14px' }}>No IT Engineers found in this workspace. Please import engineers via CSV.</span>
              </div>
            ) : (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', display: 'block' }}>Select IT Engineer:</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {itEngineers.map((u, idx) => (
                    <label key={idx} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 16px', border: `2px solid ${selectedEngineer === u.email ? '#3b82f6' : '#e2e8f0'}`,
                      borderRadius: '8px', cursor: 'pointer', background: selectedEngineer === u.email ? '#eff6ff' : 'white',
                      transition: 'all 0.2s'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input type="radio" name="engineer" value={u.email} checked={selectedEngineer === u.email}
                          onChange={() => setSelectedEngineer(u.email)} style={{ accentColor: '#3b82f6' }} />
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>{u.name || u.Name}</div>
                          <div style={{ color: '#64748b', fontSize: '12px' }}>{u.email || u.Email}</div>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '12px', padding: '2px 8px', borderRadius: '100px', fontWeight: 600,
                        background: (u.active_tickets || 0) > 3 ? '#fee2e2' : '#dcfce7',
                        color: (u.active_tickets || 0) > 3 ? '#dc2626' : '#16a34a'
                      }}>
                        {u.active_tickets || 0} active
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button className="btn-outline" onClick={() => { setAssigningTicket(null); setSelectedEngineer(''); }}>Cancel</button>
              <button className="btn-primary" onClick={handleAssign} disabled={saving || !selectedEngineer}>
                {saving ? 'Assigning...' : 'Assign Ticket'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Merge Modal */}
      {mergingTicket && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <h3>Merge Duplicate Ticket</h3>
            <p style={{ marginBottom: '16px', fontSize: '14px', color: '#64748b' }}>
              Merging <strong>{mergingTicket.TicketNumber}</strong> into an existing parent ticket. The current ticket will be closed.
            </p>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label>Parent Ticket Number (e.g. INC-0001)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="INC-XXXX"
                value={parentTicketNumber}
                onChange={(e) => setParentTicketNumber(e.target.value.toUpperCase())}
              />
            </div>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => { setMergingTicket(null); setParentTicketNumber(''); }}>Cancel</button>
              <button className="btn-primary" onClick={handleMerge} disabled={saving || !parentTicketNumber} style={{ background: '#ef4444', border: 'none' }}>
                {saving ? 'Merging...' : 'Merge Ticket'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketManagement;
