import { Injectable } from '@nestjs/common';
import { TokenData } from '../../dto/user.dto';
import { getUserFromUsername, assignFounderStatus } from 'src/database/crud/user.crud';
import { CarInfo, CarInfoWithOwner, CarPictureToDB, CarToDB, CarUpdateDTO, CreateCarDTO } from 'src/dto/car.dto';
import { ERROR_CREATING_CAR, ERROR_DELETING_CAR, ERROR_UPDATING_CAR } from 'src/utils/car.utils';
import {
    createCar, deleteCar, getCarById, getCarByIdWithOwner, getCarsFromUserId, updateCar, createCarPicture, getPicturesFromCar,
    deleteAllCarPictures, deleteCarPicture, updateCarPicture, getTotalCarsCount, getCarByOffset, getUniqueCarValues,
    getCarsFromUserIdPaginated, getFilterOptionsForUser, getCarIdsFromUserIdWithFilter,
    getWishedCarsFromUserId,
    deleteFeedEventsFromCarId
} from 'src/database/crud/car.crud';
import { db } from 'src/database';
import { settings } from 'src/database/schema/settings.schema';
import { eq } from 'drizzle-orm';
import { CollectionQueryDTO, PaginatedCarsResponse } from 'src/dto/collection-query.dto';
import { createGroupedCars, deleteGroupedCarsFromCarId, getGroupsFromCarId, getGroupFromId, getGroupedCarsFromGroupId } from 'src/database/crud/group.crud';
import { UploadService } from '../../services/upload.service';
import { getPublicIdFromURL } from 'src/utils/upload.utils';
import { EventsService } from '../social/events/events.service';
import * as likesRepository from '../social/likes/likes.repository';
import { NotificationsRepository } from '../social/notifications/notifications.repository';

@Injectable()
export class CarService {
    constructor(
        private readonly uploadService: UploadService,
        private readonly eventsService: EventsService,
        private readonly notificationsRepository: NotificationsRepository
    ) { }

    async createCarService(carData: CreateCarDTO, userData: TokenData) {
        const user = await getUserFromUsername(userData.username);

        const newCar: CarToDB = new CarToDB(
            user.userId, carData.name, carData.color, carData.brand,
            carData.scale, carData.manufacturer, carData.condition, carData.wished,
            carData.description, carData.designer, carData.series, carData.country,
            carData.rarity, carData.quality, carData.variety, carData.finish
        );

        const createdCar = await createCar(newCar);

        if (!createdCar) {
            throw ERROR_CREATING_CAR;
        }

        for (let idx = 0; idx < carData.pictures!.length; ++idx) {
            const newCarPicture = new CarPictureToDB(
                carData.pictures![idx],
                createdCar.carId,
                idx
            );

            const createdPicture = await createCarPicture(newCarPicture);

            if (!createdPicture) {
                throw ERROR_CREATING_CAR;
            }
        }

        if (!carData.wished) {
            const userCars = await getCarsFromUserId(user.userId);
            const realCars = userCars.filter(c => !c.wished);
            if (realCars.length === 1) {
                await assignFounderStatus(user.userId);
            }
        }

        // Emit social event
        if (carData.wished) {
            this.eventsService.emitWishlistItemAdded({
                userId: user.userId,
                carId: createdCar.carId,
                carName: createdCar.name,
                carImage: carData.pictures && carData.pictures.length > 0 ? carData.pictures[0] : undefined
            });
        } else {
            this.eventsService.emitCarAdded({
                userId: user.userId,
                carId: createdCar.carId,
                carName: createdCar.name,
                carImage: carData.pictures && carData.pictures.length > 0 ? carData.pictures[0] : undefined,
                isFromWishlist: false
            });
        }

        // Check for milestones
        this.checkAndEmitMilestone(user.userId);

        return createdCar.carId;
    }

    private async checkAndEmitMilestone(userId: number) {
        try {
            const userCars = await getCarsFromUserId(userId);
            const count = userCars.length;

            const milestones = [5, 25, 50, 100, 200];
            if (milestones.includes(count)) {
                this.eventsService.emitMilestoneReached({
                    userId,
                    milestone: count as any,
                    totalCars: count
                });
            }
        } catch (error) {
            console.error('Error checking milestones:', error);
        }
    }

