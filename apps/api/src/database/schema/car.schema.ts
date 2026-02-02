import { serial, text, integer, boolean, unique, pgTable, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user.schema";

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
    likesCount: integer("likesCount").notNull().default(0),

    hidden: boolean("hidden").default(false).notNull(),
    hiddenReason: text("hiddenReason"),
    hiddenAt: timestamp("hiddenAt", { withTimezone: true }),
    hiddenBy: integer("hiddenBy").references(() => user.userId),
});

export const carPicture = pgTable("carPicture", {
    carPictureId: serial("carPictureId").primaryKey(),
    url: text("url").notNull(),
    carId: integer("carId").references(() => car.carId).notNull(),
    index: integer("index").notNull()
}, (t) => [
    unique().on(t.carId, t.index)
]);
