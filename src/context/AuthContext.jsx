import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../../config';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser({
            ...data.user,
            Name: data.user.name,
            Email: data.user.email,
            Role: data.user.role,
            MappedRole: data.user.role
          });
        }
      } catch (err) {
        console.error("Session check failed", err);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (user && user.workspace && user.workspace !== 'SYSTEM') {
      fetch(`${API_URL}/api/users')
        .then(res => res.json())
        .then(data => {
          if (data.users) {
            const mappedUsers = data.users.map(u => ({
              ...u,
              Name: u.name,
              Email: u.email,
              Role: u.role,
              MappedRole: u.role
            }));
            setUsersList(mappedUsers);
          }
        })
        .catch(console.error);
    } else {
      setUsersList([]);
    }
  }, [user]);

  const login = async (workspace, email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspace, email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        const authenticatedUser = {
          ...data.user,
          Name: data.user.name,
          Email: data.user.email,
          Role: data.user.role,
          MappedRole: data.user.role
        };
        setUser(authenticatedUser);
        return { success: true, user: authenticatedUser };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (err) {
      return { success: false, error: 'Network error connecting to server' };
    }
  };

  const platformLogin = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/platform/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: 'Network error connecting to backend' };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      
      if (res.ok) {
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error("Logout error", err);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, usersList, login, platformLogin, logout, changePassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

