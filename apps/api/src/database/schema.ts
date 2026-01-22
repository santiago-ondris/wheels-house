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

// export const collection = pgTable("collection",{
//     collectionId: serial("collectionId").primaryKey(),
//     name: text("name").notNull(),
//     description: text("description"),
//     userId: integer("userId").references(() => user.userId).notNull(),
//     picture: text("picture"),
// });

export const car = pgTable("car", {
    carId: serial("carId").primaryKey(),
    name: text("name").notNull(),
    color: text("color").notNull(),
    brand: text("brand").notNull(),
    scale: text("scale").notNull(),
    manufacturer: text("manufacturer").notNull(),
    userId: integer("userId").references(() => user.userId).notNull(),
    description: text("description"),
    designer: text("designer"),
    series: text("series"),
    country: text("country"),
    condition: text("condition").notNull().default("Abierto"),
    wished: boolean("wished").notNull().default(false),
    rarity: text("rarity"),
    quality: text("quality"),
    variety: text("variety"),
    finish: text("finish"),
});

export const carPicture = pgTable("carPicture", {
    carPictureId: serial("carPictureId").primaryKey(),
    url: text("url").notNull(),
    carId: integer("carId").references(() => car.carId).notNull(),
    index: integer("index").notNull()
}, (t) => [
    unique().on(t.carId, t.index)
]);


export const group = pgTable("group", {
    groupId: serial("groupId").primaryKey(),
    name: text("name").notNull(),
    userId: integer("userId").references(() => user.userId).notNull(),
    description: text("description"),
    picture: text("picture"),
    featured: boolean("featured").default(false),
    order: integer("order"),
}, (t) => [
    unique().on(t.name, t.userId)
]);






// export const carInCollection = pgTable("carInCollection",{
//     carInCollectionId: serial("carInCollectionId").primaryKey(),
//     carId: integer("carId").references(() => car.carId).notNull(),
//     collectionId: integer("collectionId").references(() => collection.collectionId).notNull(),
// }, (t) => [
//     unique().on(t.carId, t.collectionId)
// ]);


export const groupedCar = pgTable("groupedCar", {
    groupedCarId: serial("groupedCarId").primaryKey(),

    // when inserting a grouped car it should be verified that the owner of the car is the same as the 
    // owner of the group. 
    carId: integer("carId").references(() => car.carId).notNull(),
    groupId: integer("groupId").references(() => group.groupId).notNull(),
}, (t) => [
    unique().on(t.carId, t.groupId)
]);

export const searchHistory = pgTable("searchHistory", {
    searchHistoryId: serial("searchHistoryId").primaryKey(),
    userId: integer("userId").references(() => user.userId).notNull(),
    searchedUserId: integer("searchedUserId").references(() => user.userId).notNull(),
    searchedAt: timestamp("searchedAt", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
    unique().on(t.userId, t.searchedUserId)
]);

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