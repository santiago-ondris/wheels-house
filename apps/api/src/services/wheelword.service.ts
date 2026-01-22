import { Injectable, OnModuleInit, BadRequestException, NotFoundException } from '@nestjs/common';
import { db } from '../database';
import { user, gameWord, dailyGame, userGameAttempt } from '../database/schema';
import { eq, and, desc, isNull, or, sql, asc } from 'drizzle-orm';
import {
    DailyGameResponseDTO,
    GuessFeedbackDTO,
    GameStateDTO,
    WheelwordStatsDTO
} from '../dto/wheelword.dto';
import { GAME_WORDS } from '../data/gameWords';

// Constantes del juego
const MAX_ATTEMPTS = 6;
const MIN_WORD_LENGTH = 4;
const MAX_WORD_LENGTH = 11;
const WORDS_COOLDOWN = 70; // No repetir palabra en últimos 70 juegos

@Injectable()
export class WheelwordService implements OnModuleInit {
    private gameWordsLoaded: boolean = false;

    async onModuleInit() {
        await this.ensureGameWordsSeeded();
    }

    /**
     * Verifica que hay palabras en la DB, si no las carga del seed
     */
    private async ensureGameWordsSeeded() {
        try {
            const dbWords = await db.select({ word: gameWord.word }).from(gameWord);

            if (dbWords.length === 0) {
                // Auto-seed si la tabla está vacía
                console.log('🌱 WheelWord: Seeding palabras automáticamente...');
                for (const wordData of GAME_WORDS) {
                    try {
                        await db.insert(gameWord).values({
                            word: wordData.word.toUpperCase(),
                            category: wordData.category,
                            timesUsed: 0,
                        });
                    } catch (e) {
                        // Ignorar duplicados
                    }
                }
                console.log(`✅ WheelWord: ${GAME_WORDS.length} palabras insertadas`);
            }

            this.gameWordsLoaded = true;
            console.log(`🎮 WheelWord: Listo (${dbWords.length || GAME_WORDS.length} palabras en DB)`);
        } catch (error) {
            console.error('Error initializing WheelWord:', error);
        }
    }

    /**
     * Obtiene el juego del día actual. Si no existe, lo genera on-demand.
     */
    async getTodaysGame(): Promise<DailyGameResponseDTO> {
        const todayUTC = this.getUTCDateString();

        // Buscar juego de hoy
        let game = await db.select({
            dailyGameId: dailyGame.dailyGameId,
            gameNumber: dailyGame.gameNumber,
            gameDate: dailyGame.gameDate,
            word: gameWord.word,
        })
            .from(dailyGame)
            .innerJoin(gameWord, eq(dailyGame.gameWordId, gameWord.gameWordId))
            .where(eq(dailyGame.gameDate, todayUTC))
            .limit(1);

        if (game.length === 0) {
            // No existe juego de hoy, generarlo on-demand
            await this.generateDailyGame();
            game = await db.select({
                dailyGameId: dailyGame.dailyGameId,
                gameNumber: dailyGame.gameNumber,
                gameDate: dailyGame.gameDate,
                word: gameWord.word,
            })
                .from(dailyGame)
                .innerJoin(gameWord, eq(dailyGame.gameWordId, gameWord.gameWordId))
                .where(eq(dailyGame.gameDate, todayUTC))
                .limit(1);
        }

        if (game.length === 0) {
            throw new NotFoundException('No se pudo obtener el juego del día');
        }

        return {
            gameNumber: game[0].gameNumber,
            wordLength: game[0].word.length,
            gameDate: game[0].gameDate,
        };
    }

