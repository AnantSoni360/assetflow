import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { Wifi, WifiOff } from 'lucide-react';

const ConnectionStatus = () => {
  const { connected } = useSocket();
  const [networkOnline, setNetworkOnline] = useState(navigator.onLine);

  // Track native browser network status as a secondary signal
  useEffect(() => {
    const on  = () => setNetworkOnline(true);
    const off = () => setNetworkOnline(false);
    window.addEventListener('online',  on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online',  on);
      window.removeEventListener('offline', off);
    };
  }, []);

  const isLive = connected && networkOnline;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: '8px',
      margin: '0 0 4px 0',
      fontSize: '13px',
      fontWeight: 600,
      transition: 'all 0.4s ease',
      background: isLive ? '#f0fdf4' : '#fef2f2',
      border: `1px solid ${isLive ? '#bbf7d0' : '#fecaca'}`,
      color: isLive ? '#15803d' : '#dc2626',
    }}>
      {/* Animated dot */}
      <span style={{ position: 'relative', width: 10, height: 10, display: 'inline-flex', flexShrink: 0 }}>
        {isLive && (
          <span style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: '#22c55e',
            opacity: 0.6,
            animation: 'statusPing 1.5s cubic-bezier(0,0,0.2,1) infinite',
          }} />
        )}
        <span style={{
          width: 10, height: 10,
          borderRadius: '50%',
          background: isLive ? '#22c55e' : '#ef4444',
          display: 'inline-block',
          flexShrink: 0,
          transition: 'background 0.4s ease',
        }} />
      </span>

      {isLive
        ? <><Wifi size={14} /> Live</>
        : <><WifiOff size={14} /> Offline</>
      }

      <style>{`
        @keyframes statusPing {
          0%   { transform: scale(1);   opacity: 0.6; }
          70%  { transform: scale(2.2); opacity: 0; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ConnectionStatus;
