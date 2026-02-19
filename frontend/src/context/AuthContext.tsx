import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/client';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load token from localStorage on first render
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
        }
        setIsLoading(false);
    }, []);

    const isAuthenticated = token !== null;

    const login = async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        const newToken = response.data.token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
    }

    const register = async (email: string, password: string) => {
        const response = await api.post('/auth/register', { email, password });
        const newToken = response.data.token;
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}