    async listCarsService(username: string, viewerId?: number) {
        const user = await getUserFromUsername(username);
        const carsFromDB = await getCarsFromUserId(user.userId);
        let listedCars: CarInfo[] = [];

        for (const car of carsFromDB) {
            const carPicturesFromDB = await getPicturesFromCar(car.carId);
            const carPictures = carPicturesFromDB.map(picture => picture.url);

            const isLiked = viewerId ? await likesRepository.isCarLiked(viewerId, car.carId) : false;

            listedCars.push(new CarInfo(
                car.carId, car.name, car.color, car.brand,
                car.scale, car.manufacturer, car.condition, car.wished,
                car.description, car.designer, car.series, carPictures, car.country,
                car.rarity, car.quality, car.variety, car.finish,
                car.likesCount || 0, isLiked
            ));
        }
        return listedCars;
    }


    async getCarService(carId: number, viewerId?: number) {
        const carFromDB = await getCarByIdWithOwner(carId);
        const carPicturesFromDB = await getPicturesFromCar(carFromDB.carId);
        const carPicturesURLs = carPicturesFromDB.map(picture => picture.url);

        const isLiked = viewerId ? await likesRepository.isCarLiked(viewerId, carFromDB.carId) : false;

        return new CarInfoWithOwner(
            carFromDB.carId, carFromDB.name, carFromDB.color, carFromDB.brand,
            carFromDB.scale, carFromDB.manufacturer, carFromDB.condition, carFromDB.wished,
            carFromDB.ownerUsername, carFromDB.description, carFromDB.designer, carFromDB.series,
            carPicturesURLs, carFromDB.country,
            carFromDB.rarity, carFromDB.quality, carFromDB.variety, carFromDB.finish,
            carFromDB.likesCount || 0, isLiked
        );
    }


    async updateCarService(carChanges: CarUpdateDTO, carId: number) {
        const carUpdated = await updateCar(carChanges, carId);
        if (!carUpdated) throw ERROR_UPDATING_CAR;

        const carPicturesFromDB = await getPicturesFromCar(carId);

        for (let idx = 0; idx < Math.min(carChanges.pictures!.length, carPicturesFromDB.length); ++idx) {
            if (carChanges.pictures![idx] == carPicturesFromDB[idx].url) continue;
            const pictureUpdated = await updateCarPicture(new CarPictureToDB(
                carChanges.pictures![idx], carId, idx
            ), carPicturesFromDB[idx].carPictureId);
            if (!pictureUpdated) throw ERROR_UPDATING_CAR;
            await this.uploadService.deleteImage(getPublicIdFromURL(carPicturesFromDB[idx].url));
        }

        if (carChanges.pictures!.length > carPicturesFromDB.length) {
            for (let idx = carPicturesFromDB.length; idx < carChanges.pictures!.length; ++idx) {
                const createdPicture = await createCarPicture(new CarPictureToDB(
                    carChanges.pictures![idx], carId, idx
                ));
                if (!createdPicture) throw ERROR_UPDATING_CAR;
            }
        } else if (carChanges.pictures!.length < carPicturesFromDB.length) {
            for (let idx = carChanges.pictures!.length; idx < carPicturesFromDB.length; ++idx) {
                const pictureDeleted = await deleteCarPicture(carPicturesFromDB[idx].carPictureId);
                if (pictureDeleted == null) throw ERROR_UPDATING_CAR;
                await this.uploadService.deleteImage(getPublicIdFromURL(pictureDeleted.url));
            }
        }
        return true;
    }

    async deleteCarService(carId: number) {
        await likesRepository.deleteCarLikes(carId);
        await this.notificationsRepository.deleteByCarId(carId);
        const groupedCarDeleted = await deleteGroupedCarsFromCarId(carId);
        const picturesDeleted = await deleteAllCarPictures(carId);
        const feedEventsDeleted = await deleteFeedEventsFromCarId(carId);
        const carDeleted = await deleteCar(carId);

        if (!carDeleted || (picturesDeleted == null) || !groupedCarDeleted || !feedEventsDeleted) {
            throw ERROR_DELETING_CAR;
        }

        for (const picture of picturesDeleted) {
            await this.uploadService.deleteImage(getPublicIdFromURL(picture.url));
        }
        return true;
    }

