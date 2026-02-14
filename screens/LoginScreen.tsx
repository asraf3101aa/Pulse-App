import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { PulseLogo } from 'components/PulseLogo';
import { User, Lock, Eye, EyeOff, ArrowRight, Chrome, Apple } from 'lucide-react-native';
import { loginSchema } from 'api/validation';

interface LoginScreenProps {
    onLogin?: (identifier: string, password?: string) => void;
    onGoToRegister?: () => void;
    isLoading?: boolean;
    error?: string;
    fieldErrors?: Record<string, string[]>;
}

const PulseLoginScreen = ({ onLogin, onGoToRegister, isLoading, error, fieldErrors }: LoginScreenProps) => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [localErrors, setLocalErrors] = useState<Record<string, string[]>>({});

    const handleLogin = () => {
        setLocalErrors({});
        const result = loginSchema.safeParse({ identifier, password });

        if (!result.success) {
            const formattedErrors: Record<string, string[]> = {};
            result.error.issues.forEach((issue) => {
                const path = issue.path[0] as string;
                if (!formattedErrors[path]) formattedErrors[path] = [];
                formattedErrors[path].push(issue.message);
            });
            setLocalErrors(formattedErrors);
            return;
        }

        if (onLogin) onLogin(identifier, password);
    };

    const handleGoogleLogin = () => {
        console.log('Google login pressed');
    };

    const handleAppleLogin = () => {
        console.log('Apple login pressed');
    };

    const getFieldError = (key: string) => localErrors[key]?.[0] || fieldErrors?.[key]?.[0];

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
        >
            <ScrollView
                className="flex-1 bg-[#f6f7f8] dark:bg-[#0a0a0c]"
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View className="flex-1 px-6 py-12 relative">
                    {/* Background Blur Effects */}
                    <View className="absolute -top-24 -right-24 w-64 h-64 bg-[#4169E1]/15 rounded-full" style={{ opacity: 0.5 }} />
                    <View className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#4169E1]/10 rounded-full" style={{ opacity: 0.5 }} />

                    {/* Content Container */}
                    <View className="flex-1 max-w-[400px] w-full mx-auto justify-between">
                        {/* Logo and Title Section */}
                        <View className="items-center text-center z-10">
                            <View className="w-20 h-20 bg-[#4169E1]/20 rounded-2xl items-center justify-center mb-6">
                                <View className="w-14 h-14 bg-[#4169E1] rounded-xl items-center justify-center">
                                    <PulseLogo />
                                </View>
                            </View>
                            <Text className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                                Pulse
                            </Text>
                            <Text className="text-slate-500 dark:text-slate-400 font-medium">
                                Join the discussion in real-time.
                            </Text>
                        </View>

                        {/* Form Section */}
                        <View className="mt-12 flex-1 z-10">
                            <View className="space-y-5">
                                {/* Identifier Input */}
                                <View>
                                    <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-widest mb-2 ml-1">
                                        Email or Username
                                    </Text>
                                    <View className="relative">
                                        <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                            <User size={18} color="#94a3b8" />
                                        </View>
                                        <TextInput
                                            className={`w-full bg-white dark:bg-slate-900/50 border ${getFieldError('identifier') ? 'border-red-500/50' : 'border-slate-200 dark:border-slate-800'} rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-slate-100`}
                                            placeholder="Email or Username"
                                            placeholderTextColor="#415771"
                                            value={identifier}
                                            onChangeText={setIdentifier}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                            editable={!isLoading}
                                        />
                                    </View>
                                    <View className="min-h-[20px] mt-1 ml-1 justify-center">
                                        {getFieldError('identifier') && (
                                            <Text className="text-red-500 text-[11px] font-semibold">
                                                {getFieldError('identifier')}
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                {/* Password Input */}
                                <View className="mt-2">
                                    <View className="flex-row justify-between mb-2 px-1">
                                        <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-widest">
                                            Password
                                        </Text>
                                        <TouchableOpacity disabled={isLoading}>
                                            <Text className="text-xs font-bold text-[#4169E1]">
                                                Forgot Password?
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View className="relative">
                                        <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                            <Lock size={18} color="#94a3b8" />
                                        </View>
                                        <TextInput
                                            className={`w-full bg-white dark:bg-slate-900/50 border ${getFieldError('password') ? 'border-red-500/50' : 'border-slate-200 dark:border-slate-800'} rounded-xl py-4 pl-12 pr-12 text-slate-900 dark:text-slate-100`}
                                            placeholder="••••••••"
                                            placeholderTextColor="#415771"
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry={!showPassword}
                                            editable={!isLoading}
                                        />
                                        <TouchableOpacity
                                            className="absolute right-4 top-1/2 -translate-y-1/2"
                                            onPress={() => setShowPassword(!showPassword)}
                                            disabled={isLoading}
                                        >
                                            {showPassword ? (
                                                <Eye size={18} color="#94a3b8" />
                                            ) : (
                                                <EyeOff size={18} color="#94a3b8" />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                    <View className="min-h-[20px] mt-1 ml-1 justify-center">
                                        {getFieldError('password') && (
                                            <Text className="text-red-500 text-[11px] font-semibold">
                                                {getFieldError('password')}
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                {error && (
                                    <View className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-4 rounded-xl mt-4 flex-row items-center">
                                        <View className="w-5 h-5 bg-red-500 rounded-full items-center justify-center mr-3">
                                            <Text className="text-white text-[10px] font-bold">!</Text>
                                        </View>
                                        <Text className="text-red-600 dark:text-red-400 text-sm font-medium flex-1">
                                            {error}
                                        </Text>
                                    </View>
                                )}

                                {/* Login Button */}
                                <TouchableOpacity
                                    className={`w-full ${isLoading ? 'bg-[#4169E1]/70' : 'bg-[#4169E1]'} rounded-xl py-4 mt-4 flex-row items-center justify-center shadow-lg active:opacity-90`}
                                    onPress={handleLogin}
                                    activeOpacity={0.8}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="white" size="small" />
                                    ) : (
                                        <>
                                            <Text className="text-white font-bold text-base mr-2">
                                                Log In
                                            </Text>
                                            <ArrowRight size={20} color="white" />
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Social Login Section */}
                            <View className="mt-10">
                                <View className="flex-row items-center justify-center mb-8">
                                    <View className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                                    <Text className="mx-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                        Or continue with
                                    </Text>
                                    <View className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                                </View>

                                <View className="flex-row gap-4">
                                    {/* Google Button */}
                                    <TouchableOpacity
                                        className="flex-1 flex-row items-center justify-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-3.5 rounded-xl"
                                        onPress={handleGoogleLogin}
                                        activeOpacity={0.7}
                                    >
                                        <Image
                                            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUFG6i_C24Cy5IgLGLo-EH0-NkqVhekJtxO3r1NopVdUQOt7YL693WUtKP8yDbjQTszhXanZT26TtpbCIA57X5Acu6uOXuo6LV29o4D9dSD7XxzrNNdQ9_di80SBT7feNJSE79-djf9Ge00-RztDI7iEFAv0PPcODe299dATijsJBqpwFu6dg7wCghq6CsqtJGmmRTAQj7f95qBBD4gKSwXDc8zat1-unqpINTeHxl3RIB3MBEEw-itwqw2UVsDyMt34iPUN9UphA' }}
                                            className="w-5 h-5"
                                            style={{ opacity: 0.8 }}
                                        />
                                        <Text className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                            Google
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Apple Button */}
                                    <TouchableOpacity
                                        className="flex-1 flex-row items-center justify-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-3.5 rounded-xl"
                                        onPress={handleAppleLogin}
                                        activeOpacity={0.7}
                                    >
                                        <Apple size={20} color="#94a3b8" />
                                        <Text className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                            Apple
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Sign Up Link */}
                        <View className="pt-8 items-center z-10">
                            <View className="flex-row">
                                <Text className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                    New to Pulse?{' '}
                                </Text>
                                <TouchableOpacity onPress={onGoToRegister}>
                                    <Text className="text-[#4169E1] font-bold text-sm">
                                        Sign Up Now
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Home Indicator */}
                        <View className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-800 dark:bg-white/10 rounded-full" style={{ opacity: 0.5 }} />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default PulseLoginScreen;