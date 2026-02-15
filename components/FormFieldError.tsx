import React from 'react';
import { View, Text } from 'react-native';

interface FormFieldErrorProps {
    error?: any;
}


export const FormFieldError: React.FC<FormFieldErrorProps> = ({ error }) => {
    if (!error) return <View className="min-h-[20px] mt-1" />;

    const messages: string[] = [];

    if (error.types) {
        Object.values(error.types).forEach(msg => {
            if (typeof msg === 'string') messages.push(msg);
            else if (Array.isArray(msg)) messages.push(...msg);
        });
    } else if (error.message) {
        messages.push(error.message);
    }

    if (messages.length === 0) return <View className="min-h-[20px] mt-1" />;

    return (
        <View className="min-h-[20px] mt-1 ml-1 justify-center">
            {messages.map((msg, idx) => (
                <Text key={idx} className="text-red-500 text-[11px] font-semibold">
                    {msg}
                </Text>
            ))}
        </View>
    );
};