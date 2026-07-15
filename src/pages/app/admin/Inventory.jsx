import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { useNotifications } from '../../../context/NotificationContext';
import { Package, Search, CheckCircle, AlertTriangle, Plus, Edit2 } from 'lucide-react';
import '../Employee.css';

const InventoryManagement = () => {
  const { inventory, spareParts, approveSparePartRequest, addInventoryItem, updateInventoryItem } = useData();
  const { addNotification } = useNotifications();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ item_name: '', category: 'Hardware', stock: 0 });
  const [editingId, setEditingId] = useState(null);
  const [editStock, setEditStock] = useState(0);

  // Handle case where spareParts might be undefined during loading
  const safeSpareParts = spareParts || [];
  const pendingRequests = safeSpareParts.filter(req => req.status === 'Pending');

  const handleApprove = (req) => {
    approveSparePartRequest(req._id || req.id);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    const res = await addInventoryItem({ item_name: newItem.item_name, category: newItem.category, stock: parseInt(newItem.stock) });
    if (res.success) {
      addNotification('Inventory item added successfully', 'success');
      setShowAddModal(false);
      setNewItem({ item_name: '', category: 'Hardware', stock: 0 });
    } else {
      addNotification(res.error || 'Failed to add item', 'error');
    }
  };

  const handleSaveStock = async (id) => {
    await updateInventoryItem(id, { stock: parseInt(editStock) });
    setEditingId(null);
  };

  return (
    <div className="portal-container animate-fade-in">
      <div className="portal-header">
        <h1>Inventory & Spare Parts</h1>
        <p>Manage hardware stock levels and approve engineer requests.</p>
      </div>

      <div className="dashboard-sections">
        {/* Pending Requests Section */}
        <div className="dashboard-card main-card" style={{ flex: 1 }}>
          <div className="card-header">
            <h2>Pending Approvals</h2>
            {pendingRequests.length > 0 && <span className="notification-badge" style={{ position: 'static' }}>{pendingRequests.length}</span>}
          </div>
          
          <div className="activity-list">
            {pendingRequests.length === 0 ? (
              <p className="no-data">No pending spare part requests.</p>
            ) : (
              pendingRequests.map(req => (
                <div className="activity-item" key={req._id || req.id}>
                  <div className="activity-icon" style={{ background: '#fef3c7', color: '#f59e0b' }}>
                    <AlertTriangle size={20} />
                  </div>
                  <div className="activity-details" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0 }}>{req.part_name || req.partName}</h4>
                      <button 
                        className="btn-primary-small"
                        onClick={() => handleApprove(req)}
                      >
                        Approve
                      </button>
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748B' }}>
                      Requested by Engineer: <strong>{(req.requested_by_email || req.engineerEmail || '').split('@')[0]}</strong> for Ticket <strong>{req.ticket_number || req.ticketId}</strong>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Inventory Stock Section */}
        <div className="dashboard-card side-card" style={{ flex: 1 }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Stock Levels</h2>
            <button className="btn-primary-small" onClick={() => setShowAddModal(true)}>
              <Plus size={16} /> Add Item
            </button>
          </div>
          
          <div className="data-table-container" style={{ margin: 0, border: 'none', boxShadow: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => (
                  <tr key={item._id || item.id}>
                    <td style={{ fontWeight: 500 }}>{item.item_name || item.name}</td>
                    <td style={{ color: '#64748B', fontSize: '13px' }}>{item.category}</td>
                    <td>
                      {editingId === (item._id || item.id) ? (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input 
                            type="number" 
                            className="form-input" 
                            style={{ width: '70px', padding: '4px', margin: 0 }}
                            value={editStock}
                            onChange={(e) => setEditStock(e.target.value)}
                          />
                          <button className="btn-primary-small" onClick={() => handleSaveStock(item._id || item.id)}>Save</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className={`status-badge ${item.stock < 20 ? 'warning' : 'resolved'}`}>
                            {item.stock} in stock
                          </span>
                          <button 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                            onClick={() => { setEditingId(item._id || item.id); setEditStock(item.stock); }}
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Inventory Item</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form className="modal-body" onSubmit={handleAddItem}>
              <div className="form-group">
                <label>Item Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  required
                  placeholder="e.g., Logitech Mouse"
                  value={newItem.item_name}
                  onChange={e => setNewItem({...newItem, item_name: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select 
                  className="form-input" 
                  value={newItem.category}
                  onChange={e => setNewItem({...newItem, category: e.target.value})}
                >
                  <option>Hardware</option>
                  <option>Accessories</option>
                  <option>Components</option>
                  <option>Software</option>
                </select>
              </div>
              <div className="form-group">
                <label>Initial Stock</label>
                <input 
                  type="number" 
                  className="form-input"
                  required min="0"
                  value={newItem.stock}
                  onChange={e => setNewItem({...newItem, stock: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
