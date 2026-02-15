import React, { useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Platform,
    FlatList,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import {
    Home,
    Search,
    Bell,
    Mail,
    User,
    Plus,
    MessageSquare,
    Heart,
    Share,
    MoreHorizontal,
    BadgeCheck,
} from 'lucide-react-native';
import { PulseLogo } from 'components/PulseLogo';
import { useTheme } from 'hooks/useTheme';
import { useThreads } from 'hooks/useThreads';
import { useFeedStore } from 'store/useFeedStore';
import { Thread } from 'api/types';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from 'constants/Colors';

const PostItem = ({ item }: { item: Thread }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const {
        author,
        content,
        title,
        likeCount,
        commentCount,
        subscriberCount,
        isLiked,
        isSubscribed,
        isVerified,
        hasImage,
        imageUrl,
        createdAt,
    } = item;

    const formatThreadDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const pieceDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        if (pieceDate.getTime() === today.getTime()) {
            return 'Today';
        }
        if (pieceDate.getTime() === yesterday.getTime()) {
            return 'Yesterday';
        }

        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
        if (date.getFullYear() !== now.getFullYear()) {
            options.year = 'numeric';
        }

        return date.toLocaleDateString('en-GB', options);
    };

    const time = formatThreadDate(createdAt);

    return (
        <View className={`px-4 py-4 border-b ${isDark ? 'border-slate-800/60' : 'border-slate-200'} active:bg-slate-50 dark:active:bg-white/[0.02]`}>
            <View className="flex-row gap-3">
                <View className="flex-shrink-0">
                    <View className={`w-11 h-11 rounded-full items-center justify-center bg-indigo-500/20`}>
                        <User size={22} color={Colors.pulse.indigo400} />
                    </View>
                </View>
                <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                        <View className="flex-row items-center gap-1.5 flex-wrap">
                            <Text className={`font-semibold text-[15px] text-pulse-ultramarineBlue`}>@{author.username}</Text>
                            {isVerified && <BadgeCheck size={16} color={Colors.pulse.ultramarineBlue} fill={Colors.pulse.ultramarineBlue} fillOpacity={isDark ? 0.2 : 0.1} />}
                            <Text className="text-slate-500 text-sm">• {time}</Text>
                        </View>
                        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <MoreHorizontal size={18} color={Colors.pulse.slate500} />
                        </TouchableOpacity>
                    </View>
                    <View className="mb-3">
                        {title && (
                            <Text
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                className={`text-[18px] font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}
                            >
                                {title}
                            </Text>
                        )}
                        <Text
                            numberOfLines={4}
                            ellipsizeMode="tail"
                            className={`text-[15px] leading-relaxed font-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                        >
                            {content}
                        </Text>
                        {hasImage && imageUrl && (
                            <View className={`w-full h-48 rounded-2xl mt-3 items-center justify-center border ${isDark ? 'bg-slate-800 border-slate-700/50' : 'bg-slate-100 border-slate-200'}`}>
                                <Image
                                    className="text-slate-400 opacity-50"
                                    source={{ uri: imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' }}
                                    style={{ width: '100%', height: '100%', borderRadius: 16 }}
                                />
                            </View>
                        )}
                    </View>
                    <View className="flex-row items-center justify-between max-w-[280px]">
                        <TouchableOpacity className="flex-row items-center gap-1.5">
                            <MessageSquare size={18} color={Colors.pulse.slate500} />
                            <Text className="text-xs font-medium text-slate-500">{commentCount}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center gap-1.5">
                            <Bell size={18} color={isSubscribed ? Colors.pulse.ultramarineBlue : Colors.pulse.slate500} fill={isSubscribed ? Colors.pulse.ultramarineBlue : 'transparent'} />
                            <Text className={`text-xs font-medium ${isSubscribed ? 'text-pulse-ultramarineBlue' : 'text-slate-500'}`}>{subscriberCount}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center gap-1.5">
                            <Heart size={18} color={isLiked ? Colors.pulse.ultramarineBlue : Colors.pulse.slate500} fill={isLiked ? Colors.pulse.ultramarineBlue : 'transparent'} />
                            <Text className={`text-xs font-medium ${isLiked ? 'text-pulse-ultramarineBlue' : 'text-slate-500'}`}>{likeCount}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Share size={18} color={Colors.pulse.slate500} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

const FeedScreen = ({ onCreateThread, onOpenSettings }: { onCreateThread: () => void, onOpenSettings: () => void }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { activeTab, setActiveTab } = useFeedStore();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        refetch,
        isRefetching,
    } = useThreads(10);

    const threads = data?.pages.flatMap((page) => page.items) ?? [];

    const handleRefresh = () => {
        refetch();
    }

    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const renderFooter = () => {
        if (!isFetchingNextPage) return null;
        return (
            <View className="py-6 items-center">
                <ActivityIndicator color={Colors.pulse.ultramarineBlue} />
            </View>
        );
    };

    const renderEmpty = () => {
        if (status === 'pending') return null;
        return (
            <View className="flex-1 items-center justify-center py-20 px-10">
                <Text className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>No threads found</Text>
                <Text className="text-slate-500 text-center">Be the first to start a conversation on Pulse!</Text>
            </View>
        );
    };

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-pulse-night' : 'bg-pulse-desertStorm'}`}>
            <StatusBar style="auto" />

            {/* Header */}
            <View className={`px-6 py-4 flex-row items-center justify-between border-b ${isDark ? 'border-slate-800/50' : 'border-slate-200'}`}>
                <View className="flex-row items-center gap-2">
                    <View className="w-8 h-8 bg-pulse-ultramarineBlue rounded-lg items-center justify-center">
                        <PulseLogo width={20} height={20} />
                    </View>
                    <Text className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Pulse</Text>
                </View>
                <TouchableOpacity
                    onPress={onOpenSettings}
                    className="w-9 h-9 rounded-full overflow-hidden border-2 border-pulse-ultramarineBlue/20 p-0.5"
                >
                    <View className={`w-full h-full rounded-full items-center justify-center ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                        <User size={18} color={isDark ? Colors.pulse.slate300 : Colors.pulse.slate500} />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View className={`flex-row border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <TouchableOpacity
                    onPress={() => setActiveTab('forYou')}
                    className="flex-1 py-4 items-center"
                >
                    <Text className={`text-sm ${activeTab === 'forYou' ? 'font-bold text-pulse-ultramarineBlue' : 'font-semibold text-slate-500'}`}>For You</Text>
                    {activeTab === 'forYou' && <View className="absolute bottom-0 w-16 h-1 bg-pulse-ultramarineBlue rounded-t-full" />}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab('following')}
                    className="flex-1 py-4 items-center"
                >
                    <Text className={`text-sm ${activeTab === 'following' ? 'font-bold text-pulse-ultramarineBlue' : 'font-semibold text-slate-500'}`}>Following</Text>
                    {activeTab === 'following' && <View className="absolute bottom-0 w-16 h-1 bg-pulse-ultramarineBlue rounded-t-full" />}
                </TouchableOpacity>
            </View>

            {/* Feed Content */}
            {status === 'pending' && !isRefetching ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={Colors.pulse.ultramarineBlue} />
                </View>
            ) : status === 'error' ? (
                <View className="flex-1 items-center justify-center p-6">
                    <Text className="text-red-500 mb-4 text-center">Failed to load feed. Please try again.</Text>
                    <TouchableOpacity
                        onPress={() => refetch()}
                        className="bg-pulse-ultramarineBlue px-6 py-2 rounded-full"
                    >
                        <Text className="text-white font-bold">Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={threads}
                    renderItem={({ item }) => <PostItem item={item} />}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={renderEmpty}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefetching}
                            onRefresh={handleRefresh}
                            tintColor={Colors.pulse.ultramarineBlue}
                        />
                    }
                />
            )}

            {/* Create Post FAB */}
            <TouchableOpacity
                onPress={onCreateThread}
                style={{
                    position: 'absolute',
                    bottom: Platform.OS === 'ios' ? 100 : 80,
                    right: 24,
                    shadowColor: Colors.pulse.ultramarineBlue,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 5,
                }}
                className="w-14 h-14 bg-pulse-ultramarineBlue rounded-full items-center justify-center"
            >
                <Plus size={24} color="white" />
            </TouchableOpacity>

            {/* Bottom Navigation */}
            <View className={`flex-row items-center justify-around h-16 border-t ${isDark ? 'border-slate-800/80 bg-pulse-night/80' : 'border-slate-200 bg-white/80'}`}>
                <TouchableOpacity>
                    <Home size={26} color={Colors.pulse.ultramarineBlue} fill={Colors.pulse.ultramarineBlue} fillOpacity={isDark ? 0.1 : 0.05} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Search size={26} color={Colors.pulse.slate500} />
                </TouchableOpacity>
                <TouchableOpacity className="relative">
                    <Bell size={26} color={Colors.pulse.muted} />
                    <View className="absolute top-0 right-0 w-2 h-2 bg-pulse-ultramarineBlue rounded-full border border-white dark:border-pulse-night" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Mail size={26} color={Colors.pulse.slate500} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onOpenSettings}>
                    <User size={26} color={Colors.pulse.slate500} />
                </TouchableOpacity>
            </View>

            {/* Home Indicator Spacer */}
            {Platform.OS === 'ios' && <View className="h-4" />}
        </SafeAreaView>
    );
};

export default FeedScreen;

