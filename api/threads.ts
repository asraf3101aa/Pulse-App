import { apiClient } from './client';
import { Thread, PaginatedResponse, ApiResponse } from './types';

export const threadsApi = {
    getThreads: async (page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Thread>>> => {
        return apiClient.get<PaginatedResponse<Thread>>(`/thread/all?page=${page}&limit=${limit}`);
    },
    subscribe: async (threadId: string): Promise<ApiResponse<null>> => {
        return apiClient.post<null>(`/thread/${threadId}/subscribe`, {});
    },
    unsubscribe: async (threadId: string): Promise<ApiResponse<null>> => {
        return apiClient.fetch<null>(`/thread/${threadId}/subscribe`, { method: 'DELETE' });
    },
    createThread: async (data: { title: string; content: string }): Promise<ApiResponse<Thread>> => {
        return apiClient.post<Thread>('/thread', data);
    },
};
