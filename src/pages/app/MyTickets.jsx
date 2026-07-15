import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import './Employee.css';

const statusColor = {
  'New': '#f59e0b',
  'Assigned': '#3b82f6',
  'In Progress': '#8b5cf6',
  'Waiting Parts': '#f97316',
  'Resolved': '#10b981',
  'Closed': '#64748b',
  'Reopened': '#ef4444',
  'Cancelled': '#94a3b8',
};

const MyTickets = () => {
  const { user } = useAuth();
  const { tickets, updateTicket, loading } = useData();

  const [verifyingTicket, setVerifyingTicket] = useState(null);
  const [reopenTicket, setReopenTicket] = useState(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading tickets...</div>;

  const myTickets = tickets.filter(t => t.Requested_By_Email === user.email);

  const handleVerifyClose = async () => {
    setSaving(true);
    await updateTicket(verifyingTicket.id, {
      Status: 'Closed',
      Rating: rating,
      Feedback: feedback
    });
    setVerifyingTicket(null);
    setRating(5);
    setFeedback('');
    setSaving(false);
  };

  const handleReopen = async () => {
    setSaving(true);
    await updateTicket(reopenTicket.id, { Status: 'Reopened' });
    setReopenTicket(null);
    setSaving(false);
  };

  const handleCancel = async (ticket) => {
    if (!window.confirm(`Cancel ticket "${ticket.Title}"? This cannot be undone.`)) return;
    await updateTicket(ticket._id || ticket.id, { Status: 'Cancelled' });
  };

  return (
    <div className="portal-container animate-fade-in">
      <div className="portal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>My Tickets</h1>
          <p>Track the status of your IT support requests.</p>
        </div>
        <Link to="/app/raise-ticket" className="btn-primary" style={{ textDecoration: 'none' }}>+ Raise Ticket</Link>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Ticket #</th>
              <th>Issue Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {myTickets.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                  You have no support tickets. <Link to="/app/raise-ticket" style={{ color: '#3b82f6' }}>Raise one now</Link>.
                </td>
              </tr>
            ) : (
              myTickets.map((ticket, idx) => (
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
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: '100px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: `${statusColor[ticket.Status] || '#64748b'}20`,
                      color: statusColor[ticket.Status] || '#64748b',
                    }}>
                      {ticket.Status}
                    </span>
                  </td>
                  <td style={{ color: '#64748B', fontSize: '13px' }}>
                    {ticket.Assigned_To_Email ? ticket.Assigned_To_Email.split('@')[0].replace('.', ' ') : '—'}
                  </td>
                  <td>
                    {ticket.Status === 'Resolved' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-primary-small" onClick={() => setVerifyingTicket(ticket)}>✓ Close</button>
                        <button className="btn-outline" style={{ fontSize: '12px', padding: '4px 10px' }} onClick={() => setReopenTicket(ticket)}>↩ Reopen</button>
                      </div>
                    )}
                    {(ticket.Status === 'New' || ticket.Status === 'Assigned') && (
                      <button
                        onClick={() => handleCancel(ticket)}
                        style={{ fontSize: '12px', padding: '4px 10px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: '6px', cursor: 'pointer' }}>
                        Cancel
                      </button>
                    )}
                    {ticket.Status === 'Closed' && (
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star key={star} size={14} color={star <= ticket.Rating ? '#f59e0b' : '#e2e8f0'} fill={star <= ticket.Rating ? '#f59e0b' : 'none'} />
                        ))}
                      </div>
                    )}
                    {!['Resolved', 'New', 'Assigned', 'Closed'].includes(ticket.Status) && (
                      <span style={{ color: '#cbd5e1', fontSize: '12px' }}>—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Verify & Close Modal */}
      {verifyingTicket && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Verify Repair & Close Ticket</h3>
            <p>Has your issue been fully resolved?</p>
            <p style={{ fontWeight: 500, color: '#0F172A', marginBottom: '16px' }}>{verifyingTicket.Title}</p>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#64748B', marginBottom: '8px' }}>Rate the service:</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} onClick={() => setRating(star)}>
                    <Star size={28} color={star <= rating ? '#f59e0b' : '#cbd5e1'} fill={star <= rating ? '#f59e0b' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label>Additional Feedback (Optional)</label>
              <textarea rows="3" className="modal-input" placeholder="How did our engineer do?" value={feedback} onChange={(e) => setFeedback(e.target.value)}></textarea>
            </div>

            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setVerifyingTicket(null)} disabled={saving}>Cancel</button>
              <button className="btn-primary" onClick={handleVerifyClose} disabled={saving}>{saving ? 'Saving...' : 'Verify & Close'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Reopen Modal */}
      {reopenTicket && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Reopen Ticket?</h3>
            <p>The issue with <strong>{reopenTicket.Title}</strong> is not fully resolved?</p>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>The admin will be notified and an engineer will be assigned again.</p>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setReopenTicket(null)} disabled={saving}>Cancel</button>
              <button className="btn-primary" onClick={handleReopen} disabled={saving} style={{ background: '#f59e0b' }}>{saving ? 'Reopening...' : 'Yes, Reopen'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTickets;
