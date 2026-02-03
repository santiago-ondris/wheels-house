import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, BarChart3, HelpCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import GameGrid from '../../components/wheelword/GameGrid';
import VirtualKeyboard from '../../components/wheelword/VirtualKeyboard';
import GameModal from '../../components/wheelword/GameModal';
import {
    getTodaysGame,
    submitGuess,
    getUserGameState,
    getUserStats,
    DailyGame,
    WheelwordStats,
} from '../../services/wheelword.service';

export default function WheelWordPage() {
    const { isAuthenticated } = useAuth();

    // Game state
    const [game, setGame] = useState<DailyGame | null>(null);
    const [attempts, setAttempts] = useState<string[]>([]);
    const [feedbacks, setFeedbacks] = useState<string[][]>([]);
    const [currentGuess, setCurrentGuess] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [, setWon] = useState(false);
    const [correctWord, setCorrectWord] = useState<string | undefined>();

    // UI state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [stats, setStats] = useState<WheelwordStats | null>(null);
    const [shakeRow, setShakeRow] = useState(false);

    // Modal state
    const [modalType, setModalType] = useState<'win' | 'lose' | 'stats' | null>(null);

    // Letter states for keyboard coloring
    const [letterStates, setLetterStates] = useState<Record<string, 'correct' | 'present' | 'absent'>>({});

    // Load game on mount
    useEffect(() => {
        loadGame();
    }, [isAuthenticated]);

    // Keyboard listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameOver || submitting || modalType) return;

            if (e.key === 'Enter') {
                handleSubmit();
            } else if (e.key === 'Backspace') {
                handleBackspace();
            } else if (/^[a-zA-ZñÑ]$/.test(e.key)) {
                handleKeyPress(e.key.toUpperCase());
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentGuess, game, gameOver, submitting, modalType]);

    const loadGame = async () => {
        try {
            setLoading(true);
            setError(null);

            // Cargar juego del día
            const todaysGame = await getTodaysGame();
            setGame(todaysGame);

            // Si está autenticado, cargar estado previo
            if (isAuthenticated) {
                const state = await getUserGameState();
                if (state) {
                    setAttempts(state.attempts);
                    setFeedbacks(state.feedbacks);
                    setGameOver(state.gameOver);
                    setWon(state.won);
                    setCorrectWord(state.correctWord);
                    updateLetterStates(state.attempts, state.feedbacks);

                    // Si ya terminó, cargar stats y mostrar modal
                    if (state.gameOver) {
                        const userStats = await getUserStats();
                        setStats(userStats);
                        setModalType(state.won ? 'win' : 'lose');
                    }
                }
            }
        } catch (err: any) {
            console.error('🎮 Error cargando juego:', err);
            setError(err.message || 'Error cargando el juego');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = useCallback((key: string) => {
        if (!game || gameOver || submitting) return;
        if (currentGuess.length < game.wordLength) {
            setCurrentGuess(prev => prev + key);
        }
    }, [game, gameOver, submitting, currentGuess]);

    const handleBackspace = useCallback(() => {
        setCurrentGuess(prev => prev.slice(0, -1));
    }, []);

    // Clear error after timeout
    useEffect(() => {
        if (error || shakeRow) {
            const timer = setTimeout(() => {
                setError(null);
                setShakeRow(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [error, shakeRow]);

    const handleSubmit = useCallback(async () => {
        if (!game || gameOver || submitting) return;

        setError(null);
        setShakeRow(false);

        if (currentGuess.length !== game.wordLength) {
            setShakeRow(true);
            return;
        }

        // Validación local de duplicados
        if (attempts.includes(currentGuess)) {
            setShakeRow(true);
            setError('Ya intentaste esta palabra');
            setCurrentGuess(''); // Limpiar para que pueda escribir de nuevo
            return;
        }

        try {
            setSubmitting(true);

            const result = await submitGuess(currentGuess, attempts);

            // Actualizar estado
            const newAttempts = [...attempts, result.guess];
            const newFeedbacks = [...feedbacks, result.feedback];

            setAttempts(newAttempts);
            setFeedbacks(newFeedbacks);
            setCurrentGuess('');
            setGameOver(result.gameOver);
            setWon(result.won);
            setCorrectWord(result.correctWord);

            // Actualizar colores del teclado
            updateLetterStates(newAttempts, newFeedbacks);

            // Si terminó el juego
            if (result.gameOver) {
                // Usar stats de la respuesta (ya actualizados por el backend)
                if (result.stats) {
                    setStats(result.stats);
                } else if (isAuthenticated) {
                    // Fallback: cargar stats si no vinieron en respuesta
                    const userStats = await getUserStats();
                    setStats(userStats);
                }
                // Mostrar modal después de un delay para ver la última animación
                setTimeout(() => {
                    setModalType(result.won ? 'win' : 'lose');
                }, 1500);
            }
        } catch (err: any) {
            // Error de la API (ej: palabra inválida)
            setShakeRow(true);
            setError(err.message || 'Error al enviar');
        } finally {
            setSubmitting(false);
        }
    }, [game, currentGuess, attempts, feedbacks, gameOver, submitting, isAuthenticated]);

    const updateLetterStates = (attemptsList: string[], feedbacksList: string[][]) => {
        const states: Record<string, 'correct' | 'present' | 'absent'> = {};

        attemptsList.forEach((attempt, i) => {
            const feedback = feedbacksList[i];
            attempt.split('').forEach((letter, j) => {
                const fb = feedback[j];
                const currentState = states[letter];

                // Prioridad: correct > present > absent
                if (fb === '🟩') {
                    states[letter] = 'correct';
                } else if (fb === '🟨' && currentState !== 'correct') {
                    states[letter] = 'present';
                } else if (fb === '⬜' && !currentState) {
                    states[letter] = 'absent';
                }
            });
        });

        setLetterStates(states);
    };

    const handleShowStats = async () => {
        if (isAuthenticated && !stats) {
            const userStats = await getUserStats();
            setStats(userStats);
        }
        setModalType('stats');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Gamepad2 className="w-12 h-12 mx-auto text-accent animate-pulse" />
                    <p className="text-white/60 font-mono">Cargando juego...</p>
                </div>
            </div>
        );
    }

    if (error && !game) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-center space-y-4 max-w-sm">
                    <p className="text-danger font-mono">{error}</p>
                    <button
                        type="button"
                        onClick={loadGame}
                        className="px-6 py-2 bg-accent hover:bg-accent/80 text-white font-bold rounded-lg transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-white py-4 px-2 sm:px-4">
            <div className="max-w-lg mx-auto space-y-4 sm:space-y-6">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-2"
                >
                    <div className="flex items-center justify-center gap-2">
                        <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                        <h1 className="text-2xl sm:text-3xl font-mono font-black uppercase tracking-tight">
                            Wheel<span className="text-accent">Word</span>
                        </h1>
                    </div>
                    <div className="flex items-center justify-center gap-4 text-xs sm:text-sm font-mono text-white/60">
                        <span>#{game?.gameNumber}</span>
                        <span>•</span>
                        <span>{game?.wordLength} letras</span>
                        {isAuthenticated && (
                            <button
                                type="button"
                                onClick={handleShowStats}
                                className="flex items-center gap-1 hover:text-accent transition-colors"
                            >
                                <BarChart3 className="w-4 h-4" />
                                <span className="hidden sm:inline">Stats</span>
                            </button>
                        )}
                    </div>
                </motion.header>

                <div className="relative">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-4 left-1/2 -translate-x-1/2 z-50
                                       px-4 py-2 bg-white text-black font-bold text-sm
                                       rounded-md shadow-lg"
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="py-2 sm:py-4"
                    >
                        <GameGrid
                            attempts={attempts}
                            feedbacks={feedbacks}
                            currentGuess={currentGuess}
                            wordLength={game?.wordLength || 5}
                            gameOver={gameOver}
                            shake={shakeRow}
                        />
                    </motion.div>
                </div>

                {/* Virtual Keyboard */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="pt-2 sm:pt-4"
                >
                    <VirtualKeyboard
                        onKeyPress={handleKeyPress}
                        onEnter={handleSubmit}
                        onBackspace={handleBackspace}
                        letterStates={letterStates}
                        disabled={gameOver || submitting}
                    />
                </motion.div>

                {/* How to play hint */}
                {!gameOver && attempts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center pt-4"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                            <HelpCircle className="w-4 h-4 text-white/40" />
                            <span className="text-xs font-mono text-white/40">
                                Adiviná la palabra automotriz del día
                            </span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Game Modal */}
            <GameModal
                isOpen={modalType !== null}
                onClose={() => setModalType(null)}
                type={modalType || 'stats'}
                gameNumber={game?.gameNumber}
                correctWord={correctWord}
                attemptsUsed={attempts.length}
                stats={stats}
                isAuthenticated={isAuthenticated}
            />
        </div>
    );
}
