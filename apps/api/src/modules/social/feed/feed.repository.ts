import { db } from '../../../database';
import { car, feedEvent, group, user } from '../../../database/schema';
import { eq, desc, inArray, and, gte, sql, or, isNull } from 'drizzle-orm';
import type { FeedEventMetadata } from '../../../database/schema';

// Tipos para el feed
export type FeedEventType = 'car_added' | 'milestone_reached' | 'wishlist_achieved' | 'group_created' | 'wishlist_added';

export interface CreateFeedEventInput {
    type: FeedEventType;
    userId: number;
    carId?: number;
    groupId?: number;
    metadata?: FeedEventMetadata;
}

export interface FeedEventWithUser {
    feedEventId: number;
    type: FeedEventType;
    userId: number;
    carId: number | null;
    groupId: number | null;
    metadata: FeedEventMetadata | null;
    createdAt: Date;
    user: {
        username: string;
        firstName: string;
        lastName: string;
        picture: string | null;
    };
    likesCount: number;
    isLiked: boolean;
}


export interface FeedQueryOptions {
    targetUserId?: number; // Para el feed de un usuario específico
    page?: number;
    limit?: number;
    type?: FeedEventType;
    userIds?: number[]; // Para filtrar por usuarios que sigo
    daysBack?: number; // Ventana temporal (default 30 días)
    viewerId?: number; // ID del usuario que ve el feed (para isLiked)
}


/**
 * FeedRepository - Operaciones de base de datos para feed_events
 */

// ==================== CREATE ====================

export async function createFeedEvent(input: CreateFeedEventInput): Promise<number> {
    const result = await db.insert(feedEvent).values({
        type: input.type,
        userId: input.userId,
        carId: input.carId,
        groupId: input.groupId,
        metadata: input.metadata,
    }).returning({ feedEventId: feedEvent.feedEventId });

    return result[0].feedEventId;
}

// ==================== READ ====================

/**
 * Obtiene el feed global (todos los usuarios)
 */
export async function getFeedGlobal(options: FeedQueryOptions = {}): Promise<FeedEventWithUser[]> {
    const {
        page = 0,
        limit = 20,
        type,
        daysBack = 30,
        viewerId,
    } = options;

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - daysBack);

    const conditions = [
        gte(feedEvent.createdAt, daysAgo),
        or(eq(car.hidden, false), isNull(car.hidden)),
        or(eq(group.hidden, false), isNull(group.hidden)),
    ];

    if (type) {
        conditions.push(eq(feedEvent.type, type));
    }

    if (options.targetUserId) {
        conditions.push(eq(feedEvent.userId, options.targetUserId));
    }

    const events = await db
        .select({
            feedEventId: feedEvent.feedEventId,
            type: feedEvent.type,
            userId: feedEvent.userId,
            carId: feedEvent.carId,
            groupId: feedEvent.groupId,
            metadata: feedEvent.metadata,
            createdAt: feedEvent.createdAt,
            user: {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                picture: user.picture,
            },
            carLikesCount: car.likesCount,
            groupLikesCount: group.likesCount,
            isCarLiked: viewerId
                ? sql<boolean>`EXISTS(SELECT 1 FROM "carLike" WHERE "userId" = ${viewerId} AND "carId" = ${feedEvent.carId})`
                : sql<boolean>`false`,
            isGroupLiked: viewerId
                ? sql<boolean>`EXISTS(SELECT 1 FROM "groupLike" WHERE "userId" = ${viewerId} AND "groupId" = ${feedEvent.groupId})`
                : sql<boolean>`false`,
        })
        .from(feedEvent)
        .innerJoin(user, eq(feedEvent.userId, user.userId))
        .leftJoin(car, eq(feedEvent.carId, car.carId))
        .leftJoin(group, eq(feedEvent.groupId, group.groupId))
        .where(and(...conditions))
        .orderBy(desc(feedEvent.createdAt))
        .limit(limit)
        .offset(page * limit);

    return (events as any[]).map(event => ({
        ...event,
        likesCount: event.carId ? (event.carLikesCount || 0) : (event.groupLikesCount || 0),
        isLiked: event.carId ? !!event.isCarLiked : !!event.isGroupLiked,
    })) as FeedEventWithUser[];
}


/**
 * Obtiene el feed personalizado (solo usuarios que sigo)
 */
