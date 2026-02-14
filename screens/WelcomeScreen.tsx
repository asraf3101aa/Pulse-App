import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAuth } from 'context/AuthContext';
import { useTheme } from 'hooks/useTheme';

const WelcomeScreen = () => {
    const { user, logout } = useAuth();
    const { theme } = useTheme();

    return (
        <SafeAreaView className={`flex-1 ${theme === 'dark' ? 'bg-[#0a0a0c]' : 'bg-[#f6f7f8]'}`}>
            <View className="flex-1 px-8 justify-center items-center">
                <View className="w-24 h-24 bg-[#4169E1]/20 rounded-full items-center justify-center mb-8">
                    <Text className="text-4xl">👋</Text>
                </View>

                <Text className={`text-3xl font-bold text-center mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Welcome back, {user?.name || 'User'}!
                </Text>

                <Text className={`text-lg text-center mb-12 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    You have successfully logged into Pulse. We're glad to have you back in the discussion.
                </Text>

                <View className="w-full space-y-4">
                    <TouchableOpacity
                        className="w-full bg-[#4169E1] py-4 rounded-xl items-center shadow-lg"
                        onPress={() => console.log('Go to Feed')}
                    >
                        <Text className="text-white font-bold text-lg">View Feed</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="w-full border border-slate-200 dark:border-slate-800 py-4 rounded-xl items-center"
                        onPress={logout}
                    >
                        <Text className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default WelcomeScreen;
