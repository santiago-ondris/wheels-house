import { Link } from "react-router-dom";
import { User } from "lucide-react";
import FollowButton from "./FollowButton";
import { FollowUserInfo } from "../api/followsApi";
import { motion } from "framer-motion";
import { getOptimizedUrl } from "../../../lib/cloudinary";

interface UserCardProps {
    user: FollowUserInfo;
    onFollowChange?: (isFollowing: boolean) => void;
}

export default function UserCard({ user, onFollowChange }: UserCardProps) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/10 rounded-[28px] hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 backdrop-blur-md group relative overflow-hidden"
        >
            {/* Ambient Background Glow on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <Link to={`/collection/${user.username}`} className="flex items-center gap-4 group/info min-w-0 relative z-10">
                <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 overflow-hidden flex-shrink-0 group-hover/info:border-accent/50 transition-colors">
                        {user.picture ? (
                            <img
                                src={getOptimizedUrl(user.picture, 'avatar')}
                                alt={user.username}
                                className="w-full h-full object-cover group-hover/info:scale-110 transition-transform duration-500"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                <User size={24} className="text-zinc-600 group-hover/info:text-accent transition-colors" />
                            </div>
                        )}
                    </div>
                    {/* Founder/Admin Badge placeholder if needed */}
                </div>

                <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                        <h3 className="text-white font-black text-sm truncate tracking-tight group-hover/info:text-accent transition-colors">
                            {user.firstName} {user.lastName}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-zinc-500 text-[11px] font-mono truncate tracking-tight">
                            @{user.username}
                        </p>
                    </div>
                </div>
            </Link>

            <div className="relative z-10">
                <FollowButton
                    userId={user.userId}
                    initialIsFollowing={user.isFollowing}
                    size="sm"
                    variant="secondary"
                    className="!rounded-2xl"
                    onFollowChange={onFollowChange}
                />
            </div>
        </motion.div>
    );
}
