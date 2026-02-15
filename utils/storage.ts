import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const storage = {
    async setItem(key: string, value: string) {
        if (Platform.OS === 'web') {
            try {
                localStorage.setItem(key, value);
            } catch (e) {
                console.error('localStorage setItem failed', e);
            }
            return;
        }
        return await SecureStore.setItemAsync(key, value);
    },

    async getItem(key: string): Promise<string | null> {
        if (Platform.OS === 'web') {
            try {
                return localStorage.getItem(key);
            } catch (e) {
                console.error('localStorage getItem failed', e);
                return null;
            }
        }
        return await SecureStore.getItemAsync(key);
    },

    async removeItem(key: string) {
        if (Platform.OS === 'web') {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.error('localStorage removeItem failed', e);
            }
            return;
        }
        return await SecureStore.deleteItemAsync(key);
    },
};
