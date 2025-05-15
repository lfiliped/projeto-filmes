import React, { createContext, useState, useEffect, useContext } from 'react';
import jwtDecode from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        api
          .get('/profile')
          .then((response) => {
            setUser({ ...response.data, role: decoded.role });
            setLoading(false);
          })
          .catch(() => {
            localStorage.removeItem('token');
            setLoading(false);
          });
      } catch (err) {
        localStorage.removeItem('token');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/login', { email, password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    const userData = await api.get('/profile');
    setUser({ ...userData.data, role: decoded.role });
  };

  const register = async (name, email, password) => {
    await api.post('/register', { name, email, password });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };

export function useAuth() {
  return useContext(AuthContext);
}
