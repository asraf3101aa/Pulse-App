import { useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { useAppStore, ThemePreference } from 'store/useAppStore';

export const useTheme = () => {
    const systemColorScheme = useDeviceColorScheme();
    const { setColorScheme } = useNativeWindColorScheme();
    const { themePreference, setThemePreference } = useAppStore();

    const resolvedTheme =
        themePreference === 'system'
            ? systemColorScheme || 'light'
            : themePreference;

    useEffect(() => {
        setColorScheme(resolvedTheme);
    }, [resolvedTheme, setColorScheme]);

    return {
        theme: resolvedTheme, // 'light' | 'dark'
        themePreference,      // 'system' | 'light' | 'dark'
        setThemePreference,
        isDark: resolvedTheme === 'dark',
    };
};
