import { useState, useEffect } from 'react';
import { apiRequest } from '../../../services/api';

export function useUnreadCount(intervalMs = 30000) {
    const [count, setCount] = useState(0);

    const fetchCount = async () => {
        try {
            const data = await apiRequest<{ count: number }>('/social/notifications/unread-count');
            setCount(data.count);
        } catch (err) {
            console.error('Failed to fetch unread count', err);
        }
    };

    useEffect(() => {
        fetchCount(); 

        const intervalId = setInterval(fetchCount, intervalMs);

        return () => clearInterval(intervalId);
    }, [intervalMs]);

    const refreshCount = fetchCount;

    const resetCount = () => setCount(0);

    return { count, refreshCount, resetCount };
}
