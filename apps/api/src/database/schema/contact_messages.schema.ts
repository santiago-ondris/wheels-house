import { pgTable, serial, text, timestamp, integer, pgEnum, boolean } from "drizzle-orm/pg-core";
import { user } from "./user.schema";

export const contactReasonEnum = pgEnum("contact_reason", ["BUG", "SUGGESTION", "GENERAL"]);

export const contactMessage = pgTable("contact_message", {
    contactMessageId: serial("contactMessageId").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    reason: contactReasonEnum("reason").notNull().default("GENERAL"),
    message: text("message").notNull(),
    userId: integer("userId").references(() => user.userId),
    status: text("status").notNull().default("PENDING"), // PENDING, READ, RESOLVED
    createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
    adminNotes: text("adminNotes"),
    archived: boolean("archived").notNull().default(false),
    archivedAt: timestamp("archivedAt", { withTimezone: true }),
});
