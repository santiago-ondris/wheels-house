import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import * as likesRepository from './likes.repository';
import { getCarById } from '../../../database/crud/car.crud';
import { getGroupFromId } from '../../../database/crud/group.crud';
import { db } from '../../../database';
import { car, group, carLike, groupLike } from '../../../database/schema';
import { eq, sql, and } from 'drizzle-orm';

@Injectable()
export class LikesService {
    private readonly LIKES_LIMIT_PER_HOUR = 100;

    constructor(private readonly eventsService: EventsService) { }

    // ==================== Car Likes ====================

    async likeCar(userId: number, carId: number) {
        // 1. Verificar que el auto existe
        const carData = await getCarById(carId);
        if (!carData) {
            throw new NotFoundException('El auto no existe');
        }

        // 2. Verificar si ya tiene like
        const alreadyLiked = await likesRepository.isCarLiked(userId, carId);

        if (alreadyLiked) {
            return { message: 'Ya le diste like a este auto' };
        }

        // 4. Throttling
        const recentLikes = await likesRepository.countRecentUserLikes(userId, 60);
        if (recentLikes >= this.LIKES_LIMIT_PER_HOUR) {
            throw new BadRequestException('Alcanzaste el límite de likes por hora. Inténtalo más tarde.');
        }

        // 4. Crear el like e incrementar contador

        await db.transaction(async (tx) => {
            await tx.insert(carLike).values({ userId, carId });

            await tx.update(car)
                .set({ likesCount: sql`${car.likesCount} + 1` })
                .where(eq(car.carId, carId));
        });

        // 5. Emitir evento

        this.eventsService.emitCarLiked({
            userId,
            carId,
            ownerId: carData.userId
        });

        return { success: true };
    }

    async unlikeCar(userId: number, carId: number) {
        const carData = await getCarById(carId);
        if (!carData) {
            throw new NotFoundException('El auto no existe');
        }

        const alreadyLiked = await likesRepository.isCarLiked(userId, carId);
        if (!alreadyLiked) {
            return { message: 'No le habías dado like a este auto' };
        }

        await db.transaction(async (tx) => {
            await tx.delete(carLike)
                .where(and(eq(carLike.userId, userId), eq(carLike.carId, carId)));

            await tx.update(car)
                .set({ likesCount: sql`GREATEST(0, ${car.likesCount} - 1)` })
                .where(eq(car.carId, carId));

        });

        this.eventsService.emitCarUnliked({
            userId,
            carId,
            ownerId: carData.userId
        });

        return { success: true };
    }

    async getCarLikers(carId: number, page: number = 0, limit: number = 20) {
        const maxLimit = Math.min(limit, 100);
        return await likesRepository.getCarLikers(carId, { page, limit: maxLimit });
    }

    // ==================== Group Likes ====================

    async likeGroup(userId: number, groupId: number) {
        const groupData = await getGroupFromId(groupId);
        if (!groupData) {
            throw new NotFoundException('El grupo no existe');
        }

        // 2. Verificar si ya tiene like
        const alreadyLiked = await likesRepository.isGroupLiked(userId, groupId);

        if (alreadyLiked) {
            return { message: 'Ya le diste like a este grupo' };
        }

        const recentLikes = await likesRepository.countRecentUserLikes(userId, 60);
        if (recentLikes >= this.LIKES_LIMIT_PER_HOUR) {
            throw new BadRequestException('Has alcanzado el límite de likes por hora.');
        }

        await db.transaction(async (tx) => {
            await tx.insert(groupLike).values({ userId, groupId });

            await tx.update(group)
                .set({ likesCount: sql`${group.likesCount} + 1` })
                .where(eq(group.groupId, groupId));
        });

        this.eventsService.emitGroupLiked({
            userId,
            groupId,
            ownerId: groupData.userId
        });

        return { success: true };
    }

    async unlikeGroup(userId: number, groupId: number) {
        const groupData = await getGroupFromId(groupId);
        if (!groupData) {
            throw new NotFoundException('El grupo no existe');
        }

        const alreadyLiked = await likesRepository.isGroupLiked(userId, groupId);
        if (!alreadyLiked) {
            return { message: 'No le habías dado like a este grupo' };
        }

        await db.transaction(async (tx) => {
            await tx.delete(groupLike)
                .where(and(eq(groupLike.userId, userId), eq(groupLike.groupId, groupId)));

            await tx.update(group)
                .set({ likesCount: sql`GREATEST(0, ${group.likesCount} - 1)` })
                .where(eq(group.groupId, groupId));

        });

        this.eventsService.emitGroupUnliked({
            userId,
            groupId,
            ownerId: groupData.userId
        });

        return { success: true };
    }

    async getGroupLikers(groupId: number, page: number = 0, limit: number = 20) {
        const maxLimit = Math.min(limit, 100);
        return await likesRepository.getGroupLikers(groupId, { page, limit: maxLimit });
    }
}
