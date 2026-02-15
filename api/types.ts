
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
    id: number;
    username: string;
    firstName: string;
    lastName?: string;
    email: string;
    isActive: boolean;
    dateJoined: string;
    phoneNumber?: string;
    isDeleted: boolean;
    updatedAt: string;
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

export interface Thread {
    id: string;
    title: string;
    content: string;
    author: Partial<User>;
    createdAt: string;
    likeCount: number;
    commentCount: number;
    subscriberCount: number;
    isLiked: boolean;
    isSubscribed: boolean;
    isVerified?: boolean;
    hasImage?: boolean;
    imageUrl?: string;
}

export interface CreateThreadInput {
    title: string;
    content: string;
    imageUrl?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
}