    /**
     * Genera un nuevo juego diario seleccionando una palabra que no haya sido usada recientemente
     */
    async generateDailyGame(): Promise<void> {
        const todayUTC = this.getUTCDateString();

        // Verificar que no exista ya un juego para hoy
        const existingGame = await db.select().from(dailyGame).where(eq(dailyGame.gameDate, todayUTC)).limit(1);
        if (existingGame.length > 0) {
            return; // Ya existe
        }

        // Obtener el número del siguiente juego
        const lastGame = await db.select({ gameNumber: dailyGame.gameNumber })
            .from(dailyGame)
            .orderBy(desc(dailyGame.gameNumber))
            .limit(1);
        const nextGameNumber = lastGame.length > 0 ? lastGame[0].gameNumber + 1 : 1;

        // Seleccionar palabra: menor timesUsed, no usada en últimos 70 juegos, longitud 4-11
        const candidates = await db.select({
            gameWordId: gameWord.gameWordId,
            word: gameWord.word,
            timesUsed: gameWord.timesUsed,
            lastUsedAt: gameWord.lastUsedAt,
        })
            .from(gameWord)
            .where(
                and(
                    sql`LENGTH(${gameWord.word}) >= ${MIN_WORD_LENGTH}`,
                    sql`LENGTH(${gameWord.word}) <= ${MAX_WORD_LENGTH}`
                )
            )
            .orderBy(asc(gameWord.timesUsed), asc(gameWord.lastUsedAt))
            .limit(50);

        if (candidates.length === 0) {
            throw new Error('No hay palabras disponibles para el juego');
        }

        // Obtener IDs de palabras usadas en últimos 70 juegos
        const recentGames = await db.select({ gameWordId: dailyGame.gameWordId })
            .from(dailyGame)
            .orderBy(desc(dailyGame.gameNumber))
            .limit(WORDS_COOLDOWN);
        const recentWordIds = new Set(recentGames.map(g => g.gameWordId));

        // Filtrar palabras no usadas recientemente
        const eligibleWords = candidates.filter(c => !recentWordIds.has(c.gameWordId));

        // Si hay palabras elegibles, seleccionar aleatoriamente entre las de menor uso
        let selectedWord;
        if (eligibleWords.length > 0) {
            // Encontrar el mínimo timesUsed entre las elegibles
            const minUsed = Math.min(...eligibleWords.map(w => w.timesUsed || 0));
            // Filtrar solo las que tienen ese mínimo
            const leastUsed = eligibleWords.filter(w => (w.timesUsed || 0) === minUsed);
            // Seleccionar aleatoriamente
            selectedWord = leastUsed[Math.floor(Math.random() * leastUsed.length)];
        } else {
            // Si todas fueron usadas recientemente, seleccionar aleatoriamente entre las de menor uso
            const minUsed = Math.min(...candidates.map(w => w.timesUsed || 0));
            const leastUsed = candidates.filter(w => (w.timesUsed || 0) === minUsed);
            selectedWord = leastUsed[Math.floor(Math.random() * leastUsed.length)];
        }

        // Crear juego
        await db.insert(dailyGame).values({
            gameNumber: nextGameNumber,
            gameWordId: selectedWord.gameWordId,
            gameDate: todayUTC,
        });

        // Actualizar timesUsed y lastUsedAt
        await db.update(gameWord)
            .set({
                timesUsed: (selectedWord.timesUsed || 0) + 1,
                lastUsedAt: new Date(),
            })
            .where(eq(gameWord.gameWordId, selectedWord.gameWordId));

        console.log(`🎮 WheelWord #${nextGameNumber} generado: ${selectedWord.word.length} letras`);
    }

