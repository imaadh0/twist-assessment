'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import api, { setAccessToken, getAccessToken } from '@/lib/api';
import { User } from '@/types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // try to restore session on mount via refresh token cookie
    const restoreSession = useCallback(async () => {
        try {
            const { data } = await api.post('/auth/refresh');
            setAccessToken(data.data.accessToken);
            // decode user from token (simple approach)
            const payload = JSON.parse(atob(data.data.accessToken.split('.')[1]));
            setUser({ id: payload.userId, email: payload.email });
        } catch {
            // no valid refresh token, user needs to log in
            setAccessToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    const login = async (email: string, password: string) => {
        const { data } = await api.post('/auth/login', { email, password });
        setAccessToken(data.data.accessToken);
        setUser(data.data.user);
    };

    const register = async (email: string, password: string) => {
        await api.post('/auth/register', { email, password });
        // auto-login after registration
        await login(email, password);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch {
            // logout even if request fails
        }
        setAccessToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
