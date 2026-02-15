import { Platform } from 'react-native';
import { ApiResponse, ApiResponseStatus, AuthTokens } from './types';

// Use localhost for iOS simulator, 10.0.2.2 for Android emulator
const BASE_URL = Platform.select({
    ios: 'http://localhost:3000',
    android: 'http://10.0.2.2:3000',
    default: 'http://localhost:3000',
});


export class ApiError extends Error {
    status: ApiResponseStatus;
    errors?: Record<string, string[]>;

    constructor(message: string, status: ApiResponseStatus, errors?: Record<string, string[]>) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.errors = errors;
    }
}

type TokenRefreshCallback = (tokens: AuthTokens) => void;
type LogoutCallback = () => void;

class ApiClient {
    private baseUrl: string;
    private authToken: string | null = null;
    private refreshToken: string | null = null;
    private isRefreshing = false;
    private failedQueue: { resolve: any, reject: any }[] = [];
    private onTokenRefresh?: TokenRefreshCallback;
    private onLogout?: LogoutCallback;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    setAuthToken(token: string | null) {
        this.authToken = token;
    }

    setRefreshToken(token: string | null) {
        this.refreshToken = token;
    }

    setOnTokenRefresh(callback: TokenRefreshCallback) {
        this.onTokenRefresh = callback;
    }

    setOnLogout(callback: LogoutCallback) {
        this.onLogout = callback;
    }

    private processQueue(error: any, token: string | null = null) {
        this.failedQueue.forEach((prom) => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        this.failedQueue = [];
    }

    async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
        let headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...((options.headers as Record<string, string>) || {}),
        };

        if (this.authToken) {
            headers['Authorization'] = `Bearer ${this.authToken}`;
        }

        let response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers,
        });

        // Handle 401 Unauthorized
        if (response.status === 401 && this.refreshToken && !endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/login')) {
            if (this.isRefreshing) {
                try {
                    const token = await new Promise((resolve, reject) => {
                        this.failedQueue.push({ resolve, reject });
                    });

                    // Retry with new token
                    headers['Authorization'] = `Bearer ${token}`;
                    response = await fetch(`${this.baseUrl}${endpoint}`, {
                        ...options,
                        headers,
                    });
                } catch (err) {
                    throw err;
                }
            } else {
                this.isRefreshing = true;

                try {
                    const refreshResponse = await fetch(`${this.baseUrl}/auth/refresh`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ refreshToken: this.refreshToken }),
                    });

                    if (refreshResponse.ok) {
                        const result: ApiResponse<AuthTokens> = await refreshResponse.json();
                        const newTokens = result.data;

                        this.setAuthToken(newTokens.accessToken);
                        this.setRefreshToken(newTokens.refreshToken);

                        if (this.onTokenRefresh) {
                            this.onTokenRefresh(newTokens);
                        }

                        this.processQueue(null, newTokens.accessToken);

                        // Retry the original request
                        headers['Authorization'] = `Bearer ${newTokens.accessToken}`;
                        response = await fetch(`${this.baseUrl}${endpoint}`, {
                            ...options,
                            headers,
                        });
                    } else {
                        this.processQueue(new Error('Refresh failed'));
                        if (this.onLogout) this.onLogout();
                        // Optional: clear tokens
                        this.setAuthToken(null);
                        this.setRefreshToken(null);
                    }
                } catch (err) {
                    this.processQueue(err);
                    throw err;
                } finally {
                    this.isRefreshing = false;
                }
            }
        }


        let result: ApiResponse<T>;
        try {
            result = await response.json();
        } catch {
            throw new ApiError('Something went wrong', ApiResponseStatus.ERROR);
        }

        if (result.status === ApiResponseStatus.FAIL) {
            throw new ApiError(result.message, ApiResponseStatus.FAIL, result.errors);
        } else if (result.status === ApiResponseStatus.ERROR) {
            throw new ApiError(result.message, ApiResponseStatus.ERROR);
        }

        return result;
    }

    post<T>(endpoint: string, body: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
        return this.fetch<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    get<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
        return this.fetch<T>(endpoint, {
            ...options,
            method: 'GET',
        });
    }
}

export const apiClient = new ApiClient(BASE_URL || 'http://localhost:3000');
