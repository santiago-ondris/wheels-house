import { db } from '../../../database';
import { feedEvent, user } from '../../../database/schema';
import { eq, desc, inArray, and, gte, sql } from 'drizzle-orm';
import type { FeedEventMetadata } from '../../../database/schema';

// Tipos para el feed
export type FeedEventType = 'car_added' | 'milestone_reached' | 'wishlist_achieved' | 'group_created';

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
}

export interface FeedQueryOptions {
    targetUserId?: number; // Para el feed de un usuario específico
    page?: number;
    limit?: number;
    type?: FeedEventType;
    userIds?: number[]; // Para filtrar por usuarios que sigo
    daysBack?: number; // Ventana temporal (default 30 días)
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
    } = options;

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - daysBack);

    const conditions = [
        gte(feedEvent.createdAt, daysAgo),
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
            }
        })
        .from(feedEvent)
        .innerJoin(user, eq(feedEvent.userId, user.userId))
        .where(and(...conditions))
        .orderBy(desc(feedEvent.createdAt))
        .limit(limit)
        .offset(page * limit);

    return events as FeedEventWithUser[];
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
    } = options;

    if (followedUserIds.length === 0) {
        return [];
    }

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - daysBack);

    const conditions = [
        inArray(feedEvent.userId, followedUserIds),
        gte(feedEvent.createdAt, daysAgo),
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
            }
        })
        .from(feedEvent)
        .innerJoin(user, eq(feedEvent.userId, user.userId))
        .where(and(...conditions))
        .orderBy(desc(feedEvent.createdAt))
        .limit(limit)
        .offset(page * limit);

    return events as FeedEventWithUser[];
}

/**
 * Obtiene eventos de un usuario específico
 */
export async function getFeedByUserId(
    userId: number,
    options: FeedQueryOptions = {}
): Promise<FeedEventWithUser[]> {
    const { page = 0, limit = 20 } = options;

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
            }
        })
        .from(feedEvent)
        .innerJoin(user, eq(feedEvent.userId, user.userId))
        .where(eq(feedEvent.userId, userId))
        .orderBy(desc(feedEvent.createdAt))
        .limit(limit)
        .offset(page * limit);

    return events as FeedEventWithUser[];
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
