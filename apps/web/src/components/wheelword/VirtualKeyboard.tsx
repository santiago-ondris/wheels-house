import { Delete } from 'lucide-react';

interface VirtualKeyboardProps {
    onKeyPress: (key: string) => void;
    onEnter: () => void;
    onBackspace: () => void;
    letterStates: Record<string, 'correct' | 'present' | 'absent' | undefined>;
    disabled?: boolean;
}

const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK'],
];

export default function VirtualKeyboard({
    onKeyPress,
    onEnter,
    onBackspace,
    letterStates,
    disabled = false,
}: VirtualKeyboardProps) {
    const handleClick = (key: string) => {
        if (disabled) return;

        if (key === 'ENTER') {
            onEnter();
        } else if (key === 'BACK') {
            onBackspace();
        } else {
            onKeyPress(key);
        }
    };

    const getKeyStyle = (key: string) => {
        if (key === 'ENTER' || key === 'BACK') {
            return 'bg-white/20 hover:bg-white/30 text-white';
        }

        const state = letterStates[key];
        switch (state) {
            case 'correct':
                return 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500';
            case 'present':
                return 'bg-amber-500 hover:bg-amber-400 text-white border-amber-400';
            case 'absent':
                return 'bg-white/5 text-white/30 border-white/10';
            default:
                return 'bg-white/10 hover:bg-white/20 text-white border-white/20';
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full max-w-xl mx-auto px-1">
            {KEYBOARD_ROWS.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-1.5 justify-center">
                    {/* Add padding on sides of middle row to center the 10 keys */}
                    {rowIndex === 1 && <div className="w-3 sm:w-4" />}

                    {row.map((key) => {
                        const isSpecial = key === 'ENTER' || key === 'BACK';

                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => handleClick(key)}
                                disabled={disabled}
                                className={`
                                    ${isSpecial
                                        ? 'flex-[1.5] min-w-[48px] sm:min-w-[65px]'
                                        : 'flex-1 min-w-[28px] sm:min-w-[40px] md:min-w-[44px]'
                                    }
                                    h-14 sm:h-14
                                    flex items-center justify-center
                                    ${getKeyStyle(key)}
                                    border rounded-lg
                                    font-mono font-bold text-base sm:text-lg
                                    transition-all duration-150
                                    active:scale-95
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    select-none
                                    touch-manipulation
                                `}
                            >
                                {key === 'BACK' ? (
                                    <Delete className="w-6 h-6" />
                                ) : key === 'ENTER' ? (
                                    <span className="text-xs sm:text-sm font-bold">ENVIAR</span>
                                ) : (
                                    key
                                )}
                            </button>
                        );
                    })}

                    {/* Add padding on sides of middle row to center the 10 keys */}
                    {rowIndex === 1 && <div className="w-3 sm:w-4" />}
                </div>
            ))}
        </div>
    );
}
