import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Switch,
    Platform,
    Image,
} from 'react-native';
import {
    ChevronLeft,
    ChevronRight,
    User,
    Lock,
    Shield,
    Bell,
    Moon,
    Languages,
    HelpCircle,
    FileText,
    Info,
    LogOut,
    Home,
    Search,
    Plus,
} from 'lucide-react-native';
import { useTheme } from 'hooks/useTheme';
import { useAuth } from 'hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from 'constants/Colors';

interface SettingRowProps {
    icon: React.ElementType;
    label: string;
    value?: string;
    onPress?: () => void;
    showChevron?: boolean;
    isLast?: boolean;
    isDanger?: boolean;
    rightElement?: React.ReactNode;
}

const SettingRow = ({
    icon: Icon,
    label,
    value,
    onPress,
    showChevron = true,
    isLast = false,
    isDanger = false,
    rightElement,
}: SettingRowProps) => {
    const { isDark } = useTheme();

    return (
        <View>
            <TouchableOpacity
                onPress={onPress}
                disabled={!onPress}
                className={`flex-row items-center p-4 active:bg-slate-50 dark:active:bg-white/[0.02]`}
            >
                <Icon
                    size={22}
                    color={isDanger ? '#ff453a' : isDark ? Colors.pulse.indigo400 : Colors.pulse.ultramarineBlue}
                    strokeWidth={2}
                />
                <Text
                    className={`flex-1 ml-3 font-medium text-[16px] ${isDanger ? 'text-red-500' : isDark ? 'text-slate-100' : 'text-slate-900'
                        }`}
                >
                    {label}
                </Text>
                {value && (
                    <Text className="text-sm text-slate-400 mr-2">{value}</Text>
                )}
                {rightElement}
                {showChevron && !rightElement && (
                    <ChevronRight
                        size={20}
                        color={isDark ? Colors.pulse.slate500 : Colors.pulse.slate300}
                    />
                )}
            </TouchableOpacity>
            {!isLast && <View className={`h-px mx-4 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`} />}
        </View>
    );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => {
    const { isDark } = useTheme();
    return (
        <View className="mt-8 px-4">
            <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-pulse-ultramarineBlue/70 mb-3 ml-2">
                {title}
            </Text>
            <View className={`rounded-2xl overflow-hidden shadow-sm border ${isDark ? 'bg-slate-900/50 border-slate-800/50' : 'bg-white border-slate-200/50'
                }`}>
                {children}
            </View>
        </View>
    );
};

interface SettingScreenProps {
    onBack?: () => void;
    onGoToHome?: () => void;
    onGoToSearch?: () => void;
    onGoToNotifications?: () => void;
}

const SettingScreen = ({ onBack, onGoToHome, onGoToSearch, onGoToNotifications }: SettingScreenProps) => {
    const { theme, setThemePreference, isDark } = useTheme();
    const { logout, user } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-pulse-night' : 'bg-pulse-desertStorm'}`}>
            <StatusBar style="auto" />

            {/* Header */}
            <View className={`px-4 py-4 flex-row items-center border-b ${isDark ? 'border-slate-800/50 bg-pulse-night/80' : 'border-slate-200/50 bg-white/80'}`}>
                <TouchableOpacity onPress={onBack} className="p-2 -ml-2">
                    <ChevronLeft size={24} color={Colors.pulse.ultramarineBlue} strokeWidth={2.5} />
                </TouchableOpacity>
                <Text className={`flex-1 text-center text-lg font-bold tracking-tight mr-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Settings
                </Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <Section title="Account">
                    <SettingRow icon={User} label="Profile Info" onPress={() => { }} />
                    <SettingRow icon={Lock} label="Password & Security" onPress={() => { }} />
                    <SettingRow icon={Shield} label="Privacy" onPress={() => { }} isLast />
                </Section>

                <Section title="Preferences">
                    <SettingRow icon={Bell} label="Notifications" onPress={() => { }} />
                    <SettingRow
                        icon={Moon}
                        label="Dark Mode"
                        showChevron={false}
                        rightElement={
                            <Switch
                                value={isDark}
                                onValueChange={(val) => setThemePreference(val ? 'dark' : 'light')}
                                trackColor={{ false: '#e2e8f0', true: Colors.pulse.ultramarineBlue }}
                                thumbColor={Platform.OS === 'android' ? '#ffffff' : undefined}
                            />
                        }
                    />
                    <SettingRow icon={Languages} label="Language" value="English" onPress={() => { }} isLast />
                </Section>

                <Section title="Support">
                    <SettingRow icon={HelpCircle} label="Help Center" onPress={() => { }} />
                    <SettingRow icon={FileText} label="Terms of Service" onPress={() => { }} />
                    <SettingRow icon={Info} label="About Pulse" value="v2.4.0" showChevron={false} isLast />
                </Section>

                {/* Logout Button */}
                <View className="mt-10 px-4 mb-10">
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="w-full flex-row items-center justify-center gap-2 py-4 px-6 bg-red-500/10 rounded-2xl active:opacity-75"
                    >
                        <LogOut size={20} color="#ff453a" strokeWidth={2} />
                        <Text className="text-[#ff453a] font-bold text-[16px]">Log Out</Text>
                    </TouchableOpacity>
                    {user && (
                        <Text className="text-center text-xs text-slate-500 mt-4 leading-relaxed">
                            Logged in as @{user.username}
                        </Text>
                    )}
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View className={`flex-row items-center justify-around h-16 border-t ${isDark ? 'border-slate-800/80 bg-pulse-night/80' : 'border-slate-200 bg-white/80'}`}>
                <TouchableOpacity onPress={onGoToHome}>
                    <Home size={26} color={Colors.pulse.slate500} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onGoToSearch}>
                    <Search size={26} color={Colors.pulse.slate500} />
                </TouchableOpacity>
                <TouchableOpacity className="w-12 h-12 rounded-full bg-pulse-ultramarineBlue items-center justify-center -mt-8 shadow-lg shadow-pulse-ultramarineBlue/30 border-4 border-pulse-desertStorm dark:border-pulse-night">
                    <Plus size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onGoToNotifications}>
                    <Bell size={26} color={Colors.pulse.slate500} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <View className="w-7 h-7 rounded-full overflow-hidden border-2 border-pulse-ultramarineBlue">
                        <User size={23} color={Colors.pulse.ultramarineBlue} />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Home Indicator Spacer for iOS */}
            {Platform.OS === 'ios' && <View className="h-4" />}
        </SafeAreaView>
    );
};

export default SettingScreen;
