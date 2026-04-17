import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser && storedUser !== 'undefined') {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage:", error);
            localStorage.removeItem('user');
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        if (res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('user', JSON.stringify(res.data.data));
            return res.data.data;
        }
    };

    const register = async (name, email, password) => {
        const res = await api.post('/auth/register', { name, email, password });
        if (res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('user', JSON.stringify(res.data.data));
            return res.data.data;
        }
    };

    const googleLogin = async (idToken) => {
        const res = await api.post('/auth/google', { idToken });
        if (res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('user', JSON.stringify(res.data.data));
            return res.data.data;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, register, googleLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