    async getSuggestionsService(userData: TokenData) {
        const user = await getUserFromUsername(userData.username);
        const cars = await getUniqueCarValues(user.userId);
        const names = new Set<string>();
        const series = new Set<string>();
        const designers = new Set<string>();

        cars.forEach(car => {
            if (car.name) names.add(car.name);
            if (car.series) series.add(car.series);
            if (car.designer) designers.add(car.designer);
        });

        return {
            names: Array.from(names).sort(),
            series: Array.from(series).sort(),
            designers: Array.from(designers).sort(),
        };
    }

    async getFeaturedCarService(viewerId?: number) {
        // First check if there's a manually configured featured car
        const settingResult = await db.select()
            .from(settings)
            .where(eq(settings.key, 'featuredCarId'))
            .limit(1);

        let carFromDB: Awaited<ReturnType<typeof getCarByOffset>> | null = null;

        if (settingResult.length > 0 && settingResult[0].value) {
            // Use the manually configured car
            const configuredCarId = parseInt(settingResult[0].value);
            carFromDB = await getCarByIdWithOwner(configuredCarId);
        }

        // Fallback to rotation algorithm if no manual setting or car not found
        if (!carFromDB) {
            const totalCars = await getTotalCarsCount();
            if (totalCars === 0) return null;
            const epoch = new Date('2025-01-01T00:00:00Z').getTime();
            const now = new Date().getTime();
            const daysSinceEpoch = Math.floor((now - epoch) / (1000 * 60 * 60 * 24));
            const offset = daysSinceEpoch % totalCars;
            carFromDB = await getCarByOffset(offset);
            if (!carFromDB) return null;
        }

        const carPicturesFromDB = await getPicturesFromCar(carFromDB.carId);
        const carPicturesURLs = carPicturesFromDB.map(picture => picture.url);

        const isLiked = viewerId ? await likesRepository.isCarLiked(viewerId, carFromDB.carId) : false;

        return new CarInfoWithOwner(
            carFromDB.carId, carFromDB.name, carFromDB.color, carFromDB.brand,
            carFromDB.scale, carFromDB.manufacturer, carFromDB.condition, carFromDB.wished,
            carFromDB.ownerUsername, carFromDB.description, carFromDB.designer, carFromDB.series,
            carPicturesURLs, carFromDB.country,
            carFromDB.rarity, carFromDB.quality, carFromDB.variety, carFromDB.finish,
            carFromDB.likesCount || 0, isLiked
        );
    }


    async updateCarGroupsService(carId: number, groupIds: number[]) {
        await deleteGroupedCarsFromCarId(carId);
        for (const groupId of groupIds) {
            await createGroupedCars({ groupId, carId });
        }
        return true;
    }

    async getCarGroupsService(carId: number) {
        const groups = await getGroupsFromCarId(carId);
        return groups.map(g => g.groupId);
    }

    async listCarsPaginatedService(username: string, query: CollectionQueryDTO, viewerId?: number): Promise<PaginatedCarsResponse<CarInfo>> {
        const user = await getUserFromUsername(username);
        const { items, pagination } = await getCarsFromUserIdPaginated(user.userId, query);

        const listedCars: CarInfo[] = [];
        for (const carData of items) {
            const carPicturesFromDB = await getPicturesFromCar(carData.carId);
            const carPictures = carPicturesFromDB.map(picture => picture.url);

            const isLiked = viewerId ? await likesRepository.isCarLiked(viewerId, carData.carId) : false;

            listedCars.push(new CarInfo(
                carData.carId, carData.name, carData.color, carData.brand,
                carData.scale, carData.manufacturer, carData.condition, carData.wished,
                carData.description, carData.designer, carData.series, carPictures, carData.country,
                carData.rarity, carData.quality, carData.variety, carData.finish,
                carData.likesCount || 0, isLiked
            ));
        }

        const filters = await getFilterOptionsForUser(user.userId, query.groupId);
        return { items: listedCars, pagination, filters };
    }


