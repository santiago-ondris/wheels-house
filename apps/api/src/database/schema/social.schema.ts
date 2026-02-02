import { serial, text, integer, jsonb, pgTable, timestamp, index, boolean } from "drizzle-orm/pg-core";
import { user } from "./user.schema";
import { car } from "./car.schema";
import { group } from "./group.schema";

export const feedEvent = pgTable("feedEvent", {
    feedEventId: serial("feedEventId").primaryKey(),

    // Tipo de evento
    type: text("type", {
        enum: ['car_added', 'milestone_reached', 'wishlist_achieved', 'group_created', 'wishlist_added']
    }).notNull(),

    // Usuario que generó el evento
    userId: integer("userId").references(() => user.userId).notNull(),

    // Referencias opcionales dependiendo del tipo de evento
    carId: integer("carId").references(() => car.carId),
    groupId: integer("groupId").references(() => group.groupId),

    // Metadata adicional (milestone number, carName, groupName, etc.)
    metadata: jsonb("metadata"),

    // Timestamps
    createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
    // Indices para queries comunes
    index("feedEvent_userId_idx").on(t.userId),
    index("feedEvent_createdAt_idx").on(t.createdAt),
    index("feedEvent_type_idx").on(t.type),
]);

// Type para los valores de metadata
export interface FeedEventMetadata {
    carName?: string;
    carImage?: string;
    milestone?: number;
    groupName?: string;
    groupImage?: string;
    carCount?: number;
    isFromWishlist?: boolean;
}

export const userFollow = pgTable("userFollow", {
    followerId: integer("followerId").references(() => user.userId).notNull(), // Quien sigue
    followedId: integer("followedId").references(() => user.userId).notNull(), // A quien sigue
    createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
    // Un usuario solo puede seguir a otro una vez
    { pk: [t.followerId, t.followedId] },
    // Indices para buscar seguidores y seguidos
    index("userFollow_followerId_idx").on(t.followerId),
    index("userFollow_followedId_idx").on(t.followedId),
]);

export const carLike = pgTable("carLike", {
    userId: integer("userId").references(() => user.userId).notNull(),
    carId: integer("carId").references(() => car.carId).notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
    { pk: [t.userId, t.carId] },
    index("carLike_carId_idx").on(t.carId),
]);

export const groupLike = pgTable("groupLike", {
    userId: integer("userId").references(() => user.userId).notNull(),
    groupId: integer("groupId").references(() => group.groupId).notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
    { pk: [t.userId, t.groupId] },
    index("groupLike_groupId_idx").on(t.groupId),
]);

export const notification = pgTable("notification", {
    notificationId: serial("notificationId").primaryKey(),
    userId: integer("userId").references(() => user.userId).notNull(), // A quién va dirigida
    type: text("type", {
        enum: ['new_follower', 'car_liked', 'group_liked', 'milestone_reached', 'wishlist_match']
    }).notNull(),
    actorId: integer("actorId").references(() => user.userId), // Quién hizo la acción
    carId: integer("carId").references(() => car.carId),
    groupId: integer("groupId").references(() => group.groupId),
    metadata: jsonb("metadata"),
    read: boolean("read").default(false).notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
    index("notification_userId_read_idx").on(t.userId, t.read),
    index("notification_createdAt_idx").on(t.createdAt),
]);

