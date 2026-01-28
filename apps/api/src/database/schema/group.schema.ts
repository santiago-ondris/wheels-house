import { serial, text, integer, boolean, unique, pgTable } from "drizzle-orm/pg-core";
import { user } from "./user.schema";
import { car } from "./car.schema";

export const group = pgTable("group", {
    groupId: serial("groupId").primaryKey(),
    name: text("name").notNull(),
    userId: integer("userId").references(() => user.userId).notNull(),
    description: text("description"),
    picture: text("picture"),
    featured: boolean("featured").default(false),
    order: integer("order"),
    likesCount: integer("likesCount").notNull().default(0),
}, (t) => [
    unique().on(t.name, t.userId)
]);


export const groupedCar = pgTable("groupedCar", {
    groupedCarId: serial("groupedCarId").primaryKey(),
    // when inserting a grouped car it should be verified that the owner of the car is the same as the 
    // owner of the group. 
    carId: integer("carId").references(() => car.carId).notNull(),
    groupId: integer("groupId").references(() => group.groupId).notNull(),
}, (t) => [
    unique().on(t.carId, t.groupId)
]);
