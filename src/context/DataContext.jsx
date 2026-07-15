import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_URL } from '../../config';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const DataContext = createContext();
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth(); // ✅ Wait for auth to resolve
  const { socket } = useSocket();
  const [assets, setAssets] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(true);

  // ── Field mapping helpers ────────────────────────────────────
  // Backend already returns PascalCase fields; this also adds lowercase aliases
  const mapTicket = (t) => ({
    ...t,
    // Ensure both formats exist
    Title: t.Title || t.title,
    Description: t.Description || t.description,
    Priority: t.Priority || t.priority,
    Status: t.Status || t.status,
    Requested_By_Email: t.Requested_By_Email || t.requested_by_email,
    Assigned_To_Email: t.Assigned_To_Email || t.assigned_to_email,
    TicketNumber: t.TicketNumber || t.ticket_number,
    Rating: t.Rating || t.rating,
    Feedback: t.Feedback || t.rating_comment,
  });

  const mapAsset = (a) => ({
    ...a,
    Asset_Name: a.Asset_Name || a.asset_name,
    Asset_Type: a.Asset_Type || a.asset_type,
    Serial_Number: a.Serial_Number || a.serial_number,
    Status: a.Status || a.status,
    Assigned_To_Email: a.Assigned_To_Email || a.assigned_to_email,
  });

  // ── Fetch functions ──────────────────────────────────────────
  const fetchTickets = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/tickets');
      if (res.ok) {
        const data = await res.json();
        setTickets((data.tickets || []).map(mapTicket));
      } else {
        setTickets([]);
      }
    } catch (err) {
      console.error('Failed to fetch tickets', err);
      setTickets([]);
    } finally {
      setLoadingTickets(false);
    }
  }, []);

  const fetchAssets = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/assets');
      if (res.ok) {
        const data = await res.json();
        setAssets((data.assets || []).map(mapAsset));
      } else {
        setAssets([]);
      }
    } catch {
      setAssets([]);
    } finally {
      setLoadingAssets(false);
    }
  }, []);

  const fetchSpareParts = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/spare-parts');
      if (res.ok) {
        const data = await res.json();
        setSpareParts(data.parts || []);
      }
    } catch {}
  }, []);

  const fetchInventory = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/inventory');
      if (res.ok) {
        const data = await res.json();
        setInventory(data.inventory || []);
      }
    } catch {}
  }, []);

  // ── ✅ Only fetch data when auth is resolved and user is logged in ───
  useEffect(() => {
    // Still loading auth session — don't fetch yet
    if (authLoading) return;

    // Not logged in, or platform admin — clear state
    if (!user || user.workspace === 'SYSTEM') {
      setAssets([]);
      setTickets([]);
      setSpareParts([]);
      setInventory([]);
      setLoadingAssets(false);
      setLoadingTickets(false);
      return;
    }

    // Auth resolved + user logged into a real workspace — fetch everything
    setLoadingAssets(true);
    setLoadingTickets(true);

    fetchAssets();
    fetchTickets();
    fetchSpareParts();
    fetchInventory();
  }, [authLoading, user, fetchAssets, fetchTickets, fetchSpareParts, fetchInventory]);

  // ── Real-Time Socket Listeners ───────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const onTicketCreated = (ticket) => {
      setTickets(prev => {
        if (prev.find(t => t._id === ticket._id)) return prev;
        return [mapTicket(ticket), ...prev];
      });
    };

    const onTicketUpdated = (ticket) => {
      setTickets(prev => prev.map(t => t._id === ticket._id ? mapTicket(ticket) : t));
    };

    const onSparePartRequested = (part) => {
      setSpareParts(prev => [part, ...prev.filter(p => p._id !== part._id)]);
    };

    const onSparePartUpdated = (part) => {
      setSpareParts(prev => prev.map(p => p._id === part._id ? part : p));
    };

    const onInventoryUpdated = (item) => {
      setInventory(prev => {
        const exists = prev.find(i => i._id === item._id);
        if (exists) return prev.map(i => i._id === item._id ? item : i);
        return [...prev, item].sort((a, b) => a.item_name.localeCompare(b.item_name));
      });
    };

    const onAssetUpdated = (asset) => {
      setAssets(prev => prev.map(a => a._id === asset._id ? mapAsset(asset) : a));
    };

    socket.on('ticket_created', onTicketCreated);
    socket.on('ticket_updated', onTicketUpdated);
    socket.on('spare_part_requested', onSparePartRequested);
    socket.on('spare_part_updated', onSparePartUpdated);
    socket.on('inventory_updated', onInventoryUpdated);
    socket.on('asset_updated', onAssetUpdated);

    return () => {
      socket.off('ticket_created', onTicketCreated);
      socket.off('ticket_updated', onTicketUpdated);
      socket.off('spare_part_requested', onSparePartRequested);
      socket.off('spare_part_updated', onSparePartUpdated);
      socket.off('inventory_updated', onInventoryUpdated);
      socket.off('asset_updated', onAssetUpdated);
    };
  }, [socket]);

  // ── Actions ──────────────────────────────────────────────────
  const addTicket = async ({ Title, Description, Priority, Category, Asset_Name }) => {
    try {
      const res = await fetch(`${API_URL}/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: Title, description: Description, priority: Priority, category: Category, asset_name: Asset_Name || null }),
      });
      if (res.ok) { const data = await res.json(); return { success: true, ticket: data.ticket }; }
      const err = await res.json(); return { success: false, error: err.error };
    } catch { return { success: false, error: 'Network error' }; }
  };

  const updateTicket = async (id, updates) => {
    const payload = {};
    if (updates.Status !== undefined) payload.status = updates.Status;
    if (updates.Assigned_To_Email !== undefined) payload.assigned_to_email = updates.Assigned_To_Email;
    if (updates.Rating !== undefined) payload.rating = updates.Rating;
    if (updates.Feedback !== undefined) payload.rating_comment = updates.Feedback;
    if (updates.rejection_reason !== undefined) payload.rejection_reason = updates.rejection_reason;

    // Optimistic update
    setTickets(prev => prev.map(t => (t.id === id || t._id === id) ? { ...t, ...updates } : t));

    try {
      await fetch(`${API_URL}/api/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) { console.error('Failed to update ticket', err); }
  };

  const requestSparePart = async (ticketId, partName) => {
    try {
      const res = await fetch(`${API_URL}/api/spare-parts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket_id: ticketId, part_name: partName })
      });
      return res.ok;
    } catch { return false; }
  };

  const approveSparePartRequest = async (requestId) => {
    await fetch(`${API_URL}/api/spare-parts/${requestId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Approved' })
    });
  };

  const rejectSparePartRequest = async (requestId) => {
    await fetch(`${API_URL}/api/spare-parts/${requestId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Rejected' })
    });
  };

  const addInventoryItem = async (data) => {
    try {
      const res = await fetch(`${API_URL}/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return { success: true };
      const err = await res.json(); return { success: false, error: err.error };
    } catch { return { success: false, error: 'Network error' }; }
  };

  const updateInventoryItem = async (id, data) => {
    try {
      const res = await fetch(`${API_URL}/api/inventory/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return { success: true };
      return { success: false };
    } catch { return { success: false }; }
  };

  const mergeTicket = async (id, parent_ticket_number) => {
    try {
      const res = await fetch(`${API_URL}/api/tickets/${id}/merge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parent_ticket_number })
      });
      if (res.ok) return { success: true };
      const data = await res.json();
      return { success: false, error: data.error };
    } catch { return { success: false, error: 'Network error' }; }
  };

  const loading = authLoading || loadingAssets || loadingTickets;

  return (
    <DataContext.Provider value={{
      assets, setAssets,
      tickets, setTickets,
      spareParts, inventory,
      loading,
      addTicket, updateTicket, mergeTicket,
      fetchTickets, fetchAssets,
      requestSparePart, approveSparePartRequest, rejectSparePartRequest,
      addInventoryItem, updateInventoryItem
    }}>
      {children}
    </DataContext.Provider>
  );
};

