import { useInfiniteQuery } from '@tanstack/react-query';
import { getFeed } from '../services/social.service';

export interface SocialFeedFilters {
    type?: string;
    targetUserId?: number;
}

/**
 * Hook to manage the social feed with infinite scrolling
 * @param tab 'explore' (global) or 'following' (users being followed)
 * @param filters search and type filters
 * @param limit number of items per page
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
 * Hook to refresh the feed
 * (Currently simple wrapper, but can be expanded later)
 */
export function useFeedRefresh() {
    // This could return a function that invalidates the feed query
    // const queryClient = useQueryClient();
    // return () => queryClient.invalidateQueries({ queryKey: ['feed'] });
}
