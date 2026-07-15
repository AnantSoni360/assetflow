import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';


const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Only connect when user is logged into a real workspace (not platform admin)
    if (!user || !user.workspace || user.workspace === 'SYSTEM') {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    // Read JWT token from cookie
    const token = document.cookie
      .split(';')
      .find(c => c.trim().startsWith('token='))
      ?.split('=')[1];

    const socketUrl = API_URL || window.location.origin;
    const newSocket = io(socketUrl, {
      withCredentials: true,
      auth: { token },
      path: '/socket.io',
      // Reconnect settings
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    newSocket.on('connect', () => {
      setConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      setConnected(false);
      // If server forcibly disconnected, attempt reconnect manually
      if (reason === 'io server disconnect') {
        newSocket.connect();
      }
    });

    newSocket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
      setConnected(false);
    });

    newSocket.on('reconnect', () => {
      setConnected(true);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setConnected(false);
    };
  }, [user]); // re-run when user changes (login/logout)

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