export async function getFeedFollowing(
    followedUserIds: number[],
    options: FeedQueryOptions = {}
): Promise<FeedEventWithUser[]> {
    const {
        page = 0,
        limit = 20,
        type,
        daysBack = 30,
        viewerId,
    } = options;

    if (followedUserIds.length === 0) {
        return [];
    }

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - daysBack);

    const conditions = [
        inArray(feedEvent.userId, followedUserIds),
        gte(feedEvent.createdAt, daysAgo),
        or(eq(car.hidden, false), isNull(car.hidden)),
        or(eq(group.hidden, false), isNull(group.hidden)),
    ];

    if (type) {
        conditions.push(eq(feedEvent.type, type));
    }

    if (options.targetUserId) {
        conditions.push(eq(feedEvent.userId, options.targetUserId));
    }

    const events = await db
        .select({
            feedEventId: feedEvent.feedEventId,
            type: feedEvent.type,
            userId: feedEvent.userId,
            carId: feedEvent.carId,
            groupId: feedEvent.groupId,
            metadata: feedEvent.metadata,
            createdAt: feedEvent.createdAt,
            user: {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                picture: user.picture,
            },
            carLikesCount: car.likesCount,
            groupLikesCount: group.likesCount,
            isCarLiked: viewerId
                ? sql<boolean>`EXISTS(SELECT 1 FROM "carLike" WHERE "userId" = ${viewerId} AND "carId" = ${feedEvent.carId})`
                : sql<boolean>`false`,
            isGroupLiked: viewerId
                ? sql<boolean>`EXISTS(SELECT 1 FROM "groupLike" WHERE "userId" = ${viewerId} AND "groupId" = ${feedEvent.groupId})`
                : sql<boolean>`false`,
        })
        .from(feedEvent)
        .innerJoin(user, eq(feedEvent.userId, user.userId))
        .leftJoin(car, eq(feedEvent.carId, car.carId))
        .leftJoin(group, eq(feedEvent.groupId, group.groupId))
        .where(and(...conditions))
        .orderBy(desc(feedEvent.createdAt))
        .limit(limit)
        .offset(page * limit);

    return (events as any[]).map(event => ({
        ...event,
        likesCount: event.carId ? (event.carLikesCount || 0) : (event.groupLikesCount || 0),
        isLiked: event.carId ? !!event.isCarLiked : !!event.isGroupLiked,
    })) as FeedEventWithUser[];
}


/**
 * Obtiene eventos de un usuario específico
 */
export async function getFeedByUserId(
    userId: number,
    options: FeedQueryOptions = {}
): Promise<FeedEventWithUser[]> {
    const { page = 0, limit = 20, viewerId } = options;

    const events = await db
        .select({
            feedEventId: feedEvent.feedEventId,
            type: feedEvent.type,
            userId: feedEvent.userId,
            carId: feedEvent.carId,
            groupId: feedEvent.groupId,
            metadata: feedEvent.metadata,
            createdAt: feedEvent.createdAt,
            user: {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                picture: user.picture,
            },
            carLikesCount: car.likesCount,
            groupLikesCount: group.likesCount,
            isCarLiked: viewerId
                ? sql<boolean>`EXISTS(SELECT 1 FROM "carLike" WHERE "userId" = ${viewerId} AND "carId" = ${feedEvent.carId})`
                : sql<boolean>`false`,
            isGroupLiked: viewerId
                ? sql<boolean>`EXISTS(SELECT 1 FROM "groupLike" WHERE "userId" = ${viewerId} AND "groupId" = ${feedEvent.groupId})`
                : sql<boolean>`false`,
        })
        .from(feedEvent)
        .innerJoin(user, eq(feedEvent.userId, user.userId))
        .leftJoin(car, eq(feedEvent.carId, car.carId))
        .leftJoin(group, eq(feedEvent.groupId, group.groupId))
        .leftJoin(group, eq(feedEvent.groupId, group.groupId))
        .where(and(
            eq(feedEvent.userId, userId),
            or(eq(car.hidden, false), isNull(car.hidden)),
            or(eq(group.hidden, false), isNull(group.hidden))
        ))
        .orderBy(desc(feedEvent.createdAt))
        .limit(limit)
        .offset(page * limit);

    return (events as any[]).map(event => ({
        ...event,
        likesCount: event.carId ? (event.carLikesCount || 0) : (event.groupLikesCount || 0),
        isLiked: event.carId ? !!event.isCarLiked : !!event.isGroupLiked,
    })) as FeedEventWithUser[];
}


/**
 * Cuenta total de eventos (para paginación)
 */
export async function countFeedEvents(options: FeedQueryOptions = {}): Promise<number> {
    const { type, daysBack = 30 } = options;

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - daysBack);

    const conditions = [
        gte(feedEvent.createdAt, daysAgo),
        or(eq(car.hidden, false), isNull(car.hidden)),
        or(eq(group.hidden, false), isNull(group.hidden)),
    ];

    if (type) {
        conditions.push(eq(feedEvent.type, type));
    }

    if (options.targetUserId) {
        conditions.push(eq(feedEvent.userId, options.targetUserId));
    }

    if (options.userIds && options.userIds.length > 0) {
        conditions.push(inArray(feedEvent.userId, options.userIds));
    }

    const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(feedEvent)
        .leftJoin(car, eq(feedEvent.carId, car.carId))
        .leftJoin(group, eq(feedEvent.groupId, group.groupId))
        .where(and(...conditions));

    return Number(result[0].count);
}

/**
 * Verifica si ya existe un evento específico para evitar duplicados
 */
export async function existsFeedEvent(type: FeedEventType, userId: number, targetId: { carId?: number, groupId?: number }): Promise<boolean> {
    const conditions = [
        eq(feedEvent.type, type),
        eq(feedEvent.userId, userId),
    ];

    if (targetId.carId) {
        conditions.push(eq(feedEvent.carId, targetId.carId));
    }
    if (targetId.groupId) {
        conditions.push(eq(feedEvent.groupId, targetId.groupId));
    }

    const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(feedEvent)
        .where(and(...conditions));

    return Number(result[0].count) > 0;
}
