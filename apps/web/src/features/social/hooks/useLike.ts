import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likeCar, unlikeCar, likeGroup, unlikeGroup } from '../api/likesApi';
import { toast } from 'react-hot-toast';

interface UseLikeProps {
    id: number;
    initialIsLiked: boolean;
    initialLikesCount: number;
    type: 'car' | 'group';
    onLikeChange?: (isLiked: boolean, newCount: number) => void;
}

export const useLike = ({ id, initialIsLiked, initialLikesCount, type, onLikeChange }: UseLikeProps) => {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const queryClient = useQueryClient();

    const { mutate: performMutation, isPending: isLoading } = useMutation({
        mutationFn: async (shouldLike: boolean) => {
            if (type === 'car') {
                if (shouldLike) {
                    await likeCar(id);
                } else {
                    await unlikeCar(id);
                }
            } else {
                if (shouldLike) {
                    await likeGroup(id);
                } else {
                    await unlikeGroup(id);
                }
            }
        },
        onMutate: async (shouldLike) => {
            // Optimistic update
            const previousIsLiked = isLiked;
            const previousCount = likesCount;

            const newCount = shouldLike ? previousCount + 1 : Math.max(0, previousCount - 1);

            setIsLiked(shouldLike);
            setLikesCount(newCount);
            onLikeChange?.(shouldLike, newCount);

            return { previousIsLiked, previousCount };
        },
        onError: (err: any, _, context) => {
            // Revert on error
            if (context) {
                setIsLiked(context.previousIsLiked);
                setLikesCount(context.previousCount);
                onLikeChange?.(context.previousIsLiked, context.previousCount);
            }

            // Error handling
            if (err?.statusCode === 429 || err?.status === 429) {
                toast.error('Estás dando likes demasiado rápido. Esperá un momento.');
            } else if (err?.statusCode === 403 || err?.status === 403) {
                toast.error(err.message || 'No puedes dar like a tu propio contenido');
            } else if (err?.statusCode === 400 || err?.status === 400) {
                toast.error(err.message || 'Error al procesar el like');
            } else {
                toast.error('Ocurrió un error. Intenta nuevamente.');
            }
        },
        onSuccess: () => {
            // Invalidate relevant queries
            if (type === 'car') {
                queryClient.invalidateQueries({ queryKey: ['car-likers', id] });
            } else {
                queryClient.invalidateQueries({ queryKey: ['group-likers', id] });
            }
        }
    });

    const toggleLike = () => {
        if (isLoading) return;
        performMutation(!isLiked);
    };

    return {
        isLiked,
        likesCount,
        toggleLike,
        isLoading
    };
};
