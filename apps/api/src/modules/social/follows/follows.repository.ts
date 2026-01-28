import { db } from '../../../database';
import { userFollow, user } from '../../../database/schema';
import { eq, and, sql, desc, gte } from 'drizzle-orm';

export interface FollowUserInfo {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    picture: string | null;
    followersCount: number;
    followingCount: number;
    isFollowing?: boolean;
}

export interface FollowsPaginationOptions {
    page?: number;
    limit?: number;
    viewerId?: number;
}

/**
 * Crea una relación de seguimiento entre dos usuarios
 */
export async function createFollow(followerId: number, followedId: number): Promise<void> {
    await db.insert(userFollow).values({
        followerId,
        followedId,
    });
}

/**
 * Elimina una relación de seguimiento entre dos usuarios
 */
export async function removeFollow(followerId: number, followedId: number): Promise<void> {
    await db.delete(userFollow)
        .where(
            and(
                eq(userFollow.followerId, followerId),
                eq(userFollow.followedId, followedId)
            )
        );
}

/**
 * Verifica si un usuario sigue a otro
 */
export async function isFollowing(followerId: number, followedId: number): Promise<boolean> {
    const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(userFollow)
        .where(
            and(
                eq(userFollow.followerId, followerId),
                eq(userFollow.followedId, followedId)
            )
        );

    return Number(result[0].count) > 0;
}

/**
 * Obtiene la lista de usuarios que siguen al usuario objetivo
 */
export async function getFollowers(
    targetUserId: number,
    options: FollowsPaginationOptions = {}
): Promise<FollowUserInfo[]> {
    const { page = 0, limit = 20, viewerId } = options;

    const data = await db
        .select({
            userId: user.userId,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            picture: user.picture,
            followersCount: user.followersCount,
            followingCount: user.followingCount,
            viewerFollows: viewerId
                ? sql<boolean>`EXISTS(SELECT 1 FROM "userFollow" WHERE "followerId" = ${viewerId} AND "followedId" = ${user.userId})`
                : sql<boolean>`false`
        })
        .from(userFollow)
        .innerJoin(user, eq(userFollow.followerId, user.userId))
        .where(eq(userFollow.followedId, targetUserId))
        .orderBy(desc(userFollow.createdAt))
        .limit(limit)
        .offset(page * limit);

    return data.map(item => ({
        userId: item.userId,
        username: item.username,
        firstName: item.firstName,
        lastName: item.lastName,
        picture: item.picture,
        followersCount: item.followersCount || 0,
        followingCount: item.followingCount || 0,
        isFollowing: !!item.viewerFollows
    }));
}

/**
 * Obtiene la lista de usuarios que el usuario objetivo sigue
 */
export async function getFollowing(
    targetUserId: number,
    options: FollowsPaginationOptions = {}
): Promise<FollowUserInfo[]> {
    const { page = 0, limit = 20, viewerId } = options;

    const data = await db
        .select({
            userId: user.userId,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            picture: user.picture,
            followersCount: user.followersCount,
            followingCount: user.followingCount,
            viewerFollows: viewerId
                ? sql<boolean>`EXISTS(SELECT 1 FROM "userFollow" WHERE "followerId" = ${viewerId} AND "followedId" = ${user.userId})`
                : sql<boolean>`false`
        })
        .from(userFollow)
        .innerJoin(user, eq(userFollow.followedId, user.userId))
        .where(eq(userFollow.followerId, targetUserId))
        .orderBy(desc(userFollow.createdAt))
        .limit(limit)
        .offset(page * limit);

    return data.map(item => ({
        userId: item.userId,
        username: item.username,
        firstName: item.firstName,
        lastName: item.lastName,
        picture: item.picture,
        followersCount: item.followersCount || 0,
        followingCount: item.followingCount || 0,
        isFollowing: !!item.viewerFollows
    }));
}

/**
 * Obtiene la lista de IDs de usuarios que el usuario sigue (para feed filtering)
 */
export async function getFollowingIds(userId: number): Promise<number[]> {
    const data = await db
        .select({ followedId: userFollow.followedId })
        .from(userFollow)
        .where(eq(userFollow.followerId, userId));

    return data.map(row => row.followedId);
}

/**
 * Obtiene el número de usuarios que el usuario sigue en los últimos X minutos
 */
export async function countRecentFollows(followerId: number, minutes: number): Promise<number> {
    const timeThreshold = new Date(Date.now() - minutes * 60 * 1000);

    const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(userFollow)
        .where(
            and(
                eq(userFollow.followerId, followerId),
                gte(userFollow.createdAt, timeThreshold)
            )
        );

    return Number(result[0].count);
}

/**
 * Obtiene el número de seguidores de un usuario
 */
export async function countFollowers(userId: number): Promise<number> {
    const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(userFollow)
        .where(eq(userFollow.followedId, userId));

    return Number(result[0].count);
}

/**
 * Obtiene el número de usuarios que sigue un usuario
 */
export async function countFollowing(userId: number): Promise<number> {
    const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(userFollow)
        .where(eq(userFollow.followerId, userId));

    return Number(result[0].count);
}
/**
 * Elimina todas las relaciones de seguimiento de un usuario (como seguidor o seguido)
 * Y sincroniza los contadores de seguidores/seguidos de los otros usuarios afectados
 */
export async function deleteUserFollows(userId: number): Promise<void> {
    await db.transaction(async (tx) => {
        // 1. Obtener a quién sigue el usuario (para bajarles sus followersCount)
        const following = await tx.select({ followedId: userFollow.followedId }).from(userFollow).where(eq(userFollow.followerId, userId));
        for (const f of following) {
            await tx.update(user)
                .set({ followersCount: sql`GREATEST(0, ${user.followersCount} - 1)` })
                .where(eq(user.userId, f.followedId));
        }

        // 2. Obtener quién sigue al usuario (para bajarles sus followingCount)
        const followers = await tx.select({ followerId: userFollow.followerId }).from(userFollow).where(eq(userFollow.followedId, userId));
        for (const f of followers) {
            await tx.update(user)
                .set({ followingCount: sql`GREATEST(0, ${user.followingCount} - 1)` })
                .where(eq(user.userId, f.followerId));
        }

        // 3. Eliminar los registros de follow
        await tx.delete(userFollow)
            .where(
                sql`${userFollow.followerId} = ${userId} OR ${userFollow.followedId} = ${userId}`
            );
    });
}
