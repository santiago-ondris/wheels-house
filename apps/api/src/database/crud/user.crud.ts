import { db } from '../index'
import { UpdateUserProfileDTO, UserToDB } from 'src/dto/user.dto'
import { user } from 'src/database/schema'
import { eq, ilike } from 'drizzle-orm';

// Create

export async function createUser(newUser: UserToDB) {
    try {
        return await db.insert(user).values(newUser);
    } catch {
        return null;
    }
}

// Read

export async function getUserFromUsername(username: string) {
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

export async function getUserFromUsernameOrEmail(usernameOrEmail: string) {
    // Try by email. 
    const userFromEmailObject = await db.select().from(user).where(eq(user.email, usernameOrEmail));
    if (userFromEmailObject[0]) return userFromEmailObject[0];

    // Try by username.
    const userFromUsernameObject = await db.select().from(user).where(eq(user.username, usernameOrEmail));
    return userFromUsernameObject[0];
}

export async function getPublicProfileByUsername(username: string) {
    const userObject = await db.select({
        userId: user.userId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
        createdDate: user.createdDate,
        biography: user.biography
    }).from(user).where(eq(user.username, username));

    return userObject[0] || null;
}

export async function searchUsers(query: string) {
    if (!query) return [];

    // Search strictly by username containing the query string (case insensitive)
    return await db.select({
        userId: user.userId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
    })
        .from(user)
        .where(ilike(user.username, `%${query}%`))
        .limit(20);
}

// Update

export async function updateUserFromUserId(userId: number, userChanges: UpdateUserProfileDTO) {
    try {
        await db.update(user).set(userChanges).where(eq(user.userId, userId));
        return true;
    } catch {
        return false;
    }
}

export async function updatePasswordFromUserId(userId: number, newHashedPassword: string) {
    try {
        await db.update(user).set({hashedPassword: newHashedPassword}).where(eq(user.userId, userId));
        return true;
    } catch {
        return false;
    }
}

// Delete

export async function deleteUserFromUsername(username: string) {
    try {
        const deletedUser = await db.delete(user).where(eq(user.username, username)).returning();
        return deletedUser[0];
    } catch {
        return null;
    }
}