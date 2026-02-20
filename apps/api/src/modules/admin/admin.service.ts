import { Injectable } from '@nestjs/common';
import { db } from '../../database';
import { car, carPicture } from '../../database/schema/car.schema';
import { group } from '../../database/schema/group.schema';
import { user } from '../../database/schema/user.schema';
import { contactMessage } from '../../database/schema/contact_messages.schema';
import { settings } from '../../database/schema/settings.schema';
import { eq, desc, and, sql, SQL, ilike } from 'drizzle-orm';
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

    // Featured Car Settings
    async getFeaturedCarSetting() {
        const result = await db.select()
            .from(settings)
            .where(eq(settings.key, 'featuredCarId'))
            .limit(1);

        if (!result.length || !result[0].value) {
            return null;
        }

        const carId = parseInt(result[0].value);

        // Get the car details
        const carResult = await db.select({
            carId: car.carId,
            name: car.name,
            brand: car.brand,
            manufacturer: car.manufacturer,
            color: car.color,
            scale: car.scale,
            series: car.series,
            description: car.description,
            ownerUsername: user.username,
        })
            .from(car)
            .innerJoin(user, eq(car.userId, user.userId))
            .where(eq(car.carId, carId))
            .limit(1);

        if (!carResult.length) {
            return null;
        }

        // Get pictures
        const pictures = await db.select({ url: carPicture.url })
            .from(carPicture)
            .where(eq(carPicture.carId, carId));

        return {
            ...carResult[0],
            pictures: pictures.map(p => p.url),
            updatedAt: result[0].updatedAt,
        };
    }

    async setFeaturedCarSetting(carId: number, adminUserId: number) {
        // Verify car exists
        const carExists = await db.select({ carId: car.carId })
            .from(car)
            .where(eq(car.carId, carId))
            .limit(1);

        if (!carExists.length) {
            throw new Error('Car not found');
        }

        // Upsert the setting
        await db.insert(settings)
            .values({
                key: 'featuredCarId',
                value: carId.toString(),
                updatedAt: new Date(),
                updatedBy: adminUserId,
            })
            .onConflictDoUpdate({
                target: settings.key,
                set: {
                    value: carId.toString(),
                    updatedAt: new Date(),
                    updatedBy: adminUserId,
                }
            });

        return { success: true, carId };
    }

    async searchCarsAdmin(query: string, limit: number = 20) {
        const results = await db.select({
            carId: car.carId,
            name: car.name,
            brand: car.brand,
            manufacturer: car.manufacturer,
            color: car.color,
            scale: car.scale,
            series: car.series,
            ownerUsername: user.username,
        })
            .from(car)
            .innerJoin(user, eq(car.userId, user.userId))
            .where(and(
                ilike(car.name, `%${query}%`),
                eq(car.wished, false),
                eq(car.hidden, false)
            ))
            .orderBy(desc(car.carId))
            .limit(limit);

        // Get first picture for each car
        const carsWithPictures = await Promise.all(
            results.map(async (c) => {
                const picture = await db.select({ url: carPicture.url })
                    .from(carPicture)
                    .where(eq(carPicture.carId, c.carId))
                    .limit(1);
                return {
                    ...c,
                    picture: picture[0]?.url || null,
                };
            })
        );

        return carsWithPictures;
    }
}
