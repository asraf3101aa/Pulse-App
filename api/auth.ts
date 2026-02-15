import { apiClient } from './client';
import { AuthResponse, AuthTokens, LoginCredentials, RegisterCredentials, User } from './types';

export const authApi = {
    login: (credentials: LoginCredentials) =>
        apiClient
            .post<AuthResponse>('/auth/login', credentials)
            .then((res) => res.data),

    register: (credentials: RegisterCredentials) =>
        apiClient
            .post<AuthResponse>('/auth/register', credentials)
            .then((res) => res.data),

    getMe: (token?: string) =>
        apiClient
            .get<User>('/auth/me', token ? {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            } : {})
            .then((res) => res.data),

    refresh: (refreshToken: string) =>
        apiClient
            .post<AuthTokens>('/auth/refresh', { refreshToken })
            .then((res) => res.data),
};