import { serial, text, integer, jsonb, pgTable, timestamp, index } from "drizzle-orm/pg-core";
import { user } from "./user.schema";
import { car } from "./car.schema";
import { group } from "./group.schema";

export const feedEvent = pgTable("feedEvent", {
    feedEventId: serial("feedEventId").primaryKey(),

    // Tipo de evento
    type: text("type", {
        enum: ['car_added', 'milestone_reached', 'wishlist_achieved', 'group_created']
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
