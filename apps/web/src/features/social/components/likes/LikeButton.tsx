import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useLike } from '../../hooks/useLike';
import { cn } from '../../../../lib/utils';

interface LikeButtonProps {
    id: number;
    initialIsLiked: boolean;
    initialLikesCount: number;
    type: 'car' | 'group';
    className?: string;
    showCount?: boolean;
    onLikeChange?: (isLiked: boolean, newCount: number) => void;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
    id,
    initialIsLiked,
    initialLikesCount,
    type,
    className,
    showCount = true,
    onLikeChange
}) => {
    const { isLiked, likesCount, toggleLike, isLoading } = useLike({
        id,
        initialIsLiked,
        initialLikesCount,
        type,
        onLikeChange
    });

    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleLike();
            }}
            disabled={isLoading}
            className={cn(
                "group/like flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100",
                className
            )}
            title={isLiked ? "Quitar me gusta" : "Me gusta"}
        >
            <div className="relative flex items-center justify-center p-1.5 rounded-full transition-colors group-hover/like:bg-red-500/10 dark:group-hover/like:bg-red-500/20">
                <AnimatePresence mode="wait" initial={false}>
                    {isLiked ? (
                        <motion.div
                            key="liked"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 10
                            }}
                        >
                            <Heart
                                className="w-5 h-5 fill-red-500 text-red-500"
                                strokeWidth={2.5}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="unliked"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                        >
                            <Heart
                                className="w-5 h-5 text-neutral-500 group-hover/like:text-red-500 transition-colors"
                                strokeWidth={2}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {isLiked && !isLoading && (
                    <motion.div
                        className="absolute inset-0 z-[-1]"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {[0, 1, 2, 3, 4].map((i) => (
                            <motion.div
                                key={i}
                                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-red-500 rounded-full"
                                initial={{ x: 0, y: 0, scale: 0 }}
                                animate={{
                                    x: (i - 2) * 20,
                                    y: Math.sin(i) * 20,
                                    scale: [0, 1, 0]
                                }}
                                transition={{ duration: 0.4 }}
                            />
                        ))}
                    </motion.div>
                )}
            </div>

            {showCount && (
                <span className={cn(
                    "text-[11px] font-mono font-bold leading-none transition-colors",
                    isLiked ? "text-red-500" : "text-neutral-500 group-hover/like:text-red-500"
                )}>
                    {likesCount > 0 ? String(likesCount).padStart(2, '0') : ''}
                </span>
            )}
        </button>

    );
};