    /**
     * Procesa un intento del usuario
     */
    async submitGuess(
        guess: string,
        userId: number | null,
        sessionAttempts: string[] = []
    ): Promise<GuessFeedbackDTO> {
        const normalizedGuess = guess.toUpperCase().trim();

        // Validar longitud y caracteres
        if (!/^[A-ZÑ]+$/.test(normalizedGuess)) {
            throw new BadRequestException('La palabra solo puede contener letras');
        }

        // Obtener juego de hoy con la palabra
        const todayUTC = this.getUTCDateString();
        const game = await db.select({
            dailyGameId: dailyGame.dailyGameId,
            gameNumber: dailyGame.gameNumber,
            word: gameWord.word,
        })
            .from(dailyGame)
            .innerJoin(gameWord, eq(dailyGame.gameWordId, gameWord.gameWordId))
            .where(eq(dailyGame.gameDate, todayUTC))
            .limit(1);

        if (game.length === 0) {
            throw new NotFoundException('No hay juego disponible para hoy');
        }

        const correctWord = game[0].word.toUpperCase();
        const dailyGameId = game[0].dailyGameId;

        // Validar longitud del intento (ya no validamos diccionario - cualquier palabra vale)
        if (normalizedGuess.length !== correctWord.length) {
            throw new BadRequestException(`La palabra debe tener ${correctWord.length} letras`);
        }

        // Para usuarios registrados, verificar si ya jugaron o cargar intentos previos
        let previousAttempts: string[] = sessionAttempts;
        let existingAttempt: any = null;

        if (userId) {
            existingAttempt = await db.select()
                .from(userGameAttempt)
                .where(and(
                    eq(userGameAttempt.userId, userId),
                    eq(userGameAttempt.dailyGameId, dailyGameId)
                ))
                .limit(1);

            if (existingAttempt.length > 0) {
                const att = existingAttempt[0];
                const attemptsList = att.attempts || [];
                const isGameOver = att.won === true || attemptsList.length >= MAX_ATTEMPTS;

                if (isGameOver) {
                    // Ya terminó el juego - no puede jugar más
                    return {
                        guess: normalizedGuess,
                        feedback: [],
                        isCorrect: false,
                        attemptsUsed: att.attemptsCount,
                        gameOver: true,
                        won: att.won,
                        correctWord: correctWord,
                    };
                }

                previousAttempts = attemptsList;
            }
        }

        // Verificar si ya intentó esta palabra
        if (previousAttempts.includes(normalizedGuess)) {
            throw new BadRequestException('Ya intentaste esta palabra');
        }

        // Verificar límite de intentos
        if (previousAttempts.length >= MAX_ATTEMPTS) {
            throw new BadRequestException('Ya usaste todos tus intentos');
        }

        // Generar feedback
        const feedback = this.generateFeedback(normalizedGuess, correctWord);
        const isCorrect = normalizedGuess === correctWord;
        const newAttempts = [...previousAttempts, normalizedGuess];
        const gameOver = isCorrect || newAttempts.length >= MAX_ATTEMPTS;

        // Guardar para usuarios registrados
        if (userId) {
            try {
                if (existingAttempt && existingAttempt.length > 0) {
                    // Actualizar intento existente
                    console.log('🔄 Actualizando intento existente:', {
                        attemptId: existingAttempt[0].userGameAttemptId,
                        newAttempts,
                        isCorrect,
                        gameOver
                    });
                    await db.update(userGameAttempt)
                        .set({
                            attempts: newAttempts,
                            attemptsCount: newAttempts.length,
                            won: isCorrect,
                            completedAt: gameOver ? new Date() : null,
                        })
                        .where(eq(userGameAttempt.userGameAttemptId, existingAttempt[0].userGameAttemptId));
                    console.log('✅ Intento actualizado correctamente');
                } else {
                    // Crear nuevo intento
                    console.log('➕ Creando nuevo intento:', {
                        userId,
                        dailyGameId,
                        newAttempts,
                        isCorrect,
                        gameOver
                    });
                    await db.insert(userGameAttempt).values({
                        userId,
                        dailyGameId,
                        attempts: newAttempts,
                        attemptsCount: newAttempts.length,
                        won: isCorrect,
                        completedAt: gameOver ? new Date() : null,
                    });
                    console.log('✅ Intento creado correctamente');
                }
            } catch (dbError) {
                console.error('❌ Error guardando intento en DB:', dbError);
            }

            // Si terminó el juego, actualizar stats del usuario
            if (gameOver) {
                await this.updateUserStats(userId, isCorrect, newAttempts.length);
            }
        }

        // Si terminó el juego y hay usuario, obtener stats actualizados para incluir en respuesta
        let updatedStats: WheelwordStatsDTO | undefined = undefined;
        if (gameOver && userId) {
            updatedStats = await this.getUserStats(userId);
        }

        return {
            guess: normalizedGuess,
            feedback,
            isCorrect,
            attemptsUsed: newAttempts.length,
            gameOver,
            won: isCorrect,
            correctWord: gameOver ? correctWord : undefined,
            stats: updatedStats,
        };
    }

    /**
     * Genera el feedback de colores para un intento
     */
    private generateFeedback(guess: string, answer: string): string[] {
        const feedback: string[] = Array(guess.length).fill('⬜');
        const answerChars = answer.split('');
        const guessChars = guess.split('');

        // Primera pasada: marcar correctas (🟩)
        for (let i = 0; i < guess.length; i++) {
            if (guessChars[i] === answerChars[i]) {
                feedback[i] = '🟩';
                answerChars[i] = null as any;
                guessChars[i] = null as any;
            }
        }

        // Segunda pasada: marcar presentes (🟨)
        for (let i = 0; i < guess.length; i++) {
            if (guessChars[i] !== null) {
                const idx = answerChars.indexOf(guessChars[i]);
                if (idx !== -1) {
                    feedback[i] = '🟨';
                    answerChars[idx] = null as any;
                }
            }
        }

        return feedback;
    }

