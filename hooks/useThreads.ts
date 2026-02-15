import { useInfiniteQuery } from '@tanstack/react-query';
import { threadsApi } from '../api/threads';
import { ApiResponseStatus } from '../api/types';

export const useThreads = (limit: number = 10) => {
    return useInfiniteQuery({
        queryKey: ['threads'],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await threadsApi.getThreads(pageParam, limit);
            if (response.status !== ApiResponseStatus.SUCCESS) {
                throw new Error(response.message || 'Failed to fetch threads');
            }
            return response.data;
        },
        getNextPageParam: (lastPage) => {
            const { currentPage, totalPages } = lastPage.meta;
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
        initialPageParam: 1,
    });
};
