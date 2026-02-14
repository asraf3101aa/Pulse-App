import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useAuth } from 'context/AuthContext';
import { useTheme } from 'hooks/useTheme';
import { EditScreenInfo } from './EditScreenInfo';

type ScreenContentProps = {
  title: string;
  path: string;
  children?: React.ReactNode;
};

export const ScreenContent = ({ title, path, children }: ScreenContentProps) => {
  const { user, logout } = useAuth();
  const { theme, themePreference, setThemePreference } = useTheme();

  return (
    <View className={`${styles.container} ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}>
      <Text className={`${styles.title} ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{title}</Text>
      {user && (
        <Text className={`mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'}`}>
          Welcome, {user.name}
        </Text>
      )}

      {/* Theme Selection Section */}
      <View className="mt-8 w-4/5">
        <Text className={`text-xs font-bold uppercase tracking-widest mb-3 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
          Appearance
        </Text>
        <View className={`flex-row p-1 rounded-xl ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
          {['system', 'light', 'dark'].map((pref) => (
            <TouchableOpacity
              key={pref}
              onPress={() => setThemePreference(pref as any)}
              className={`flex-1 py-2 rounded-lg items-center ${themePreference === pref ? (theme === 'dark' ? 'bg-slate-700 shadow-sm' : 'bg-white shadow-sm') : ''}`}
            >
              <Text className={`text-xs font-bold capitalize ${themePreference === pref ? (theme === 'dark' ? 'text-white' : 'text-blue-600') : (theme === 'dark' ? 'text-slate-500' : 'text-slate-500')}`}>
                {pref}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className={styles.separator} />
      <EditScreenInfo path={path} />
      {children}

      <TouchableOpacity
        onPress={logout}
        className="mt-10 bg-red-500 px-6 py-2 rounded-lg"
      >
        <Text className="text-white font-bold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = {
  container: `items-center flex-1 justify-center bg-white`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold`,
};
