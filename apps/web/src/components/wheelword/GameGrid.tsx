import { motion } from 'framer-motion';

interface GameGridProps {
    attempts: string[];
    feedbacks: string[][];
    currentGuess: string;
    wordLength: number;
    maxAttempts?: number;
    gameOver: boolean;
}

export default function GameGrid({
    attempts,
    feedbacks,
    currentGuess,
    wordLength,
    maxAttempts = 6,
    gameOver,
}: GameGridProps) {
    const rows = [];

    // Filas completadas con feedback
    for (let i = 0; i < attempts.length; i++) {
        rows.push(
            <CompletedRow
                key={`completed-${i}`}
                word={attempts[i]}
                feedback={feedbacks[i]}
                wordLength={wordLength}
            />
        );
    }

    // Fila actual (si el juego no terminó)
    if (!gameOver && attempts.length < maxAttempts) {
        rows.push(
            <CurrentRow
                key="current"
                currentGuess={currentGuess}
                wordLength={wordLength}
            />
        );
    }

    // Filas vacías restantes
    const emptyRowsCount = maxAttempts - attempts.length - (gameOver ? 0 : 1);
    for (let i = 0; i < emptyRowsCount; i++) {
        rows.push(
            <EmptyRow key={`empty-${i}`} wordLength={wordLength} />
        );
    }

    return (
        <div className="flex flex-col gap-1.5 sm:gap-2 w-full max-w-md mx-auto px-2">
            {rows}
        </div>
    );
}

interface CompletedRowProps {
    word: string;
    feedback: string[];
    wordLength: number;
}

function CompletedRow({ word, feedback, wordLength }: CompletedRowProps) {
    const letters = word.split('');

    return (
        <div className="flex gap-1.5 sm:gap-2 justify-center">
            {Array.from({ length: wordLength }).map((_, i) => {
                const letter = letters[i] || '';
                const fb = feedback[i] || '⬜';
                const bgColor = fb === '🟩' ? 'bg-emerald-600' : fb === '🟨' ? 'bg-amber-500' : 'bg-white/10';
                const borderColor = fb === '🟩' ? 'border-emerald-500' : fb === '🟨' ? 'border-amber-400' : 'border-white/20';

                return (
                    <motion.div
                        key={i}
                        initial={{ rotateX: 0 }}
                        animate={{ rotateX: [0, 90, 0] }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                        className={`
                            w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
                            flex items-center justify-center
                            ${bgColor} ${borderColor}
                            border-2 rounded-lg
                            text-white font-mono font-black text-lg sm:text-xl md:text-2xl uppercase
                            shadow-lg
                        `}
                    >
                        {letter}
                    </motion.div>
                );
            })}
        </div>
    );
}

interface CurrentRowProps {
    currentGuess: string;
    wordLength: number;
}

function CurrentRow({ currentGuess, wordLength }: CurrentRowProps) {
    const letters = currentGuess.split('');

    return (
        <div className="flex gap-1.5 sm:gap-2 justify-center">
            {Array.from({ length: wordLength }).map((_, i) => {
                const letter = letters[i] || '';
                const hasLetter = letter !== '';

                return (
                    <motion.div
                        key={i}
                        initial={false}
                        animate={hasLetter ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                        transition={{ duration: 0.1 }}
                        className={`
                            w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
                            flex items-center justify-center
                            bg-white/5 
                            border-2 ${hasLetter ? 'border-accent' : 'border-white/20'}
                            rounded-lg
                            text-white font-mono font-black text-lg sm:text-xl md:text-2xl uppercase
                            transition-colors
                        `}
                    >
                        {letter}
                    </motion.div>
                );
            })}
        </div>
    );
}

interface EmptyRowProps {
    wordLength: number;
}

function EmptyRow({ wordLength }: EmptyRowProps) {
    return (
        <div className="flex gap-1.5 sm:gap-2 justify-center">
            {Array.from({ length: wordLength }).map((_, i) => (
                <div
                    key={i}
                    className="
                        w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
                        flex items-center justify-center
                        bg-white/5 border-2 border-white/10
                        rounded-lg
                    "
                />
            ))}
        </div>
    );
}
