import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { getFeed } from '../services/social.service';
import { useState, useEffect } from 'react';

export interface SocialFeedFilters {
    type?: string;
    targetUserId?: number;
}

/**
 * Hook to manage the social feed with infinite scrolling
 */
export function useSocialFeed(
    tab: 'explore' | 'following' = 'explore',
    filters: SocialFeedFilters = {},
    limit: number = 20
) {
    return useInfiniteQuery({
        queryKey: ['feed', tab, limit, filters.type, filters.targetUserId],
        queryFn: ({ pageParam }) => getFeed({ tab, page: pageParam, limit, ...filters }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.hasMore ? allPages.length : undefined;
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

/**
 * Hook to check for new items in the background
 */
export function useNewActivityCheck(
    topItemId: number | undefined,
    tab: 'explore' | 'following',
    filters: SocialFeedFilters = {}
) {
    const [hasNewItemsPill, setHasNewItemsPill] = useState(false);
    const [hasDetectedNewItems, setHasDetectedNewItems] = useState(false);

    const { data } = useQuery({
        queryKey: ['feed-check', tab, filters.type, filters.targetUserId],
        queryFn: () => getFeed({ tab, page: 0, limit: 1, ...filters }),
        refetchInterval: 1000 * 30, // Poll every 30 seconds
        enabled: !!topItemId && !hasDetectedNewItems, // Stop polling once new content is detected
    });

    useEffect(() => {
        if (data?.items?.[0] && topItemId) {
            if (data.items[0].id > topItemId) {
                setHasNewItemsPill(true);
                setHasDetectedNewItems(true);
            }
        }
    }, [data, topItemId]);

    return {
        showPill: hasNewItemsPill,
        hasUnreadContent: hasDetectedNewItems,
        hidePill: () => setHasNewItemsPill(false),
        resetCheck: () => {
            setHasNewItemsPill(false);
            setHasDetectedNewItems(false);
        }
    };
}

/**
 * Hook to refresh the feed
 */
export function useFeedRefresh() {
    const queryClient = useQueryClient();

    const refresh = async (tab?: string) => {
        if (tab) {
            await queryClient.invalidateQueries({ queryKey: ['feed', tab] });
        } else {
            await queryClient.invalidateQueries({ queryKey: ['feed'] });
        }
    };

    return refresh;
}
