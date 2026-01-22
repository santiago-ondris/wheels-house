export class SubmitGuessDTO {
    guess: string;
}

export class DailyGameResponseDTO {
    gameNumber: number;
    wordLength: number;
    gameDate: string;
}

export class GuessFeedbackDTO {
    guess: string;
    feedback: string[];
    isCorrect: boolean;
    attemptsUsed: number;
    gameOver: boolean;
    won: boolean;
    correctWord?: string; // Solo se envía si gameOver es true
    stats?: WheelwordStatsDTO; 
}

export class GameStateDTO {
    gameNumber: number;
    wordLength: number;
    gameDate: string;
    attempts: string[];
    feedbacks: string[][]; // Array de feedbacks por cada intento
    gameOver: boolean;
    won: boolean;
    correctWord?: string; // Solo si gameOver
}

export class WheelwordStatsDTO {
    gamesPlayed: number;
    gamesWon: number;
    winPercentage: number;
    currentStreak: number;
    maxStreak: number;
    winDistribution: number[]; // [wins in 1, wins in 2, ..., wins in 6]
}

export class ShareResultDTO {
    text: string;
}
