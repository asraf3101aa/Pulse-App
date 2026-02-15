import { create } from 'zustand';

interface FeedState {
    refreshing: boolean;
    setRefreshing: (refreshing: boolean) => void;
    activeTab: 'forYou' | 'following';
    setActiveTab: (tab: 'forYou' | 'following') => void;
}

export const useFeedStore = create<FeedState>((set) => ({
    refreshing: false,
    setRefreshing: (refreshing) => set({ refreshing }),
    activeTab: 'forYou',
    setActiveTab: (tab) => set({ activeTab: tab }),
}));
