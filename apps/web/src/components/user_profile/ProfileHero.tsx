import { motion } from "framer-motion";
import { User, Calendar } from "lucide-react";

interface ProfileHeroProps {
    username: string;
    firstName: string;
    lastName: string;
    picture?: string;
    createdDate?: string;
    totalCars: number;
    totalGroups: number;
    isOwner: boolean;
}

export default function ProfileHero({
    username,
    firstName,
    lastName,
    picture,
    createdDate,
    totalCars,
    totalGroups,
    isOwner
}: ProfileHeroProps) {
    const memberSince = createdDate
        ? new Date(createdDate).getFullYear()
        : null;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8"
        >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/10 border-2 border-accent/50 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {picture ? (
                        <img
                            src={picture}
                            alt={`${firstName} ${lastName}`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <User className="w-12 h-12 md:w-16 md:h-16 text-white/40" />
                    )}
                </div>

                {/* User info */}
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                        {firstName} {lastName}
                    </h1>
                    <p className="text-accent text-sm mt-1">@{username}</p>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-white/70 text-sm">
                        <span className="flex items-center gap-1">
                            <span className="font-bold text-white">{totalCars}</span> autos
                        </span>
                        <span className="text-white/30">•</span>
                        <span className="flex items-center gap-1">
                            <span className="font-bold text-white">{totalGroups}</span> grupos
                        </span>
                        {memberSince && (
                            <>
                                <span className="text-white/30">•</span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Coleccionista desde {memberSince}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Owner actions */}
                    {isOwner && (
                        <div className="mt-4">
                            <button
                                disabled
                                className="px-4 py-2 text-sm bg-white/10 text-white/50 rounded-lg cursor-not-allowed"
                            >
                                Editar Perfil (próximamente)
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.section>
    );
}
