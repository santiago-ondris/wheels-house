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
    // Notice that select returns an array of objects (that's why we access the 0 idx.)
    const userObject = await db.select().from(user).where(eq(user.username, username));
    // return await db.query.user.findFirst({
    //     where: (user, { eq }) => eq(user.username, username),
    // });
    return userObject[0];
}

export async function getUserFromEmail(email: string) {
    const userObject = await db.select().from(user).where(eq(user.email, email));
    // return await db.query.user.findFirst({
        //     where: (user, { eq }) => eq(user.email, email),
        // });
    return userObject[0];
}

export async function getUserFromEmailOrUsername(email: string, username: string) {
    // Try by email. Notice that the object is an array of length 1 (or null).
    const userFromEmailObject = await db.select().from(user).where(eq(user.email, email));
    if(userFromEmailObject != null) return userFromEmailObject[0];

    // Try by username.
    const userFromUsernameObject = await db.select().from(user).where(eq(user.username,username));
    return userFromUsernameObject[0];
}