import { useState, useCallback } from 'react';
import { Notification } from '../components/notifications/types';
import { apiRequest } from '../../../services/api';

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchNotifications = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await apiRequest<Notification[]>('/social/notifications');
            setNotifications(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const markAsRead = useCallback(async (notificationId: number) => {
        setNotifications(prev => prev.map(n =>
            n.notificationId === notificationId ? { ...n, read: true } : n
        ));

        try {
            await apiRequest(`/social/notifications/${notificationId}/read`, { method: 'PUT' });
        } catch (err) {
            console.error('Failed to mark notification as read', err);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));

        try {
            await apiRequest('/social/notifications/read-all', { method: 'PUT' });
        } catch (err) {
            console.error('Failed to mark all as read', err);
        }
    }, []);

    const deleteNotification = useCallback(async (notificationId: number) => {
        setNotifications(prev => prev.filter(n => n.notificationId !== notificationId));

        try {
            await apiRequest(`/social/notifications/${notificationId}`, { method: 'DELETE' });
        } catch (err) {
            console.error('Failed to delete notification', err);
        }
    }, []);

    return {
        notifications,
        isLoading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification
    };
}
