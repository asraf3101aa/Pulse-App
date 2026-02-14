import { Platform } from 'react-native';
import { ApiResponse, ApiResponseStatus } from './types';

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

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const result: ApiResponse<T> = await response.json();
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
