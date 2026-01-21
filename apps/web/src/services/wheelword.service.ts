import { apiRequest } from './api';

// Types
export interface DailyGame {
    gameNumber: number;
    wordLength: number;
    gameDate: string;
}

export interface GuessFeedback {
    guess: string;
    feedback: string[];
    isCorrect: boolean;
    attemptsUsed: number;
    gameOver: boolean;
    won: boolean;
    correctWord?: string;
}

export interface GameState {
    gameNumber: number;
    wordLength: number;
    gameDate: string;
    attempts: string[];
    feedbacks: string[][];
    gameOver: boolean;
    won: boolean;
    correctWord?: string;
}

export interface WheelwordStats {
    gamesPlayed: number;
    gamesWon: number;
    winPercentage: number;
    currentStreak: number;
    maxStreak: number;
    winDistribution: number[];
}

// API Functions
export async function getTodaysGame(): Promise<DailyGame> {
    return apiRequest<DailyGame>('/wheelword/today');
}

export async function submitGuess(guess: string, sessionAttempts: string[] = []): Promise<GuessFeedback> {
    return apiRequest<GuessFeedback>('/wheelword/guess', {
        method: 'POST',
        body: JSON.stringify({ guess, sessionAttempts }),
    });
}

export async function getUserGameState(): Promise<GameState | null> {
    try {
        return await apiRequest<GameState>('/wheelword/state');
    } catch {
        return null;
    }
}

export async function getUserStats(): Promise<WheelwordStats> {
    return apiRequest<WheelwordStats>('/wheelword/stats');
}

export async function generateShareText(
    gameNumber: number,
    attempts: string[],
    feedbacks: string[][],
    won: boolean
): Promise<{ text: string }> {
    return apiRequest<{ text: string }>('/wheelword/share', {
        method: 'POST',
        body: JSON.stringify({ gameNumber, attempts, feedbacks, won }),
    });
}
