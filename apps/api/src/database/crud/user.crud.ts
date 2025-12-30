import { db } from '../index'
import { UserToDB } from 'src/dto/user.dto'
import { user } from 'src/database/schema'
import { eq } from 'drizzle-orm';

// Create

export async function createUser(newUser: UserToDB) {
    try {
        await db.insert(user).values({
            username: newUser.username,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            hashedPassword: newUser.hashedPassword,
            picture: newUser.picture
        });
        return true;
    } catch {
        return false;
    }
}

// Read

export async function getUserFromUsername(username: string) {
    const result = await db.select().from(user).where(eq(user.username, username));
    // return await db.query.user.findFirst({
    //     where: (user, { eq }) => eq(user.username, username),
    // });
    return result[0];
}

export async function getUserFromEmail(email: string) {
    const result = await db.select().from(user).where(eq(user.email, email));
    // return await db.query.user.findFirst({
        //     where: (user, { eq }) => eq(user.email, email),
        // });
    return result[0];
}