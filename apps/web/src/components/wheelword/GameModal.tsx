import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, BarChart3, Flame, Target, Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WheelwordStats } from '../../services/wheelword.service';
import { useAuth } from '../../contexts/AuthContext';

interface GameModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'win' | 'lose' | 'stats';
    gameNumber?: number;
    correctWord?: string;
    attemptsUsed?: number;
    stats?: WheelwordStats | null;
    isAuthenticated: boolean;
}

export default function GameModal({
    isOpen,
    onClose,
    type,
    gameNumber,
    correctWord,
    attemptsUsed,
    stats,
    isAuthenticated,
}: GameModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-sm bg-dark border border-white/10 rounded-2xl p-6 shadow-2xl"
                >
                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1 text-white/40 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {type === 'win' && (
                        <WinContent
                            gameNumber={gameNumber!}
                            attemptsUsed={attemptsUsed!}
                            stats={stats}
                            isAuthenticated={isAuthenticated}
                            onClose={onClose}
                        />
                    )}

                    {type === 'lose' && (
                        <LoseContent
                            gameNumber={gameNumber!}
                            correctWord={correctWord!}
                            stats={stats}
                            isAuthenticated={isAuthenticated}
                        />
                    )}

                    {type === 'stats' && (
                        <StatsContent stats={stats} isAuthenticated={isAuthenticated} />
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function WinContent({
    gameNumber,
    attemptsUsed,
    stats,
    isAuthenticated,
    onClose,
}: {
    gameNumber: number;
    attemptsUsed: number;
    stats?: WheelwordStats | null;
    isAuthenticated: boolean;
    onClose: () => void;
}) {
    const { user } = useAuth();

    return (
        <div className="text-center space-y-6">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
            >
                <Trophy className="w-16 h-16 mx-auto text-amber-400" />
            </motion.div>

            <div className="space-y-2">
                <h2 className="text-2xl font-mono font-black text-white uppercase">¡Ganaste!</h2>
                <p className="text-white/60 font-mono text-sm">
                    WheelWord #{gameNumber} en {attemptsUsed}/6 intentos
                </p>
            </div>

            {isAuthenticated && stats && <StatsSummary stats={stats} />}

            {!isAuthenticated && (
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl">
                    <p className="text-accent text-sm font-mono">
                        🏎️ Registrate para guardar tus rachas y estadísticas
                    </p>
                </div>
            )}

            {isAuthenticated && user && (
                <Link
                    to={`/collection/${user.username}`}
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-accent hover:bg-accent/80 text-white font-bold rounded-xl transition-colors"
                >
                    <Car className="w-5 h-5" />
                    Ir a mi colección
                </Link>
            )}

            <p className="text-white/40 text-xs font-mono uppercase">
                Volvé mañana para un nuevo desafío
            </p>
        </div>
    );
}

function LoseContent({
    gameNumber,
    correctWord,
    stats,
    isAuthenticated,
}: {
    gameNumber: number;
    correctWord: string;
    stats?: WheelwordStats | null;
    isAuthenticated: boolean;
}) {
    return (
        <div className="text-center space-y-6">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
            >
                <Target className="w-16 h-16 mx-auto text-white/40" />
            </motion.div>

            <div className="space-y-2">
                <h2 className="text-2xl font-mono font-black text-white uppercase">¡Casi!</h2>
                <p className="text-white/60 font-mono text-sm">
                    WheelWord #{gameNumber}
                </p>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-white/40 text-xs font-mono uppercase mb-2">La palabra era</p>
                <p className="text-2xl font-mono font-black text-accent uppercase tracking-wider">
                    {correctWord}
                </p>
            </div>

            {isAuthenticated && stats && <StatsSummary stats={stats} />}

            {!isAuthenticated && (
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl">
                    <p className="text-accent text-sm font-mono">
                        🏎️ Registrate para guardar tus rachas y estadísticas
                    </p>
                </div>
            )}

            <p className="text-white/40 text-xs font-mono uppercase">
                Volvé mañana para un nuevo desafío
            </p>
        </div>
    );
}

function StatsContent({
    stats,
    isAuthenticated,
}: {
    stats?: WheelwordStats | null;
    isAuthenticated: boolean;
}) {
    if (!isAuthenticated) {
        return (
            <div className="text-center space-y-6">
                <BarChart3 className="w-16 h-16 mx-auto text-white/40" />
                <div className="space-y-2">
                    <h2 className="text-xl font-mono font-black text-white uppercase">Estadísticas</h2>
                    <p className="text-white/60 font-mono text-sm">
                        Registrate para ver tus estadísticas
                    </p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-8">
                <p className="text-white/60 font-mono">Cargando...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <BarChart3 className="w-10 h-10 mx-auto text-accent mb-2" />
                <h2 className="text-xl font-mono font-black text-white uppercase">Tus Estadísticas</h2>
            </div>

            <StatsSummary stats={stats} />
            <WinDistributionChart distribution={stats.winDistribution} />
        </div>
    );
}

function StatsSummary({ stats }: { stats: WheelwordStats }) {
    return (
        <div className="grid grid-cols-4 gap-2">
            <StatBox label="Jugadas" value={stats.gamesPlayed} />
            <StatBox label="% Victorias" value={`${stats.winPercentage}%`} />
            <StatBox label="Racha" value={stats.currentStreak} icon={<Flame className="w-3 h-3 text-orange-400" />} />
            <StatBox label="Máx" value={stats.maxStreak} />
        </div>
    );
}

function StatBox({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
    return (
        <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center">
            <div className="flex items-center justify-center gap-1">
                <span className="text-xl font-mono font-black text-white">{value}</span>
                {icon}
            </div>
            <span className="text-[10px] font-mono text-white/40 uppercase">{label}</span>
        </div>
    );
}

function WinDistributionChart({ distribution }: { distribution: number[] }) {
    const maxValue = Math.max(...distribution, 1);

    return (
        <div className="space-y-1.5">
            <p className="text-xs font-mono text-white/40 uppercase mb-2">Distribución de victorias</p>
            {distribution.map((count, index) => (
                <div key={index} className="flex items-center gap-2">
                    <span className="w-4 text-xs font-mono text-white/60">{index + 1}</span>
                    <div className="flex-1 h-5 bg-white/5 rounded overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(count / maxValue) * 100}%` }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            className="h-full bg-accent/80 rounded flex items-center justify-end px-2"
                            style={{ minWidth: count > 0 ? '24px' : '0' }}
                        >
                            {count > 0 && (
                                <span className="text-[10px] font-mono font-bold text-white">{count}</span>
                            )}
                        </motion.div>
                    </div>
                </div>
            ))}
        </div>
    );
}
