import { Injectable } from '@nestjs/common';
import { db } from '../../database';
import { car } from '../../database/schema/car.schema';
import { group } from '../../database/schema/group.schema';
import { contactMessage } from '../../database/schema/contact_messages.schema';
import { eq, desc, and, sql, SQL } from 'drizzle-orm';
import { TokenData } from '../../dto/user.dto';

@Injectable()
export class AdminService {
    async hideCar(carId: number, reason: string, adminUser: TokenData) {
        await db.update(car)
            .set({
                hidden: true,
                hiddenReason: reason,
                hiddenAt: new Date(),
                hiddenBy: adminUser.userId,
            })
            .where(eq(car.carId, carId));

        return { success: true };
    }

    async hideGroup(groupId: number, reason: string, adminUser: TokenData) {
        await db.update(group)
            .set({
                hidden: true,
                hiddenReason: reason,
                hiddenAt: new Date(),
                hiddenBy: adminUser.userId,
            })
            .where(eq(group.groupId, groupId));

        return { success: true };
    }

    async getContactMessages(options: { page?: number, limit?: number, status?: string, archived?: boolean }) {
        const { page = 1, limit = 20, status, archived } = options;
        const offset = (page - 1) * limit;

        const conditions: SQL[] = [];
        if (status && status !== 'ALL') {
            conditions.push(eq(contactMessage.status, status));
        }

        if (archived !== undefined) {
            conditions.push(eq(contactMessage.archived, archived));
        }

        const data = await db.select()
            .from(contactMessage)
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(desc(contactMessage.createdAt))
            .limit(limit)
            .offset(offset);

        const totalResult = await db.select({ count: sql<number>`count(*)` })
            .from(contactMessage)
            .where(conditions.length > 0 ? and(...conditions) : undefined);

        const total = Number(totalResult[0].count);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async updateContactMessageStatus(id: number, status: string, adminNotes?: string) {
        await db.update(contactMessage)
            .set({
                status,
                adminNotes,
            })
            .where(eq(contactMessage.contactMessageId, id));

        return { success: true };
    }

    async archiveContactMessage(id: number, archived: boolean) {
        await db.update(contactMessage)
            .set({
                archived,
                archivedAt: archived ? new Date() : null,
            })
            .where(eq(contactMessage.contactMessageId, id));

        return { success: true };
    }
}
