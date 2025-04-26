import { createContext, useState, useEffect } from 'react';
import api from '../lib/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            api.defaults.headers.Authorization = `Bearer ${token}`;
        } else {
            localStorage.removeItem('token');
            delete api.defaults.headers.Authorization;
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
}