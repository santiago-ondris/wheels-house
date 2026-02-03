
import { Inject, Injectable } from '@nestjs/common';
import { desc, eq, and, sql, lt, or, isNull } from 'drizzle-orm';
import { db } from '../../../database';
import * as schema from '../../../database/schema';

@Injectable()
export class NotificationsRepository {
    private readonly db = db;

    async create(data: typeof schema.notification.$inferInsert) {
        return await this.db
            .insert(schema.notification)
            .values(data)
            .returning();
    }

    async findPendingNotification(params: {
        userId: number;
        type: string;
        actorId?: number;
        carId?: number;
        groupId?: number;
    }) {
        const conditions = [
            eq(schema.notification.userId, params.userId),
            eq(schema.notification.type, params.type as any),
            eq(schema.notification.read, false),
        ];

        if (params.actorId) conditions.push(eq(schema.notification.actorId, params.actorId));
        if (params.carId) conditions.push(eq(schema.notification.carId, params.carId));
        if (params.groupId) conditions.push(eq(schema.notification.groupId, params.groupId));

        const [existing] = await this.db
            .select()
            .from(schema.notification)
            .where(and(...conditions))
            .limit(1);

        return existing;
    }

    async findExistingNotification(params: {
        userId: number;
        type: string;
        actorId?: number;
        carId?: number;
        groupId?: number;
    }) {
        const conditions = [
            eq(schema.notification.userId, params.userId),
            eq(schema.notification.type, params.type as any),
        ];

        if (params.actorId) conditions.push(eq(schema.notification.actorId, params.actorId));
        if (params.carId) conditions.push(eq(schema.notification.carId, params.carId));
        if (params.groupId) conditions.push(eq(schema.notification.groupId, params.groupId));

        const [existing] = await this.db
            .select()
            .from(schema.notification)
            .where(and(...conditions))
            .orderBy(desc(schema.notification.createdAt))
            .limit(1);

        return existing;
    }

    async findByUser(userId: number, limit = 20, offset = 0) {
        return await this.db
            .select({
                notificationId: schema.notification.notificationId,
                userId: schema.notification.userId,
                type: schema.notification.type,
                actorId: schema.notification.actorId,
                carId: schema.notification.carId,
                groupId: schema.notification.groupId,
                metadata: schema.notification.metadata,
                read: schema.notification.read,
                createdAt: schema.notification.createdAt,
                actor: {
                    userId: schema.user.userId,
                    username: schema.user.username,
                    picture: schema.user.picture,
                }
            })
            .from(schema.notification)
            .leftJoin(schema.user, eq(schema.notification.actorId, schema.user.userId))
            .leftJoin(schema.car, eq(schema.notification.carId, schema.car.carId))
            .leftJoin(schema.group, eq(schema.notification.groupId, schema.group.groupId))
            .where(and(
                eq(schema.notification.userId, userId),
                or(eq(schema.car.hidden, false), isNull(schema.car.hidden)),
                or(eq(schema.group.hidden, false), isNull(schema.group.hidden))
            ))
            .orderBy(desc(schema.notification.createdAt))
            .limit(limit)
            .offset(offset);
    }

    async getUnreadCount(userId: number) {
        const [result] = await this.db
            .select({ count: sql<number>`count(*)` })
            .from(schema.notification)
            .leftJoin(schema.car, eq(schema.notification.carId, schema.car.carId))
            .leftJoin(schema.group, eq(schema.notification.groupId, schema.group.groupId))
            .where(
                and(
                    eq(schema.notification.userId, userId),
                    eq(schema.notification.read, false),
                    or(eq(schema.car.hidden, false), isNull(schema.car.hidden)),
                    or(eq(schema.group.hidden, false), isNull(schema.group.hidden))
                )
            );
        return Number(result.count);
    }

    async markAsRead(notificationId: number, userId: number) {
        return await this.db
            .update(schema.notification)
            .set({ read: true })
            .where(
                and(
                    eq(schema.notification.notificationId, notificationId),
                    eq(schema.notification.userId, userId)
                )
            )
            .returning();
    }

    async markAllAsRead(userId: number) {
        return await this.db
            .update(schema.notification)
            .set({ read: true })
            .where(
                and(
                    eq(schema.notification.userId, userId),
                    eq(schema.notification.read, false)
                )
            )
            .returning();
    }

    async delete(notificationId: number, userId: number) {
        return await this.db
            .delete(schema.notification)
            .where(
                and(
                    eq(schema.notification.notificationId, notificationId),
                    eq(schema.notification.userId, userId)
                )
            )
            .returning();
    }

    async deleteByCarId(carId: number) {
        return await this.db.delete(schema.notification).where(eq(schema.notification.carId, carId));
    }

    async deleteByGroupId(groupId: number) {
        return await this.db.delete(schema.notification).where(eq(schema.notification.groupId, groupId));
    }

    async deleteByUserId(userId: number) {
        return await this.db.delete(schema.notification)
            .where(
                sql`${schema.notification.userId} = ${userId} OR ${schema.notification.actorId} = ${userId}`
            );
    }

    async deleteOldNotifications(olderThan: Date) {
        return await this.db
            .delete(schema.notification)
            .where(lt(schema.notification.createdAt, olderThan))
            .returning();
    }
}
