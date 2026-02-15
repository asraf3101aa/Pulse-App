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
import { Colors } from 'constants/Colors';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from 'api/validation';
import { useAuth } from 'hooks/useAuth';
import { handleApiFormError } from 'utils/formErrors';
import { FormFieldError } from 'components/FormFieldError';

interface RegisterScreenProps {
    onGoToLogin?: () => void;
}

const RegisterScreen = ({ onGoToLogin }: RegisterScreenProps) => {
    const { register, registerMutation } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const isLoading = registerMutation.isPending;

    const {
        control,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors: formErrors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        criteriaMode: 'all',
        defaultValues: {
            username: '',
            email: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            password: '',
        },
    });

    const onSubmit = (data: RegisterInput) => {
        clearErrors();
        register(data, {
            onError: (error) => handleApiFormError(error, setError, 'Registration failed'),
        });
    };

    const getFieldError = (key: keyof RegisterInput) => {
        return formErrors[key];
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
        >
            <ScrollView
                className="flex-1 bg-pulse-desertStorm dark:bg-pulse-night"
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View className="flex-1 px-6 py-12 relative">
                    {/* Background Blur Effects */}
                    <View className="absolute -top-24 -right-24 w-64 h-64 bg-pulse-ultramarineBlue/15 rounded-full" style={{ opacity: 0.5 }} />
                    <View className="absolute -bottom-24 -left-24 w-64 h-64 bg-pulse-ultramarineBlue/10 rounded-full" style={{ opacity: 0.5 }} />

                    <View className="flex-1 max-w-[400px] w-full mx-auto justify-between">
                        {/* Logo and Title Section */}
                        <View className="items-center text-center z-10">
                            <View className="w-18 h-18 bg-pulse-ultramarineBlue/18 rounded-2xl items-center justify-center mb-6">
                                <View className="w-14 h-14 bg-pulse-ultramarineBlue rounded-xl items-center justify-center">
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
                                                <User size={18} color={Colors.pulse.muted} />
                                            </View>
                                            <Controller
                                                control={control}
                                                name="firstName"
                                                render={({ field: { onChange, onBlur, value } }) => (
                                                    <TextInput
                                                        className={`w-full bg-white dark:bg-slate-900/50 border ${getFieldError('firstName') ? 'border-red-500/50' : 'border-slate-180 dark:border-slate-800'} rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-slate-100`}
                                                        placeholder="John"
                                                        placeholderTextColor={Colors.pulse.dusk}
                                                        value={value}
                                                        onChangeText={onChange}
                                                        onBlur={onBlur}
                                                        editable={!isLoading}
                                                    />
                                                )}
                                            />
                                        </View>
                                        <FormFieldError error={getFieldError('firstName')} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-widest mb-2 ml-1">
                                            Last Name
                                        </Text>
                                        <View className="relative">
                                            <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                                <User size={18} color={Colors.pulse.muted} />
                                            </View>
                                            <Controller
                                                control={control}
                                                name="lastName"
                                                render={({ field: { onChange, onBlur, value } }) => (
                                                    <TextInput
                                                        className={`w-full bg-white dark:bg-slate-900/50 border ${getFieldError('lastName') ? 'border-red-500/50' : 'border-slate-180 dark:border-slate-800'} rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-slate-100`}
                                                        placeholder="Doe"
                                                        placeholderTextColor={Colors.pulse.dusk}
                                                        value={value}
                                                        onChangeText={onChange}
                                                        onBlur={onBlur}
                                                        editable={!isLoading}
                                                    />
                                                )}
                                            />
                                        </View>
                                        <FormFieldError error={getFieldError('lastName')} />
                                    </View>
                                </View>

                                {/* Username Input */}
                                <View className="mt-1">
                                    <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-widest mb-2 ml-1">
                                        Username <Text className="text-red-500">*</Text>
                                    </Text>
                                    <View className="relative">
                                        <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                            <AtSign size={18} color={Colors.pulse.muted} />
                                        </View>
                                        <Controller
                                            control={control}
                                            name="username"
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <TextInput
                                                    className={`w-full bg-white dark:bg-slate-900/50 border ${getFieldError('username') ? 'border-red-500/50' : 'border-slate-180 dark:border-slate-800'} rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-slate-100`}
                                                    placeholder="johndoe"
                                                    placeholderTextColor={Colors.pulse.dusk}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    autoCapitalize="none"
                                                    editable={!isLoading}
                                                />
                                            )}
                                        />
                                    </View>
                                    <FormFieldError error={getFieldError('username')} />
                                </View>

                                {/* Email Input */}
                                <View className="mt-1">
                                    <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-widest mb-2 ml-1">
                                        Email Address <Text className="text-red-500">*</Text>
                                    </Text>
                                    <View className="relative">
                                        <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                            <Mail size={18} color={Colors.pulse.muted} />
                                        </View>
                                        <Controller
                                            control={control}
                                            name="email"
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <TextInput
                                                    className={`w-full bg-white dark:bg-slate-900/50 border ${getFieldError('email') ? 'border-red-500/50' : 'border-slate-180 dark:border-slate-800'} rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-slate-100`}
                                                    placeholder="john@example.com"
                                                    placeholderTextColor={Colors.pulse.dusk}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    autoCapitalize="none"
                                                    keyboardType="email-address"
                                                    editable={!isLoading}
                                                />
                                            )}
                                        />
                                    </View>
                                    <FormFieldError error={getFieldError('email')} />
                                </View>

                                {/* Phone Input */}
                                <View className="mt-1">
                                    <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-widest mb-2 ml-1">
                                        Phone Number
                                    </Text>
                                    <View className="relative">
                                        <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                            <Phone size={18} color={Colors.pulse.muted} />
                                        </View>
                                        <Controller
                                            control={control}
                                            name="phoneNumber"
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <TextInput
                                                    className={`w-full bg-white dark:bg-slate-900/50 border ${getFieldError('phoneNumber') ? 'border-red-500/50' : 'border-slate-180 dark:border-slate-800'} rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-slate-100`}
                                                    placeholder="+1 234 567 890"
                                                    placeholderTextColor={Colors.pulse.dusk}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    keyboardType="phone-pad"
                                                    editable={!isLoading}
                                                />
                                            )}
                                        />
                                    </View>
                                    <FormFieldError error={getFieldError('phoneNumber')} />
                                </View>

                                {/* Password Input */}
                                <View className="mt-1">
                                    <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-widest mb-2 ml-1">
                                        Password <Text className="text-red-500">*</Text>
                                    </Text>
                                    <View className="relative">
                                        <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                                            <Lock size={18} color={Colors.pulse.muted} />
                                        </View>
                                        <Controller
                                            control={control}
                                            name="password"
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <TextInput
                                                    className={`w-full bg-white dark:bg-slate-900/50 border ${getFieldError('password') ? 'border-red-500/50' : 'border-slate-180 dark:border-slate-800'} rounded-xl py-4 pl-12 pr-12 text-slate-900 dark:text-slate-100`}
                                                    placeholder="••••••••"
                                                    placeholderTextColor={Colors.pulse.dusk}
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    secureTextEntry={!showPassword}
                                                    editable={!isLoading}
                                                />
                                            )}
                                        />
                                        <TouchableOpacity
                                            className="absolute right-4 top-1/2 -translate-y-1/2"
                                            onPress={() => setShowPassword(!showPassword)}
                                            disabled={isLoading}
                                        >
                                            {showPassword ? (
                                                <Eye size={18} color={Colors.pulse.muted} />
                                            ) : (
                                                <EyeOff size={18} color={Colors.pulse.muted} />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                    <FormFieldError error={getFieldError('password')} />
                                </View>

                                {formErrors.root && (
                                    <View className="bg-red-50 dark:bg-red-900/18 border border-red-180 dark:border-red-800/50 p-4 rounded-xl mt-4 flex-row items-center">
                                        <View className="w-5 h-5 bg-red-500 rounded-full items-center justify-center mr-3">
                                            <Text className="text-white text-[10px] font-bold">!</Text>
                                        </View>
                                        <Text className="text-red-600 dark:text-red-400 text-sm font-medium flex-1">
                                            {formErrors.root.message}
                                        </Text>
                                    </View>
                                )}

                                {/* Register Button */}
                                <TouchableOpacity
                                    className={`w-full ${isLoading ? 'bg-pulse-ultramarineBlue/70' : 'bg-pulse-ultramarineBlue'} rounded-xl py-4 mt-6 flex-row items-center justify-center shadow-lg active:opacity-90`}
                                    onPress={handleSubmit(onSubmit)}
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
                                    <Text className="text-pulse-ultramarineBlue font-bold text-sm">
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
