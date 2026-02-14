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
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, AtSign } from 'lucide-react-native';
import { registerSchema } from 'api/validation';
import { RegisterCredentials } from 'api/types';

interface RegisterScreenProps {
    onRegister?: (data: RegisterCredentials) => void;
    onGoToLogin?: () => void;
    isLoading?: boolean;
    error?: string;
    fieldErrors?: Record<string, string[]>;
}

const RegisterScreen = ({ onRegister, onGoToLogin, isLoading, error, fieldErrors }: RegisterScreenProps) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [localErrors, setLocalErrors] = useState<Record<string, string[]>>({});

    const handleRegister = () => {
        setLocalErrors({});
        const data: RegisterCredentials = {
            username,
            email,
            password,
            firstName,
            lastName: lastName || undefined,
            phoneNumber: phoneNumber || undefined,
        };

        const result = registerSchema.safeParse(data);

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

        if (onRegister) onRegister(data);
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

                    <View className="flex-1 max-w-[400px] w-full mx-auto justify-between">
                        {/* Logo and Title Section */}
                        <View className="items-center text-center z-10">
                            <View className="w-18 h-18 bg-[#4169E1]/18 rounded-2xl items-center justify-center mb-6">
                                <View className="w-14 h-14 bg-[#4169E1] rounded-xl items-center justify-center">
                                    <PulseLogo />
                                </View>
                            </View>
                            <Text className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                                Create Account
                            </Text>
                            <Text className="text-slate-500 dark:text-slate-400 font-medium text-center">
                                Join our community and start your journey today.
                            </Text>
                        </View>

                        {/* Form Section */}
                        <View className="mt-10 flex-1 z-10">
                            <View className="space-y-4">
                                {/* Name Section */}
                                <View className="flex-row gap-4">
                                    <View className="flex-1">
                                        <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-widest mb-2 ml-1">
                                            First Name <Text className="text-red-500">*</Text>
                                        </Text>
                                        <View className="relative">
                                            <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                                <User size={18} color="#94a3b8" />
                                            </View>
                                            <TextInput
                                                className={`w-full bg-white dark:bg-slate-900/50 border ${getFieldError('firstName') ? 'border-red-500/50' : 'border-slate-180 dark:border-slate-800'} rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-slate-100`}
                                                placeholder="John"
                                                placeholderTextColor="#415771"
                                                value={firstName}
                                                onChangeText={setFirstName}
                                                editable={!isLoading}
                                            />
                                        </View>
                                        <View className="min-h-[18px] mt-1 ml-1 justify-center">
                                            {getFieldError('firstName') && (
                                                <Text className="text-red-500 text-[10px] font-semibold">
                                                    {getFieldError('firstName')}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-widest mb-2 ml-1">
                                            Last Name
                                        </Text>
                                        <View className="relative">
                                            <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                                <User size={18} color="#94a3b8" />
                                            </View>
                                            <TextInput
                                                className={`w-full bg-white dark:bg-slate-900/50 border ${getFieldError('lastName') ? 'border-red-500/50' : 'border-slate-180 dark:border-slate-800'} rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-slate-100`}
                                                placeholder="Doe"
                                                placeholderTextColor="#415771"
                                                value={lastName}
                                                onChangeText={setLastName}
                                                editable={!isLoading}
                                            />
                                        </View>
                                        <View className="min-h-[18px] mt-1 ml-1" />
                                    </View>
                                </View>

                                {/* Username Input */}
                                <View className="mt-1">
                                    <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-widest mb-2 ml-1">
                                        Username <Text className="text-red-500">*</Text>
                                    </Text>
                                    <View className="relative">
                                        <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                            <AtSign size={18} color="#94a3b8" />
                                        </View>
                                        <TextInput
                                            className={`w-full bg-white dark:bg-slate-900/50 border ${getFieldError('username') ? 'border-red-500/50' : 'border-slate-180 dark:border-slate-800'} rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-slate-100`}
                                            placeholder="johndoe"
                                            placeholderTextColor="#415771"
                                            value={username}
                                            onChangeText={setUsername}
                                            autoCapitalize="none"
                                            editable={!isLoading}
                                        />
                                    </View>
                                    <View className="min-h-[18px] mt-1 ml-1 justify-center">
                                        {getFieldError('username') && (
                                            <Text className="text-red-500 text-[10px] font-semibold">
                                                {getFieldError('username')}
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                {/* Email Input */}
                                <View className="mt-1">
                                    <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-widest mb-2 ml-1">
                                        Email Address <Text className="text-red-500">*</Text>
                                    </Text>
                                    <View className="relative">
                                        <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                            <Mail size={18} color="#94a3b8" />
                                        </View>
                                        <TextInput
                                            className={`w-full bg-white dark:bg-slate-900/50 border ${getFieldError('email') ? 'border-red-500/50' : 'border-slate-180 dark:border-slate-800'} rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-slate-100`}
                                            placeholder="john@example.com"
                                            placeholderTextColor="#415771"
                                            value={email}
                                            onChangeText={setEmail}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                            editable={!isLoading}
                                        />
                                    </View>
                                    <View className="min-h-[18px] mt-1 ml-1 justify-center">
                                        {getFieldError('email') && (
                                            <Text className="text-red-500 text-[10px] font-semibold">
                                                {getFieldError('email')}
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                {/* Phone Input */}
                                <View className="mt-1">
                                    <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-widest mb-2 ml-1">
                                        Phone Number
                                    </Text>
                                    <View className="relative">
                                        <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                            <Phone size={18} color="#94a3b8" />
                                        </View>
                                        <TextInput
                                            className={`w-full bg-white dark:bg-slate-900/50 border ${getFieldError('phoneNumber') ? 'border-red-500/50' : 'border-slate-180 dark:border-slate-800'} rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-slate-100`}
                                            placeholder="+1 234 567 890"
                                            placeholderTextColor="#415771"
                                            value={phoneNumber}
                                            onChangeText={setPhoneNumber}
                                            keyboardType="phone-pad"
                                            editable={!isLoading}
                                        />
                                    </View>
                                    <View className="min-h-[18px] mt-1 ml-1 justify-center">
                                        {getFieldError('phoneNumber') && (
                                            <Text className="text-red-500 text-[10px] font-semibold">
                                                {getFieldError('phoneNumber')}
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                {/* Password Input */}
                                <View className="mt-1">
                                    <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-widest mb-2 ml-1">
                                        Password <Text className="text-red-500">*</Text>
                                    </Text>
                                    <View className="relative">
                                        <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                            <Lock size={18} color="#94a3b8" />
                                        </View>
                                        <TextInput
                                            className={`w-full bg-white dark:bg-slate-900/50 border ${getFieldError('password') ? 'border-red-500/50' : 'border-slate-180 dark:border-slate-800'} rounded-xl py-4 pl-12 pr-12 text-slate-900 dark:text-slate-100`}
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
                                    <View className="min-h-[18px] mt-1 ml-1 justify-center">
                                        {getFieldError('password') && (
                                            <Text className="text-red-500 text-[10px] font-semibold">
                                                {getFieldError('password')}
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                {error && (
                                    <View className="bg-red-50 dark:bg-red-900/18 border border-red-180 dark:border-red-800/50 p-4 rounded-xl mt-4 flex-row items-center">
                                        <View className="w-5 h-5 bg-red-500 rounded-full items-center justify-center mr-3">
                                            <Text className="text-white text-[10px] font-bold">!</Text>
                                        </View>
                                        <Text className="text-red-600 dark:text-red-400 text-sm font-medium flex-1">
                                            {error}
                                        </Text>
                                    </View>
                                )}

                                {/* Register Button */}
                                <TouchableOpacity
                                    className={`w-full ${isLoading ? 'bg-[#4169E1]/70' : 'bg-[#4169E1]'} rounded-xl py-4 mt-6 flex-row items-center justify-center shadow-lg active:opacity-90`}
                                    onPress={handleRegister}
                                    activeOpacity={0.8}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="white" size="small" />
                                    ) : (
                                        <>
                                            <Text className="text-white font-bold text-base mr-2">
                                                Create Account
                                            </Text>
                                            <ArrowRight size={18} color="white" />
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Login Link */}
                        <View className="pt-8 items-center z-10">
                            <View className="flex-row">
                                <Text className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                    Already have an account?{' '}
                                </Text>
                                <TouchableOpacity onPress={onGoToLogin}>
                                    <Text className="text-[#4169E1] font-bold text-sm">
                                        Log In
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

export default RegisterScreen;
