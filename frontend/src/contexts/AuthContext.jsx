import { createContext, useState, useEffect } from 'react';
import api from '../lib/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(null);

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        delete api.defaults.headers.Authorization;
        nav('/login');
    };

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            api.defaults.headers.Authorization = token;

            api.get('/users')
                .then(res => setUser(res.data))
                .catch(err => {
                    console.error('Token invàlid o expirat:', err);
                    logout();
                });
        } else {
            logout();
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, setToken, user, logout }}>
            {children}
        </AuthContext.Provider>
    );
}