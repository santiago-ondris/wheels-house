import { db } from '../index'
import { UserToDB } from 'src/dto/user.dto'
import { user } from 'src/database/schema'
import { eq } from 'drizzle-orm';

// Create

export async function createUser(newUser: UserToDB) {
    try {
        await db.insert(user).values(newUser);
        return true;
    } catch {
        return false;
    }
}

// Read

export async function getUserFromUsername(username: string) {
    // Notice that the object is an array of length 1 (or 0).
    const userObject = await db.select().from(user).where(eq(user.username, username));
    // return await db.query.user.findFirst({
    //     where: (user, { eq }) => eq(user.username, username),
    // });
    return userObject[0];
}

export async function getUserFromEmail(email: string) {
    // Notice that the object is an array of length 1 (or 0).
    const userObject = await db.select().from(user).where(eq(user.email, email));
    // return await db.query.user.findFirst({
        //     where: (user, { eq }) => eq(user.email, email),
        // });
    return userObject[0];
}

export async function getUserFromUsernameOrEmail(usernameOrEmail: string) {
    // Try by email. Notice that the object is an array of length 1 (or 0).
    const userFromEmailObject = await db.select().from(user).where(eq(user.email, usernameOrEmail));
    if(userFromEmailObject[0]) return userFromEmailObject[0];

    // Try by username.
    const userFromUsernameObject = await db.select().from(user).where(eq(user.username, usernameOrEmail));
    return userFromUsernameObject[0];
}