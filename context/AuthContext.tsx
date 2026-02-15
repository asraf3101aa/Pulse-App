import { AuthTokens, User } from 'api/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { storage } from 'utils/storage';
import { authApi } from 'api/auth';
import { apiClient } from 'api/client';

interface AuthContextType {
    user: User | null;
    tokens: AuthTokens | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (user: User, tokens: AuthTokens) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [tokens, setTokens] = useState<AuthTokens | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const logout = async () => {
        setUser(null);
        setTokens(null);
        apiClient.setAuthToken(null);
        apiClient.setRefreshToken(null);
        try {
            await storage.removeItem('auth_tokens');
        } catch (error) {
            console.error('Failed to clear auth tokens', error);
        }
    };

    const loadStorageData = async () => {
        try {
            const tokensSerialized = await storage.getItem('auth_tokens');
            if (tokensSerialized) {
                const { token, refreshToken } = JSON.parse(tokensSerialized);
                apiClient.setAuthToken(token);
                apiClient.setRefreshToken(refreshToken);

                try {
                    const user = await authApi.getMe(token);
                    if (!user) {
                        await logout();
                        return;
                    }
                    setUser(user);
                    setTokens({ accessToken: token, refreshToken });

                } catch (error) {
                    console.error('Failed to fetch user data', error);
                    // If fetching user fails, we don't necessarily logout if it's just a network error
                    // But if it's 401, ApiClient will handled it.
                    // If we reach here, it means we couldn't even get the user.
                    await logout();
                }
            }
        } catch (error) {
            console.error('Failed to load auth data', error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        apiClient.setOnTokenRefresh(async (newTokens) => {
            setTokens(newTokens);
            try {
                await storage.setItem('auth_tokens', JSON.stringify({
                    token: newTokens.accessToken,
                    refreshToken: newTokens.refreshToken,
                }));
            } catch (error) {
                console.error('Failed to save refreshed tokens', error);
            }
        });

        apiClient.setOnLogout(() => {
            logout();
        });

        loadStorageData();
    }, []);


    const login = async (userData: User, authTokens: AuthTokens) => {
        setUser(userData);
        setTokens(authTokens);
        apiClient.setAuthToken(authTokens.accessToken);
        apiClient.setRefreshToken(authTokens.refreshToken);

        try {
            await storage.setItem('auth_tokens', JSON.stringify({
                token: authTokens.accessToken,
                refreshToken: authTokens.refreshToken,
            }));
        } catch (error) {
            console.error('Failed to save auth tokens', error);
        }
    };


    const value = {
        user,
        tokens,
        isLoggedIn: !!user,
        isLoading,
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
