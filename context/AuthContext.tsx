import { AuthTokens } from 'api/types';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
    id: string;
    email: string;
    name?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoggedIn: boolean;
    login: (user: User, tokens: AuthTokens) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const login = (userData: User, tokens: AuthTokens) => {
        setUser(userData);
        setToken(tokens.accessToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
    };

    const value = {
        user,
        token,
        isLoggedIn: !!user,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
