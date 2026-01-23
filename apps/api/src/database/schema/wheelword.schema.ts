import { serial, text, integer, date, boolean, unique, pgTable, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user.schema";

// ==================== WheelWord Game Tables ====================

// Pool de palabras para el juego diario
export const gameWord = pgTable("gameWord", {
    gameWordId: serial("gameWordId").primaryKey(),
    word: text("word").notNull().unique(),
    category: text("category").notNull(), // 'marca', 'modelo', 'general'
    timesUsed: integer("timesUsed").default(0),
    lastUsedAt: timestamp("lastUsedAt", { withTimezone: true }),
});

// Juego diario - uno por día
export const dailyGame = pgTable("dailyGame", {
    dailyGameId: serial("dailyGameId").primaryKey(),
    gameNumber: integer("gameNumber").notNull().unique(), // #1, #2, #3...
    gameWordId: integer("gameWordId").references(() => gameWord.gameWordId).notNull(),
    gameDate: date("gameDate").notNull().unique(),
    createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow(),
});

// Intentos/resultados de usuarios registrados
export const userGameAttempt = pgTable("userGameAttempt", {
    userGameAttemptId: serial("userGameAttemptId").primaryKey(),
    userId: integer("userId").references(() => user.userId).notNull(),
    dailyGameId: integer("dailyGameId").references(() => dailyGame.dailyGameId).notNull(),
    attempts: text("attempts").array(), // Array de palabras intentadas
    attemptsCount: integer("attemptsCount").notNull(),
    won: boolean("won").notNull(),
    completedAt: timestamp("completedAt", { withTimezone: true }).defaultNow(),
}, (t) => [
    unique().on(t.userId, t.dailyGameId) // Un usuario solo puede jugar una vez por día
]);
