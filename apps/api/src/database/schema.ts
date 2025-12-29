// Schema de la base de datos - definir tablas aca
import { serial, text, integer, date, boolean, unique, pgTable } from "drizzle-orm/pg-core";


export const user = pgTable("user",{
    userId: serial("userId").primaryKey(),
    username: text("username").notNull(), 
    firstName: text("firstName").notNull(),
    lastName: text("lastName").notNull(),
    email: text("email").notNull(),
    hashedPassword: text("hashedPassword").notNull(),
    createdDate: date("createdDate").notNull(),
    // for the future:
    // verificationCode: integer("verificationCode").notNull(),
    // verified: boolean("verified"),
    // restorePasswordCode: integer("restorePasswordCode"),
}, (t) =>[
    unique().on(t.username)
]);