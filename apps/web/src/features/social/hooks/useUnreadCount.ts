import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../../../services/api';
import { useEffect, useRef } from 'react';

export function useUnreadCount(intervalMs = 30000) {
    const queryClient = useQueryClient();
    const { data, refetch } = useQuery({
        queryKey: ['notifications', 'unread-count'],
        queryFn: async () => {
            return await apiRequest<{ count: number }>('/social/notifications/unread-count');
        },
        refetchInterval: intervalMs,
        staleTime: 1000 * 60, // 1 minute
    });

    const count = data?.count ?? 0;
    const prevCount = useRef(count);

    useEffect(() => {
        // Si el conteo aumenta, invalidamos las listas para que se refresquen al abrirse
        if (count > prevCount.current) {
            queryClient.invalidateQueries({
                queryKey: ['notifications'],
                exact: false,
                predicate: (query) => query.queryKey[1] !== 'unread-count'
            });
        }
        prevCount.current = count;
    }, [count, queryClient]);

    const refreshCount = () => refetch();

    const resetCount = () => {
        // quedaria en desuso pero por ahora no lo voy a eliminar
    };

    return { count, refreshCount, resetCount };
}
