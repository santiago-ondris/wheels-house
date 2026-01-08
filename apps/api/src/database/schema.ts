import { serial, text, integer, date, boolean, unique, pgTable, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    userId: serial("userId").primaryKey(),
    username: text("username").notNull().unique(),
    firstName: text("firstName").notNull(),
    lastName: text("lastName").notNull(),
    email: text("email").notNull().unique(),
    hashedPassword: text("hashedPassword").notNull(),
    createdDate: timestamp("createdDate").defaultNow(),
    picture: text("picture"),
    // for the future:
    // verificationCode: integer("verificationCode").notNull(),
    // verified: boolean("verified"),
    // restorePasswordCode: integer("restorePasswordCode"),
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
    country: text("country")
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