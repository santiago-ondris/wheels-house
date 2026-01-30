import { db } from '../index'
import { UpdateUserProfileDTO, UserToDB } from 'src/dto/user.dto'
import { car, feedEvent, searchHistory, user, userGameAttempt } from 'src/database/schema'
import { eq, gt, ilike, and, or, sql, asc } from 'drizzle-orm';
import { PASSWORE_RESET_TIME_LIMIT } from 'src/utils/user.utils';

// Create

export async function createUser(newUser: UserToDB) {
    try {
        const createdUser = await db.insert(user).values(newUser).returning();
        return createdUser[0];
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
        biography: user.biography,
        defaultSortPreference: user.defaultSortPreference
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

export async function getUserFromRequestTokenSelector(selector: string) {
    try {
        const userObject = await db.select().from(user).where(
            and(
                eq(user.resetPasswordRequestSelector, selector),
                gt(user.resetPasswordTokenExpires, new Date(Date.now()))
            )
        );
        return userObject[0] ?? null;
    } catch {
        return null;
    }
}

export async function getFounders(limit = 100) {
    // Get first N users who have at least 1 car in their collection (not wishlist)
    // Ordered by userId (first registered = first founder)
    const carCountSubquery = db
        .select({
            userId: car.userId,
            carCount: sql<number>`count(*)`.as('carCount')
        })
        .from(car)
        .where(eq(car.wished, false))
        .groupBy(car.userId)
        .as('carCounts');

    const founders = await db
        .select({
            founderNumber: sql<number>`row_number() over (order by ${user.userId} asc)`.as('founderNumber'),
            userId: user.userId,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            picture: user.picture,
            createdDate: user.createdDate,
            carCount: carCountSubquery.carCount
        })
        .from(user)
        .innerJoin(carCountSubquery, eq(user.userId, carCountSubquery.userId))
        .orderBy(asc(user.userId))
        .limit(limit);

    return founders;
}

export async function getHoFMembers(flag: string) {
    // flag can be isContributor, isAmbassador, isLegend
    const carCountSubquery = db
        .select({
            userId: car.userId,
            carCount: sql<number>`count(*)`.as('carCount')
        })
        .from(car)
        .where(eq(car.wished, false))
        .groupBy(car.userId)
        .as('carCounts');

    const members = await db
        .select({
            userId: user.userId,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            picture: user.picture,
            createdDate: user.createdDate,
            hallOfFameTitle: user.hallOfFameTitle,
            hallOfFameFlags: user.hallOfFameFlags,
            hallOfFameOrder: user.hallOfFameOrder,
            carCount: carCountSubquery.carCount
        })
        .from(user)
        .innerJoin(carCountSubquery, eq(user.userId, carCountSubquery.userId))
        .where(sql`${user.hallOfFameFlags}->>${flag} = 'true'`)
        .orderBy(asc(user.userId));

    return members;
}

export async function getFeaturedHoFMembersManual() {
    const carCountSubquery = db
        .select({
            userId: car.userId,
            carCount: sql<number>`count(*)`.as('carCount')
        })
        .from(car)
        .where(eq(car.wished, false))
        .groupBy(car.userId)
        .as('carCounts');

    const members = await db
        .select({
            userId: user.userId,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            picture: user.picture,
            createdDate: user.createdDate,
            hallOfFameTitle: user.hallOfFameTitle,
            hallOfFameFlags: user.hallOfFameFlags,
            hallOfFameOrder: user.hallOfFameOrder,
            carCount: carCountSubquery.carCount
        })
        .from(user)
        .innerJoin(carCountSubquery, eq(user.userId, carCountSubquery.userId))
        .where(sql`${user.hallOfFameOrder} IS NOT NULL`)
        .orderBy(asc(user.hallOfFameOrder));

    return members;
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
        await db.update(user).set({ hashedPassword: newHashedPassword }).where(eq(user.userId, userId));
        return true;
    } catch {
        return false;
    }
}

export async function updateResetPasswordToken(userId: number, selector: string, hashedValidator: string) {
    try {
        await db.update(user).set({
            resetPasswordRequestSelector: selector,
            resetPasswordHashedValidator: hashedValidator,
            resetPasswordTokenExpires: new Date(Date.now() + PASSWORE_RESET_TIME_LIMIT)
        }).where(eq(user.userId, userId));
        return true;
    } catch {
        return false;
    }
}

export async function updatePasswordFromReset(userId: number, newHashedPassword: string) {
    try {
        await db.update(user).set({
            hashedPassword: newHashedPassword,
            resetPasswordRequestSelector: '',
            resetPasswordHashedValidator: '',
            resetPasswordTokenExpires: new Date(Date.now())
        }).where(eq(user.userId, userId));
        return true;
    } catch {
        return false;
    }
}

// Delete

export async function deleteUserFromUsername(username: string) {
    try {
        const deletedUser = await db.delete(user).where(eq(user.username, username)).returning();
        return deletedUser[0] ?? null;
    } catch {
        return null;
    }
}

export async function deleteSearchHistoryFromUserId(userId: number) {
    try {
        await db.delete(searchHistory).where(
            or(
                eq(searchHistory.userId, userId),
                eq(searchHistory.searchedUserId, userId)
            )
        );
        return true;
    } catch {
        return false;
    }
}

export async function deleteFeedEventsFromUserId(userId: number) {
    try {
        await db.delete(feedEvent).where(eq(feedEvent.userId, userId));
        return true;
    } catch {
        return false;
    }
}

export async function deleteUserGameAttemptsFromUserId(userId: number) {
    try {
        await db.delete(userGameAttempt).where(eq(userGameAttempt.userId, userId));
        return true;
    } catch {
        return false;
    }
}
