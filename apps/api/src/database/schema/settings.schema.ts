import { text, pgTable, timestamp, integer } from "drizzle-orm/pg-core";
import { user } from "./user.schema";

/**
 * Settings table for storing key-value configuration pairs.
 * Used for admin-configurable settings like featured car selection.
 */
export const settings = pgTable("settings", {
    key: text("key").primaryKey(),
    value: text("value").notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow(),
    updatedBy: integer("updatedBy").references(() => user.userId),
});
