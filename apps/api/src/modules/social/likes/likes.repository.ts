import { db } from '../../../database';
import { carLike, groupLike, user, car, group } from '../../../database/schema';
import { eq, and, sql, desc, gte } from 'drizzle-orm';

export interface LikerUserInfo {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    picture: string | null;
}

export interface LikesPaginationOptions {
    page?: number;
    limit?: number;
}

/**
 * Crea un like de un usuario a un auto
 */
export async function createCarLike(userId: number, carId: number): Promise<void> {
    await db.insert(carLike).values({
        userId,
        carId,
    });
}

/**
 * Elimina un like de un usuario a un auto
 */
export async function removeCarLike(userId: number, carId: number): Promise<void> {
    await db.delete(carLike)
        .where(
            and(
                eq(carLike.userId, userId),
                eq(carLike.carId, carId)
            )
        );
}

/**
 * Verifica si un usuario le dio like a un auto
 */
export async function isCarLiked(userId: number, carId: number): Promise<boolean> {
    const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(carLike)
        .where(
            and(
                eq(carLike.userId, userId),
                eq(carLike.carId, carId)
            )
        );

    return Number(result[0].count) > 0;
}

/**
 * Obtiene el numero de likes de un auto
 */
export async function countCarLikes(carId: number): Promise<number> {
    const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(carLike)
        .where(eq(carLike.carId, carId));

    return Number(result[0].count);
}

/**
 * Obtiene la lista de usuarios que le dieron like a un auto
 */
export async function getCarLikers(
    carId: number,
    options: LikesPaginationOptions = {}
): Promise<LikerUserInfo[]> {
    const { page = 0, limit = 20 } = options;

    const data = await db
        .select({
            userId: user.userId,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            picture: user.picture,
        })
        .from(carLike)
        .innerJoin(user, eq(carLike.userId, user.userId))
        .where(eq(carLike.carId, carId))
        .orderBy(desc(carLike.createdAt))
        .limit(limit)
        .offset(page * limit);

    return data;
}

/**
 * Obtiene el numero de likes de un usuario en los últimos minutos (para throttling)
 */
export async function countRecentUserLikes(userId: number, minutes: number): Promise<number> {
    const timeThreshold = new Date(Date.now() - minutes * 60 * 1000);

    const carLikesCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(carLike)
        .where(
            and(
                eq(carLike.userId, userId),
                gte(carLike.createdAt, timeThreshold)
            )
        );

    const groupLikesCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(groupLike)
        .where(
            and(
                eq(groupLike.userId, userId),
                gte(groupLike.createdAt, timeThreshold)
            )
        );

    return Number(carLikesCount[0].count) + Number(groupLikesCount[0].count);
}

// ==================== Group Likes ====================

/**
 * Crea un like de un usuario a un grupo
 */
export async function createGroupLike(userId: number, groupId: number): Promise<void> {
    await db.insert(groupLike).values({
        userId,
        groupId,
    });
}

/**
 * Elimina un like de un usuario a un grupo
 */
export async function removeGroupLike(userId: number, groupId: number): Promise<void> {
    await db.delete(groupLike)
        .where(
            and(
                eq(groupLike.userId, userId),
                eq(groupLike.groupId, groupId)
            )
        );
}

/**
 * Verifica si un usuario le dio like a un grupo
 */
export async function isGroupLiked(userId: number, groupId: number): Promise<boolean> {
    const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(groupLike)
        .where(
            and(
                eq(groupLike.userId, userId),
                eq(groupLike.groupId, groupId)
            )
        );

    return Number(result[0].count) > 0;
}

/**
 * Obtiene el numero de likes de un grupo
 */
export async function countGroupLikes(groupId: number): Promise<number> {
    const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(groupLike)
        .where(eq(groupLike.groupId, groupId));

    return Number(result[0].count);
}

/**
 * Obtiene la lista de usuarios que le dieron like a un grupo
 */
export async function getGroupLikers(
    groupId: number,
    options: LikesPaginationOptions = {}
): Promise<LikerUserInfo[]> {
    const { page = 0, limit = 20 } = options;

    const data = await db
        .select({
            userId: user.userId,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            picture: user.picture,
        })
        .from(groupLike)
        .innerJoin(user, eq(groupLike.userId, user.userId))
        .where(eq(groupLike.groupId, groupId))
        .orderBy(desc(groupLike.createdAt))
        .limit(limit)
        .offset(page * limit);

    return data;
}
/**
 * Elimina todos los likes de un auto (para limpieza al borrar auto)
 */
export async function deleteCarLikes(carId: number): Promise<void> {
    await db.delete(carLike).where(eq(carLike.carId, carId));
}

/**
 * Elimina todos los likes de un grupo (para limpieza al borrar grupo)
 */
export async function deleteGroupLikes(groupId: number): Promise<void> {
    await db.delete(groupLike).where(eq(groupLike.groupId, groupId));
}

/**
 * Elimina todos los likes otorgados por un usuario (para limpieza al borrar usuario)
 * Y decrementa los contadores correspondientes
 */
export async function deleteUserLikes(userId: number): Promise<void> {
    await db.transaction(async (tx) => {
        // 1. Obtener todos los IDs de autos que el usuario likeó
        const likedCars = await tx.select({ carId: carLike.carId }).from(carLike).where(eq(carLike.userId, userId));

        // 2. Decrementar likesCount para esos autos
        for (const liked of likedCars) {
            await tx.update(car)
                .set({ likesCount: sql`GREATEST(0, ${car.likesCount} - 1)` })
                .where(eq(car.carId, liked.carId));
        }

        // 3. Obtener todos los IDs de grupos que el usuario likeó
        const likedGroups = await tx.select({ groupId: groupLike.groupId }).from(groupLike).where(eq(groupLike.userId, userId));

        // 4. Decrementar likesCount para esos grupos
        for (const liked of likedGroups) {
            await tx.update(group)
                .set({ likesCount: sql`GREATEST(0, ${group.likesCount} - 1)` })
                .where(eq(group.groupId, liked.groupId));
        }

        // 5. Eliminar los registros de likes
        await tx.delete(carLike).where(eq(carLike.userId, userId));
        await tx.delete(groupLike).where(eq(groupLike.userId, userId));
    });
}