    /**
     * Actualiza las estadísticas del usuario después de completar un juego
     */
    private async updateUserStats(userId: number, won: boolean, attemptsCount: number): Promise<void> {
        const userData = await db.select({
            gamesPlayed: user.wheelwordGamesPlayed,
            gamesWon: user.wheelwordGamesWon,
            currentStreak: user.wheelwordCurrentStreak,
            maxStreak: user.wheelwordMaxStreak,
            lastPlayedDate: user.wheelwordLastPlayedDate,
            winDistribution: user.wheelwordWinDistribution,
        })
            .from(user)
            .where(eq(user.userId, userId))
            .limit(1);

        if (userData.length === 0) return;

        const stats = userData[0];
        const todayUTC = this.getUTCDateString();

        // Calcular nueva racha (victorias seguidas por día)
        let newStreak = stats.currentStreak || 0;
        if (won) {
            const daysSinceLast = stats.lastPlayedDate
                ? this.daysBetween(stats.lastPlayedDate, todayUTC)
                : null;

            if (daysSinceLast === null) {
                // Primera vez jugando
                newStreak = 1;
            } else if (daysSinceLast <= 1) {
                // Día consecutivo (hoy o ayer)
                newStreak = newStreak + 1;
            } else {
                // Pasó más de 1 día sin jugar: resetear
                newStreak = 1;
            }
        } else {
            // Perdió: resetear racha a 0
            newStreak = 0;
        }

        const newMaxStreak = Math.max(stats.maxStreak || 0, newStreak);

        // Actualizar distribución de victorias
        let distribution = (stats.winDistribution || '0,0,0,0,0,0').split(',').map(Number);
        if (won && attemptsCount >= 1 && attemptsCount <= 6) {
            distribution[attemptsCount - 1]++;
        }

        await db.update(user)
            .set({
                wheelwordGamesPlayed: (stats.gamesPlayed || 0) + 1,
                wheelwordGamesWon: won ? (stats.gamesWon || 0) + 1 : stats.gamesWon,
                wheelwordCurrentStreak: newStreak,
                wheelwordMaxStreak: newMaxStreak,
                wheelwordLastPlayedDate: todayUTC,
                wheelwordWinDistribution: distribution.join(','),
            })
            .where(eq(user.userId, userId));
    }

    /**
     * Obtiene el estado actual del juego para un usuario registrado
     */
    async getUserGameState(userId: number): Promise<GameStateDTO | null> {
        const todaysGame = await this.getTodaysGame();

        const todayUTC = this.getUTCDateString();
        const game = await db.select({
            dailyGameId: dailyGame.dailyGameId,
            word: gameWord.word,
        })
            .from(dailyGame)
            .innerJoin(gameWord, eq(dailyGame.gameWordId, gameWord.gameWordId))
            .where(eq(dailyGame.gameDate, todayUTC))
            .limit(1);

        if (game.length === 0) return null;

        const attempt = await db.select()
            .from(userGameAttempt)
            .where(and(
                eq(userGameAttempt.userId, userId),
                eq(userGameAttempt.dailyGameId, game[0].dailyGameId)
            ))
            .limit(1);

        const correctWord = game[0].word.toUpperCase();
        const attempts = attempt.length > 0 ? (attempt[0].attempts || []) : [];
        const gameOver = attempt.length > 0 && (attempt[0].won || attempts.length >= MAX_ATTEMPTS);

        // Generar feedbacks para cada intento
        const feedbacks = attempts.map((att: string) => this.generateFeedback(att, correctWord));

        return {
            gameNumber: todaysGame.gameNumber,
            wordLength: todaysGame.wordLength,
            gameDate: todaysGame.gameDate,
            attempts,
            feedbacks,
            gameOver,
            won: attempt.length > 0 ? attempt[0].won : false,
            correctWord: gameOver ? correctWord : undefined,
        };
    }

    /**
     * Obtiene las estadísticas de un usuario
     */
    async getUserStats(userId: number): Promise<WheelwordStatsDTO> {
        const userData = await db.select({
            gamesPlayed: user.wheelwordGamesPlayed,
            gamesWon: user.wheelwordGamesWon,
            currentStreak: user.wheelwordCurrentStreak,
            maxStreak: user.wheelwordMaxStreak,
            winDistribution: user.wheelwordWinDistribution,
        })
            .from(user)
            .where(eq(user.userId, userId))
            .limit(1);

        if (userData.length === 0) {
            return {
                gamesPlayed: 0,
                gamesWon: 0,
                winPercentage: 0,
                currentStreak: 0,
                maxStreak: 0,
                winDistribution: [0, 0, 0, 0, 0, 0],
            };
        }

        const stats = userData[0];
        const gamesPlayed = stats.gamesPlayed || 0;
        const gamesWon = stats.gamesWon || 0;

        return {
            gamesPlayed,
            gamesWon,
            winPercentage: gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0,
            currentStreak: stats.currentStreak || 0,
            maxStreak: stats.maxStreak || 0,
            winDistribution: (stats.winDistribution || '0,0,0,0,0,0').split(',').map(Number),
        };
    }

    /**
     * Genera el texto para compartir resultado
     */
    generateShareText(gameNumber: number, attempts: string[], feedbacks: string[][], won: boolean): string {
        const attemptsText = won ? `${attempts.length}/6` : 'X/6';
        let text = `🏎️ WheelWord #${gameNumber} ${attemptsText}\n\n`;

        feedbacks.forEach(feedback => {
            text += feedback.join('') + '\n';
        });

        text += '\nhttps://wheelshouse.com/wheelword';
        return text;
    }

    // === Utilidades ===

    private getUTCDateString(): string {
        const now = new Date();
        return now.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    private daysBetween(date1: string, date2: string): number {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2.getTime() - d1.getTime());
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }
}
