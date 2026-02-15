import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Send, Image as ImageIcon, Type } from 'lucide-react-native';
import { Colors } from 'constants/Colors';
import { useTheme } from 'hooks/useTheme';
import { threadsApi } from 'api/threads';
import { threadSchema } from 'api/validation';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateThreadScreenProps {
    onClose: () => void;
}

const CreateThreadScreen = ({ onClose }: CreateThreadScreenProps) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const queryClient = useQueryClient();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const createMutation = useMutation({
        mutationFn: (data: { title: string; content: string }) => threadsApi.createThread(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['threads'] });
            onClose();
        },
        onError: (error: any) => {
            Alert.alert('Error', error.message || 'Failed to create thread');
        },
    });

    const handleCreate = () => {
        setErrors({});
        const result = threadSchema.safeParse({ title, content });

        if (!result.success) {
            const formattedErrors: Record<string, string[]> = {};
            result.error.issues.forEach((issue) => {
                const path = issue.path[0] as string;
                if (!formattedErrors[path]) formattedErrors[path] = [];
                formattedErrors[path].push(issue.message);
            });
            setErrors(formattedErrors);
            return;
        }

        createMutation.mutate({ title, content });
    };

    const getFieldError = (key: string) => errors[key]?.[0];

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-pulse-night' : 'bg-white'}`}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                {/* Header */}
                <View className={`px-4 py-3 flex-row items-center justify-between border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                    <TouchableOpacity onPress={onClose} className="p-2">
                        <X size={24} color={isDark ? Colors.pulse.slate300 : Colors.pulse.slate500} />
                    </TouchableOpacity>
                    <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>New Thread</Text>
                    <TouchableOpacity
                        onPress={handleCreate}
                        disabled={createMutation.isPending || !title.trim() || !content.trim()}
                        className={`px-4 py-2 rounded-full ${createMutation.isPending ? 'bg-pulse-ultramarineBlue/50' : 'bg-pulse-ultramarineBlue'}`}
                    >
                        {createMutation.isPending ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <View className="flex-row items-center gap-1.5">
                                <Text className="text-white font-bold">Post</Text>
                                <Send size={16} color="white" />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 px-4 py-6">
                    <View className="space-y-6">
                        {/* Title Input */}
                        <View>
                            <View className="flex-row items-center gap-2 mb-2 ml-1">
                                <Type size={16} color={Colors.pulse.slate500} />
                                <Text className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Title</Text>
                            </View>
                            <TextInput
                                className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} py-2`}
                                placeholder="What's the topic?"
                                placeholderTextColor={Colors.pulse.dusk}
                                value={title}
                                onChangeText={setTitle}
                                multiline
                                maxLength={100}
                                autoFocus
                            />
                            {getFieldError('title') && (
                                <Text className="text-red-500 text-xs mt-1 ml-1">{getFieldError('title')}</Text>
                            )}
                        </View>

                        {/* Content Input */}
                        <View className="mt-4">
                            <TextInput
                                className={`text-[17px] leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'} py-2 min-h-[150px]`}
                                placeholder="Share your thoughts..."
                                placeholderTextColor={Colors.pulse.dusk}
                                value={content}
                                onChangeText={setContent}
                                multiline
                                textAlignVertical="top"
                                maxLength={1000}
                            />
                            {getFieldError('content') && (
                                <Text className="text-red-500 text-xs mt-1 ml-1">{getFieldError('content')}</Text>
                            )}
                        </View>
                    </View>
                </ScrollView>

                {/* Toolbar */}
                <View className={`px-4 py-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'} flex-row items-center`}>
                    <TouchableOpacity className="p-2 mr-2">
                        <ImageIcon size={24} color={Colors.pulse.ultramarineBlue} />
                    </TouchableOpacity>
                    <Text className="text-slate-500 text-xs italic">Media support coming soon</Text>
                    <View className="flex-1" />
                    <Text className={`text-xs font-medium ${content.length > 900 ? 'text-orange-500' : 'text-slate-500'}`}>
                        {content.length}/1000
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default CreateThreadScreen;
