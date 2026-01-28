import { useFollow } from "../hooks/useFollow";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

interface FollowButtonProps {
    userId: number;
    initialIsFollowing?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'secondary' | 'ghost';
    className?: string;
    onFollowChange?: (isFollowing: boolean) => void;
}

export default function FollowButton({
    userId,
    initialIsFollowing = false,
    size = 'md',
    variant = 'primary',
    className = "",
    onFollowChange
}: FollowButtonProps) {
    const { user, isAuthenticated, openLoginModal } = useAuth();

    const isSelf = user?.userId === userId;

    const { isFollowing, toggleFollow, isLoading } = useFollow({
        userId,
        initialIsFollowing,
        onFollowChange
    });

    if (isSelf) return null;

    const getSizeClasses = () => {
        switch (size) {
            case 'sm': return "px-3 py-1 text-xs gap-1.5";
            case 'lg': return "px-6 py-3 text-base gap-2.5";
            default: return "px-4 py-2 text-sm gap-2";
        }
    };

    const getVariantClasses = () => {
        if (isFollowing) {
            return "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5 hover:border-white/10 backdrop-blur-sm";
        }

        switch (variant) {
            case 'secondary': return "bg-accent hover:bg-accent/90 text-black font-black";
            case 'ghost': return "bg-transparent hover:bg-white/10 text-white border border-white/10";
            default: return "bg-accent hover:bg-accent/90 text-black font-black shadow-lg shadow-accent/20";
        }
    };

    return (
        <button
            onClick={() => {
                if (!isAuthenticated) {
                    openLoginModal('para seguir a este usuario');
                    return;
                }
                toggleFollow();
            }}
            disabled={isLoading}
            className={`
                flex items-center justify-center rounded-full transition-all duration-300
                active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed
                ${getSizeClasses()}
                ${getVariantClasses()}
                ${className}
            `}
        >
            {isLoading ? (
                <Loader2 size={size === 'sm' ? 12 : 16} className="animate-spin" />
            ) : isFollowing ? (
                <UserCheck size={size === 'sm' ? 14 : 18} />
            ) : (
                <UserPlus size={size === 'sm' ? 14 : 18} />
            )}

            <span>
                {isFollowing ? "Siguiendo" : "Seguir"}
            </span>
        </button>
    );
}
