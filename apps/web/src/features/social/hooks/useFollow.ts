import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { followUser, unfollowUser } from '../api/followsApi';
import { toast } from 'react-hot-toast';

interface UseFollowProps {
    userId: number;
    initialIsFollowing: boolean;
    onFollowChange?: (isFollowing: boolean) => void;
}

export const useFollow = ({ userId, initialIsFollowing, onFollowChange }: UseFollowProps) => {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const queryClient = useQueryClient();

    const { mutate: performMutation, isPending: isLoading } = useMutation({
        mutationFn: async (shouldFollow: boolean) => {
            if (shouldFollow) {
                await followUser(userId);
            } else {
                await unfollowUser(userId);
            }
        },
        onMutate: async (shouldFollow) => {
            // Optimistic update
            const previousIsFollowing = isFollowing;

            setIsFollowing(shouldFollow);
            onFollowChange?.(shouldFollow);

            return { previousIsFollowing };
        },
        onError: (err: any, _, context) => {
            // Revert on error
            if (context?.previousIsFollowing !== undefined) {
                setIsFollowing(context.previousIsFollowing);
                onFollowChange?.(context.previousIsFollowing);
            }

            // Check for specific throttling error
            if (err?.statusCode === 429 || err?.status === 429 || err?.message?.includes('demasiado rápido')) {
                toast.error('Estás siguiendo gente demasiado rápido. Esperá un momento.');
            } else if (err?.statusCode === 400 || err?.status === 400) {
                toast.error(err.message || 'Error al actualizar el seguimiento');
            } else {
                toast.error('Ocurrió un error. Intenta nuevamente.');
            }
        },
        onSuccess: (_, variables) => {
            const shouldFollow = variables;
            if (shouldFollow) {
                toast.success('¡Ahora seguis a este usuario!');
            } else {
                toast.success('Dejaste de seguir a este usuario');
            }

            // Invalidate queries to refresh data eventually
            queryClient.invalidateQueries({ queryKey: ['followers'] });
            queryClient.invalidateQueries({ queryKey: ['following'] });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
        }
    });

    const toggleFollow = () => {
        const targetState = !isFollowing;
        performMutation(targetState);
    };

    return {
        isFollowing,
        toggleFollow,
        isLoading
    };
};
