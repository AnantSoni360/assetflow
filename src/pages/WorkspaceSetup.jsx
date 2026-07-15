import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, UploadCloud, FileText, Download, ArrowRight, AlertCircle } from 'lucide-react';
import './Login.css';

const WorkspaceSetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Step 1: Users, Step 2: Assets, Step 3: Tickets, Step 4: Complete
  const uploadFiles = {
    1: { name: 'users.csv', endpoint: '/api/upload/users' },
    2: { name: 'assets.csv', endpoint: '/api/upload/assets' },
    3: { name: 'tickets.csv', endpoint: '/api/upload/tickets' }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setSuccessMsg('');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(uploadFiles[step].endpoint, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (res.ok) {
        setSuccessMsg(data.message);
        setTimeout(() => {
          setSuccessMsg('');
          setStep(step + 1);
        }, 1500);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Network error uploading file');
    } finally {
      setLoading(false);
      e.target.value = null; // reset input
    }
  };

  const downloadTemplate = (type) => {
    let content = '';
    if (type === 'users') content = 'Name,Email,Role,Department\nAnant Soni,anant@abc.com,Employee,IT';
    if (type === 'assets') content = 'Asset_Name,Asset_Type,Serial_Number,Status,Assigned_To_Email\nDell Latitude 5440,Laptop,DL5440123,Assigned,anant@abc.com';
    if (type === 'tickets') content = 'Title,Description,Priority,Status,Requested_By_Email,Assigned_To_Email\nKeyboard Issue,A key not working,Medium,Assigned,anant@abc.com,';
    
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `${type}_template.csv`);
    a.click();
  };

  return (
    <div className="login-layout animate-fade-in" style={{ justifyContent: 'center', alignItems: 'center', background: '#f8fafc' }}>
      
      <div style={{ maxWidth: '800px', width: '100%', background: 'white', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'flex' }}>
        
        {/* Sidebar */}
        <div style={{ width: '280px', background: '#0f172a', padding: '32px', color: 'white' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Workspace Setup</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '32px' }}>Complete your configuration</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: step >= 1 ? 1 : 0.5 }}>
              {step > 1 ? <CheckCircle size={20} color="#10b981" /> : <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>1</div>}
              <span style={{ fontWeight: step === 1 ? '600' : 'normal' }}>Upload Users.csv</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: step >= 2 ? 1 : 0.5 }}>
              {step > 2 ? <CheckCircle size={20} color="#10b981" /> : <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid ' + (step === 2 ? 'white' : '#64748b'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>2</div>}
              <span style={{ fontWeight: step === 2 ? '600' : 'normal' }}>Upload Assets.csv</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: step >= 3 ? 1 : 0.5 }}>
              {step > 3 ? <CheckCircle size={20} color="#10b981" /> : <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid ' + (step === 3 ? 'white' : '#64748b'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>3</div>}
              <span style={{ fontWeight: step === 3 ? '600' : 'normal' }}>Upload Tickets.csv</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: step >= 4 ? 1 : 0.5 }}>
              {step > 4 ? <CheckCircle size={20} color="#10b981" /> : <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid ' + (step === 4 ? 'white' : '#64748b'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>4</div>}
              <span style={{ fontWeight: step === 4 ? '600' : 'normal' }}>Finish Setup</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, padding: '48px', display: 'flex', flexDirection: 'column' }}>
          
          {step <= 3 && (
            <>
              <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Step {step}: Upload {uploadFiles[step].name}</h2>
              <p style={{ color: '#64748b', marginBottom: '24px' }}>
                Only CSV files matching the official AssetFlow template are accepted. Files with missing, extra, or incorrectly named columns will be rejected.
              </p>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                <button onClick={() => downloadTemplate('users')} className="btn-outline" style={{ flex: 1, fontSize: '13px', padding: '8px' }}><Download size={14} style={{ marginRight: '6px' }} /> users_template.csv</button>
                <button onClick={() => downloadTemplate('assets')} className="btn-outline" style={{ flex: 1, fontSize: '13px', padding: '8px' }}><Download size={14} style={{ marginRight: '6px' }} /> assets_template.csv</button>
                <button onClick={() => downloadTemplate('tickets')} className="btn-outline" style={{ flex: 1, fontSize: '13px', padding: '8px' }}><Download size={14} style={{ marginRight: '6px' }} /> tickets_template.csv</button>
              </div>

              {error && (
                <div style={{ background: '#fef2f2', color: '#ef4444', padding: '16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Upload Failed</strong>
                    <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>{error}</p>
                  </div>
                </div>
              )}

              {successMsg && (
                <div style={{ background: '#dcfce7', color: '#16a34a', padding: '16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle size={20} />
                  <strong>{successMsg}</strong>
                </div>
              )}

              <label style={{ 
                border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '48px', 
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', background: '#f8fafc', transition: '0.2s'
              }}>
                <UploadCloud size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
                <span style={{ fontWeight: '500', color: '#334155' }}>{loading ? 'Uploading...' : `Click to upload ${uploadFiles[step].name}`}</span>
                <span style={{ fontSize: '13px', color: '#94a3b8', marginTop: '8px' }}>CSV files only</span>
                <input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFileUpload} disabled={loading} />
              </label>

              {step === 1 && (
                <div style={{ marginTop: '24px', padding: '16px', background: '#eff6ff', borderRadius: '8px', color: '#1e40af', fontSize: '14px' }}>
                  <strong>Note:</strong> All imported users will be assigned the temporary password <code>Password@123</code>. They will be required to change it when they log in for the first time.
                </div>
              )}
            </>
          )}

          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <CheckCircle size={40} color="#16a34a" />
              </div>
              <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Workspace Setup Completed Successfully</h2>
              <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '16px' }}>Your company data has been securely imported and isolated.</p>
              
              <button className="btn-primary" onClick={() => navigate('/app')} style={{ padding: '12px 32px', fontSize: '16px' }}>
                Go to Dashboard <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default WorkspaceSetup;
