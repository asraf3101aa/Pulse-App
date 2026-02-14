
export enum ApiResponseStatus {
    SUCCESS = 'success',
    ERROR = 'error',
    FAIL = 'fail'
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    status: ApiResponseStatus;
    errors?: Record<string, string[]>;
    error?: string;
}
export interface User {
    id: string;
    email: string;
    name: string;
    role?: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse {
    user: User;
    tokens: AuthTokens;
}

export interface LoginCredentials {
    identifier: string;
    password?: string;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    phoneNumber?: string;
}
