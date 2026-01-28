import { serial, text, integer, date, boolean, unique, pgTable, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    userId: serial("userId").primaryKey(),
    username: text("username").notNull().unique(),
    firstName: text("firstName").notNull(),
    lastName: text("lastName").notNull(),
    email: text("email").notNull().unique(),
    hashedPassword: text("hashedPassword").notNull(),
    createdDate: timestamp("createdDate", { withTimezone: true }).defaultNow(),
    picture: text("picture"),
    biography: text("biography"),
    resetPasswordRequestSelector: text("resetPasswordRequestSelector"),
    resetPasswordHashedValidator: text("resetPasswordHashedValidator"),
    resetPasswordTokenExpires: timestamp("resetPasswordTokenExpires", { withTimezone: true }),
    defaultSortPreference: text("defaultSortPreference").default("id:desc"),

    // Social Stats
    followersCount: integer("followersCount").default(0),
    followingCount: integer("followingCount").default(0),

    // WheelWord game stats
    wheelwordGamesPlayed: integer("wheelwordGamesPlayed").default(0),
    wheelwordGamesWon: integer("wheelwordGamesWon").default(0),
    wheelwordCurrentStreak: integer("wheelwordCurrentStreak").default(0),
    wheelwordMaxStreak: integer("wheelwordMaxStreak").default(0),
    wheelwordLastPlayedDate: date("wheelwordLastPlayedDate"),
    wheelwordWinDistribution: text("wheelwordWinDistribution").default("0,0,0,0,0,0"), // wins in 1,2,3,4,5,6 attempts
    // for the future:
    // verificationCode: integer("verificationCode").notNull(),
    // verified: boolean("verified"),
});

export const searchHistory = pgTable("searchHistory", {
    searchHistoryId: serial("searchHistoryId").primaryKey(),
    userId: integer("userId").references(() => user.userId).notNull(),
    searchedUserId: integer("searchedUserId").references(() => user.userId).notNull(),
    searchedAt: timestamp("searchedAt", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
    unique().on(t.userId, t.searchedUserId)
]);
