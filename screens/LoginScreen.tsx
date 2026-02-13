import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';

import { SafeAreaProvider } from 'react-native-safe-area-context';

interface LoginScreenProps {
    onLogin?: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View className="flex-1 bg-white">
            <LinearGradient
                colors={['#4F46E5', '#7C3AED']}
                className="absolute bottom-0 left-0 right-0 top-0"
            />

            <SafeAreaProvider className="flex-1">
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                        <View className="flex-1 justify-center px-8 py-12">
                            {/* Logo & Header */}
                            <View className="mb-10 items-center">
                                <View className="h-24 w-24 items-center justify-center rounded-[32px] bg-white/20 shadow-2xl backdrop-blur-xl border border-white/30">
                                    <Ionicons name="pulse" size={56} color="white" />
                                </View>
                                <Text className="mt-8 text-5xl font-extrabold tracking-tight text-white">
                                    Pulse
                                </Text>
                                <Text className="mt-2 text-xl font-medium text-white/80">
                                    Elevate your experience
                                </Text>
                            </View>

                            {/* Form Card */}
                            <View className="rounded-[40px] bg-white/10 p-8 shadow-2xl backdrop-blur-2xl border border-white/20">
                                <View className="gap-y-5">
                                    {/* Email Input */}
                                    <View className="gap-y-2">
                                        <Text className="ml-1 text-sm font-semibold text-white/90">Email Address</Text>
                                        <View className="flex-row items-center rounded-2xl bg-white/10 px-4 py-4 border border-white/10">
                                            <Ionicons name="mail-outline" size={22} color="rgba(255,255,255,0.7)" />
                                            <TextInput
                                                placeholder="name@example.com"
                                                placeholderTextColor="rgba(255,255,255,0.4)"
                                                className="ml-3 flex-1 text-lg text-white"
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                value={email}
                                                onChangeText={setEmail}
                                            />
                                        </View>
                                    </View>

                                    {/* Password Input */}
                                    <View className="gap-y-2">
                                        <Text className="ml-1 text-sm font-semibold text-white/90">Password</Text>
                                        <View className="flex-row items-center rounded-2xl bg-white/10 px-4 py-4 border border-white/10">
                                            <Ionicons name="lock-closed-outline" size={22} color="rgba(255,255,255,0.7)" />
                                            <TextInput
                                                placeholder="••••••••"
                                                placeholderTextColor="rgba(255,255,255,0.4)"
                                                className="ml-3 flex-1 text-lg text-white"
                                                secureTextEntry={!showPassword}
                                                value={password}
                                                onChangeText={setPassword}
                                            />
                                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                                <Ionicons
                                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                                    size={22}
                                                    color="rgba(255,255,255,0.7)"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/* Forgot Password */}
                                    <TouchableOpacity className="items-end">
                                        <Text className="text-sm font-bold text-white/90">Forgot Password?</Text>
                                    </TouchableOpacity>

                                    {/* Login Button */}
                                    <TouchableOpacity
                                        onPress={onLogin}
                                        className="mt-4 overflow-hidden rounded-[20px] bg-white shadow-xl shadow-indigo-500/50 active:scale-[0.98] transition-all"
                                    >
                                        <View className="py-4">
                                            <Text className="text-center text-xl font-black text-indigo-600">
                                                Sign In
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                {/* Divider */}
                                <View className="my-10 flex-row items-center">
                                    <View className="h-[1px] flex-1 bg-white/20" />
                                    <Text className="mx-4 text-[10px] font-black text-white/50 uppercase tracking-[2px]">
                                        Or continue with
                                    </Text>
                                    <View className="h-[1px] flex-1 bg-white/20" />
                                </View>

                                {/* Social Logins */}
                                <View className="flex-row justify-between gap-x-4">
                                    <TouchableOpacity className="flex-1 flex-row items-center justify-center rounded-2xl bg-white/10 py-4 border border-white/10 active:bg-white/20">
                                        <Ionicons name="logo-google" size={24} color="white" />
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-1 flex-row items-center justify-center rounded-2xl bg-white/10 py-4 border border-white/10 active:bg-white/20">
                                        <Ionicons name="logo-apple" size={24} color="white" />
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-1 flex-row items-center justify-center rounded-2xl bg-white/10 py-4 border border-white/10 active:bg-white/20">
                                        <Ionicons name="logo-facebook" size={24} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Footer */}
                            <View className="mt-12 mb-8 flex-row justify-center">
                                <Text className="text-lg text-white/70">Don't have an account? </Text>
                                <TouchableOpacity>
                                    <Text className="text-lg font-black text-white underline">Sign Up</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaProvider>
        </View>
    );
}
