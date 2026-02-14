import { create } from 'zustand';

export type ThemePreference = 'system' | 'light' | 'dark';

interface AppState {
    themePreference: ThemePreference;
    setThemePreference: (preference: ThemePreference) => void;
    notificationsEnabled: boolean;
    setNotificationsEnabled: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
    themePreference: 'system',
    setThemePreference: (preference) => set({ themePreference: preference }),
    notificationsEnabled: true,
    setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
}));
