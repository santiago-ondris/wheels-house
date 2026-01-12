import { motion } from "framer-motion";
import { User, Calendar, BarChart2, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfileHeroProps {
    username: string;
    firstName: string;
    lastName: string;
    biography?: string;
    picture?: string;
    createdDate?: string;
    totalCars: number;
    totalGroups: number;
    isOwner: boolean;
    onEditClick?: () => void;
}

export default function ProfileHero({
    username,
    firstName,
    lastName,
    biography,
    picture,
    createdDate,
    totalCars,
    totalGroups,
    isOwner,
    onEditClick
}: ProfileHeroProps) {
    const memberSince = createdDate
        ? new Date(createdDate).getFullYear()
        : null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full"
        >
            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-between gap-8 py-10 border-b border-white/5">
                <div className="flex items-center gap-6">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                        {picture ? (
                            <img
                                src={picture}
                                alt={`${firstName} ${lastName}`}
                                className="w-full h-full object-cover transition-all duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-white/[0.02]">
                                <User className="w-10 h-10 text-white/20" />
                            </div>
                        )}
                    </div>

                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-1">
                            {firstName} {lastName}
                        </h1>
                        <p className="text-white/40 font-mono text-sm tracking-widest uppercase flex items-center gap-2">
                            <span className="text-accent">@</span>{username}
                            <div className="flex items-center gap-4 ml-4">
                                {isOwner && (
                                    <button
                                        id="edit-profile-desktop"
                                        onClick={onEditClick}
                                        className="text-[14px] text-accent/60 hover:text-accent font-bold transition-colors border-b border-accent/20 hover:border-accent"
                                    >
                                        EDITAR_PERFIL
                                    </button>
                                )}
                                <Link
                                    to={`/collection/${username}/stats`}
                                    className="flex items-center gap-2 text-[14px] text-emerald-400 font-bold transition-colors border-b border-emerald-400/20 hover:border-emerald-400"
                                >
                                    <BarChart2 size={14} />
                                    VER_ESTADÍSTICAS
                                </Link>
                                <Link
                                    to={`/wishlist/${username}`}
                                    className="flex items-center gap-2 text-[14px] text-amber-400 font-bold transition-colors border-b border-amber-400/20 hover:border-amber-400"
                                >
                                    <Star size={14} />
                                    VER_WISHLIST
                                </Link>
                            </div>
                        </p>
                        {biography && (
                            <p className="mt-4 text-white/60 font-mono text-sm max-w-xl leading-relaxed">
                                {biography}
                            </p>
                        )}
                    </div>
                </div>

                {/* Dashboard Stats */}
                <div className="flex items-center gap-12 font-mono">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-white/20 uppercase tracking-[0.2em] mb-1">Vehículos</span>
                        <span className="text-3xl font-black text-white">{String(totalCars).padStart(3, '0')}</span>
                    </div>

                    <div className="h-10 w-[1px] bg-white/10" />

                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-white/20 uppercase tracking-[0.2em] mb-1">Grupos</span>
                        <span className="text-3xl font-black text-white">{String(totalGroups).padStart(2, '0')}</span>
                    </div>

                    <div className="h-10 w-[1px] bg-white/10" />

                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-white/20 uppercase tracking-[0.2em] mb-1">Registro</span>
                        <div className="flex items-center gap-2 text-white/60">
                            <Calendar size={14} className="opacity-40" />
                            <span className="text-xl font-bold">{memberSince || "----"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Layout (Compact) */}
            <div className="md:hidden flex flex-col gap-4 py-6">
                <div className="flex items-center gap-5">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 overflow-hidden flex-shrink-0">
                        {picture ? (
                            <img
                                src={picture}
                                alt={`${firstName} ${lastName}`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <User className="w-8 h-8 text-white/20" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-baseline gap-2 overflow-hidden">
                            <h1 className="text-lg font-bold text-white truncate">
                                {firstName} {lastName}
                            </h1>
                            <span className="text-white/30 text-xs font-mono truncate lowercase">@{username}</span>
                        </div>

                        <div className="flex items-center gap-3 mt-1.5 font-mono text-[11px] tracking-wider uppercase text-white/50">
                            <span className="flex items-center gap-1.5">
                                <span className="text-white font-bold">{totalCars}</span> AUTOS
                            </span>
                            <span className="text-white/10">|</span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-white font-bold">{totalGroups}</span> GRUPOS
                            </span>
                        </div>

                        <div className="flex items-center gap-4 mt-3">
                            {isOwner && (
                                <button
                                    id="edit-profile-mobile"
                                    onClick={onEditClick}
                                    className="text-[10px] text-accent/60 font-mono tracking-tighter uppercase hover:text-accent transition-colors underline underline-offset-4"
                                >
                                    [ EDITAR_PERFIL ]
                                </button>
                            )}
                            <Link
                                to={`/collection/${username}/stats`}
                                className="text-[10px] text-emerald-400 font-mono tracking-tighter uppercase hover:text-white transition-colors"
                            >
                                [ VER_ESTADÍSTICAS ]
                            </Link>
                            <Link
                                to={`/wishlist/${username}`}
                                className="text-[10px] text-amber-400 font-mono tracking-tighter uppercase hover:text-white transition-colors"
                            >
                                [ WISHLIST ]
                            </Link>
                        </div>
                    </div>
                </div>

                {biography && (
                    <div className="mt-2 text-left">
                        <p className="text-white/60 font-mono text-[11px] leading-relaxed line-clamp-3 italic">
                            {biography}
                        </p>
                    </div>
                )}
            </div>
        </motion.section>
    );
}
