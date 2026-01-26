import { useInfiniteQuery } from "@tanstack/react-query";
import { getFollowers, getFollowing } from "../api/followsApi";

export const useFollowersList = (userId: number) => {
    return useInfiniteQuery({
        queryKey: ['followers', userId],
        queryFn: async ({ pageParam = 0 }) => {
            return await getFollowers(userId, pageParam as number);
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 20 ? allPages.length : undefined;
        },
        enabled: !!userId,
    });
};

export const useFollowingList = (userId: number) => {
    return useInfiniteQuery({
        queryKey: ['following', userId],
        queryFn: async ({ pageParam = 0 }) => {
            return await getFollowing(userId, pageParam as number);
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 20 ? allPages.length : undefined;
        },
        enabled: !!userId,
    });
};
