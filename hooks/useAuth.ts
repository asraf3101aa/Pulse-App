import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import { ApiResponseStatus, RegisterCredentials, User, LoginCredentials } from '../api/types';
import { useAuth as useAuthContext } from '../context/AuthContext';
import { ApiError } from '../api/client';

export const useAuth = () => {
    const context = useAuthContext();
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: (credentials: LoginCredentials) =>
            authApi.login(credentials),
        onSuccess: (data) => {
            context.login(data.user, data.tokens);
            queryClient.setQueryData(['me'], data.user);
        }
    });

    const registerMutation = useMutation({
        mutationFn: (credentials: RegisterCredentials) =>
            authApi.register(credentials),
        onSuccess: (data) => {
            context.login(data.user, data.tokens);
            queryClient.setQueryData(['me'], data.user);
        }
    });

    const useMe = (token?: string) =>
        useQuery<User>({
            queryKey: ['me'],
            queryFn: () => authApi.getMe(token),
            enabled: context.isLoggedIn || !!token,
            retry: false,
        });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await context.logout();
        },
        onSuccess: () => {
            queryClient.clear();
        }
    });

    return {
        ...context,
        loginMutation,
        registerMutation,
        logoutMutation,
        useMe,
        // Helper methods to keep it clean
        login: loginMutation.mutate,
        register: registerMutation.mutate,
        logout: logoutMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        isRegistering: registerMutation.isPending,
        loginError: loginMutation.error,
        registerError: registerMutation.error,
    };
};