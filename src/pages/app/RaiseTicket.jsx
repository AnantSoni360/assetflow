import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Laptop, Image as ImageIcon } from 'lucide-react';
import './Employee.css';

const RaiseTicket = () => {
  const { user } = useAuth();
  const { addTicket, assets } = useData();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Hardware Issue');
  const [selectedAsset, setSelectedAsset] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [error, setError] = useState('');

  const myAssets = assets.filter(a => a.Assigned_To_Email === user.email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const result = await addTicket({
      Title: title,
      Description: description,
      Priority: priority,
      Category: category,
      Asset_Name: selectedAsset || null,
      Requested_By_Email: user.email
    });

    if (result.success) {
      setTicketNumber(result.ticket?.ticket_number || '');
      setSubmitted(true);
      setTimeout(() => navigate('/app/my-tickets'), 3000);
    } else {
      setError(result.error || 'Failed to submit ticket. Please try again.');
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="portal-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center' }}>
        <CheckCircle size={64} color="#22c55e" style={{ marginBottom: '24px' }} />
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Ticket Submitted!</h1>
        {ticketNumber && (
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '12px 24px', borderRadius: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '20px', fontWeight: '700', color: '#1d4ed8' }}>{ticketNumber}</span>
          </div>
        )}
        <p style={{ color: '#64748B', marginBottom: '32px' }}>Your IT support request has been logged and our admin has been notified. You will be redirected shortly.</p>
        <Link to="/app/my-tickets" className="btn-primary" style={{ textDecoration: 'none' }}>View My Tickets</Link>
      </div>
    );
  }

  return (
    <div className="portal-container animate-fade-in">
      <div className="portal-header">
        <h1>Raise a Ticket</h1>
        <p>Describe your issue below and our IT engineers will help you out.</p>
      </div>

      <div className="form-card">
        <form className="ticket-form" onSubmit={handleSubmit}>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '12px 16px', borderRadius: '8px', color: '#dc2626', marginBottom: '16px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <div className="form-row" style={{ display: 'flex', gap: '24px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Related Asset (Optional)</label>
              <div className="select-wrapper">
                <Laptop size={18} className="input-icon" color="#94a3b8" />
                <select value={selectedAsset} onChange={(e) => setSelectedAsset(e.target.value)} style={{ paddingLeft: '40px' }}>
                  <option value="">-- Select an Asset --</option>
                  {myAssets.map((asset, idx) => (
                    <option key={idx} value={asset.Asset_Name}>{asset.Asset_Name} ({asset.Serial_Number})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Issue Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Hardware Issue">Hardware Issue</option>
                <option value="Software/Application">Software/Application</option>
                <option value="Network/Connectivity">Network/Connectivity</option>
                <option value="Access/Permissions">Access/Permissions</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Issue Title</label>
            <input 
              type="text" 
              placeholder="e.g. Laptop battery draining quickly" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label>Priority Level</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="Low">Low - Not blocking work</option>
              <option value="Medium">Medium - Blocking some work</option>
              <option value="High">High - Blocking critical work</option>
              <option value="Critical">Critical - Entire system down</option>
            </select>
          </div>

          <div className="form-group">
            <label>Detailed Description</label>
            <textarea 
              rows="5" 
              placeholder="Please provide as much detail as possible..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Upload Image/Screenshot (Optional)</label>
            <div style={{ border: '2px dashed #cbd5e1', padding: '24px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc' }}>
              <ImageIcon size={24} color="#94a3b8" style={{ margin: '0 auto 8px auto' }} />
              <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>Click or drag to upload an image</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
            <button type="submit" className="btn-primary" style={{ padding: '12px 24px' }} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
            <Link to="/app" className="btn-outline" style={{ textDecoration: 'none', padding: '12px 24px', display: 'flex', alignItems: 'center' }}>Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RaiseTicket;
