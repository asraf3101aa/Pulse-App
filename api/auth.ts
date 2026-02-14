import { apiClient } from './client';
import { ApiResponse, AuthResponse, LoginCredentials, RegisterCredentials, User } from './types';

export const authApi = {
    login: (credentials: LoginCredentials) =>
        apiClient
            .post<AuthResponse>('/auth/login', credentials)
            .then((res) => res.data),

    register: (credentials: RegisterCredentials) =>
        apiClient
            .post<AuthResponse>('/auth/register', credentials)
            .then((res) => res.data),

    getMe: (token: string) =>
        apiClient
            .get<ApiResponse<User>>('/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => res.data),
};