    async bulkAddToGroupService(username: string, groupId: number, carIds?: number[], filterQuery?: CollectionQueryDTO) {
        const user = await getUserFromUsername(username);
        let targetCarIds: number[];

        if (carIds && carIds.length > 0) {
            targetCarIds = carIds;
        } else if (filterQuery) {
            targetCarIds = await getCarIdsFromUserIdWithFilter(user.userId, filterQuery);
        } else {
            return { addedCount: 0, alreadyInGroup: 0, totalRequested: 0 };
        }

        let addedCount = 0;
        let alreadyInGroup = 0;

        for (const carId of targetCarIds) {
            const result = await createGroupedCars({ groupId, carId });
            if (result && result.length > 0) addedCount++;
            else alreadyInGroup++;
        }

        return { addedCount, alreadyInGroup, totalRequested: targetCarIds.length };
    }

    async wishedCarToCollectionService(carId: number, carChanges: CarUpdateDTO) {
        const carBeforeUpdate = await getCarById(carId);
        if (!carBeforeUpdate) throw ERROR_UPDATING_CAR;

        const carUpdatedResult = await updateCar(carChanges, carId);
        if (!carUpdatedResult) throw ERROR_UPDATING_CAR;

        const carPicturesFromDB = await getPicturesFromCar(carId);
        for (let idx = 0; idx < Math.min(carChanges.pictures!.length, carPicturesFromDB.length); ++idx) {
            if (carChanges.pictures![idx] == carPicturesFromDB[idx].url) continue;
            const pictureUpdated = await updateCarPicture(new CarPictureToDB(
                carChanges.pictures![idx], carId, idx
            ), carPicturesFromDB[idx].carPictureId);
            if (!pictureUpdated) throw ERROR_UPDATING_CAR;
            await this.uploadService.deleteImage(getPublicIdFromURL(carPicturesFromDB[idx].url));
        }

        if (carChanges.pictures!.length > carPicturesFromDB.length) {
            for (let idx = carPicturesFromDB.length; idx < carChanges.pictures!.length; ++idx) {
                const createdPicture = await createCarPicture(new CarPictureToDB(
                    carChanges.pictures![idx], carId, idx
                ));
                if (!createdPicture) throw ERROR_UPDATING_CAR;
            }
        } else if (carChanges.pictures!.length < carPicturesFromDB.length) {
            for (let idx = carChanges.pictures!.length; idx < carPicturesFromDB.length; ++idx) {
                const pictureDeleted = await deleteCarPicture(carPicturesFromDB[idx].carPictureId);
                if (pictureDeleted == null) throw ERROR_UPDATING_CAR;
                await this.uploadService.deleteImage(getPublicIdFromURL(pictureDeleted.url));
            }
        }

        for (const groupId of carChanges.groups!) {
            await createGroupedCars({ carId, groupId });
        }

        // Check if this is user's first real car after moving from wishlist - assign founder status
        const userCars = await getCarsFromUserId(carBeforeUpdate.userId);
        const realCars = userCars.filter(c => !c.wished);
        if (realCars.length === 1) {
            await assignFounderStatus(carBeforeUpdate.userId);
        }

        this.eventsService.emitWishlistItemAchieved({
            userId: carBeforeUpdate.userId,
            carId,
            carName: carBeforeUpdate.name,
            carImage: carChanges.pictures && carChanges.pictures.length > 0 ? carChanges.pictures[0] : undefined
        });

        this.checkAndEmitMilestone(carBeforeUpdate.userId);
    }

    async getWishlistService(username: string, viewerId?: number) {
        const user = await getUserFromUsername(username);
        const wishedCarsFromDB = await getWishedCarsFromUserId(user.userId);
        let wishlist: CarInfo[] = [];

        for (const car of wishedCarsFromDB) {
            const carPicturesFromDB = await getPicturesFromCar(car.carId);
            const carPictures = carPicturesFromDB.map(picture => picture.url);

            const isLiked = viewerId ? await likesRepository.isCarLiked(viewerId, car.carId) : false;

            wishlist.push(new CarInfo(
                car.carId, car.name, car.color, car.brand,
                car.scale, car.manufacturer, car.condition, car.wished,
                car.description, car.designer, car.series, carPictures, car.country,
                car.rarity, car.quality, car.variety, car.finish,
                car.likesCount || 0, isLiked
            ));
        }
        return wishlist;
    }
}
