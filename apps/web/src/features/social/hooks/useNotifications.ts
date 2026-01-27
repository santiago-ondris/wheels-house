import { useCallback, useMemo } from 'react';
import { Notification } from '../components/notifications/types';
import { apiRequest } from '../../../services/api';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

export function useNotifications(limit = 20) {
    const queryClient = useQueryClient();
    const queryKey = ['notifications', limit];

    const infiniteQuery = useInfiniteQuery({
        queryKey,
        queryFn: async ({ pageParam = 0 }) => {
            return await apiRequest<{ items: Notification[], hasMore: boolean }>(
                `/social/notifications?page=${pageParam}&limit=${limit}`
            );
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.hasMore ? allPages.length : undefined;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const notifications = useMemo(() => {
        return infiniteQuery.data?.pages.flatMap(page => page.items) ?? [];
    }, [infiniteQuery.data]);

    const markAsRead = useCallback(async (notificationId: number) => {
        // Optimistic update
        queryClient.setQueryData(queryKey, (oldData: any) => {
            if (!oldData) return oldData;
            return {
                ...oldData,
                pages: oldData.pages.map((page: any) => ({
                    ...page,
                    items: page.items.map((n: Notification) =>
                        n.notificationId === notificationId ? { ...n, read: true } : n
                    )
                }))
            };
        });

        // Update unread count cache
        queryClient.setQueryData(['notifications-unread-count'], (old: any) => {
            if (typeof old?.count === 'number') {
                return { count: Math.max(0, old.count - 1) };
            }
            return old;
        });

        try {
            await apiRequest(`/social/notifications/${notificationId}/read`, { method: 'PUT' });
        } catch (err) {
            console.error('Failed to mark notification as read', err);
            queryClient.invalidateQueries({ queryKey });
        }
    }, [queryClient, queryKey]);

    const markAllAsRead = useCallback(async () => {
        // Optimistic update
        queryClient.setQueryData(queryKey, (oldData: any) => {
            if (!oldData) return oldData;
            return {
                ...oldData,
                pages: oldData.pages.map((page: any) => ({
                    ...page,
                    items: page.items.map((n: Notification) => ({ ...n, read: true }))
                }))
            };
        });

        // Reset unread count
        queryClient.setQueryData(['notifications-unread-count'], { count: 0 });

        try {
            await apiRequest('/social/notifications/read-all', { method: 'PUT' });
        } catch (err) {
            console.error('Failed to mark all as read', err);
            queryClient.invalidateQueries({ queryKey });
        }
    }, [queryClient, queryKey]);

    const deleteNotification = useCallback(async (notificationId: number) => {
        // Optimistic update
        queryClient.setQueryData(queryKey, (oldData: any) => {
            if (!oldData) return oldData;
            return {
                ...oldData,
                pages: oldData.pages.map((page: any) => ({
                    ...page,
                    items: page.items.filter((n: Notification) => n.notificationId !== notificationId)
                }))
            };
        });

        try {
            await apiRequest(`/social/notifications/${notificationId}`, { method: 'DELETE' });
        } catch (err) {
            console.error('Failed to delete notification', err);
            queryClient.invalidateQueries({ queryKey });
        }
    }, [queryClient, queryKey]);

    return {
        notifications,
        isLoading: infiniteQuery.isLoading,
        isFetchingNextPage: infiniteQuery.isFetchingNextPage,
        hasNextPage: infiniteQuery.hasNextPage,
        fetchNextPage: infiniteQuery.fetchNextPage,
        error: infiniteQuery.error,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refetch: infiniteQuery.refetch
    };
}
