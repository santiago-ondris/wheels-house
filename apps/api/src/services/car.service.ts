import { Injectable } from '@nestjs/common';
import { TokenData } from '../dto/user.dto';
import { getUserFromUsername } from 'src/database/crud/user.crud';
import { CarInfo, CarInfoWithOwner, CarPictureToDB, CarToDB, CarUpdateDTO, CreateCarDTO } from 'src/dto/car.dto';
import { ERROR_CREATING_CAR, ERROR_DELETING_CAR, ERROR_UPDATING_CAR } from 'src/utils/car.utils';
import {
    createCar, deleteCar, getCarByIdWithOwner, getCarsFromUserId, updateCar, createCarPicture, getPicturesFromCar,
    deleteAllCarPictures, deleteCarPicture, updateCarPicture, getTotalCarsCount, getCarByOffset, getUniqueCarValues
} from 'src/database/crud/car.crud';
import { createGroupedCars, deleteGroupedCarsFromCarId, getGroupsFromCarId } from 'src/database/crud/group.crud';
import { UploadService } from './upload.service';
import { getPublicIdFromURL } from 'src/utils/upload.utils';

@Injectable()
export class CarService {
    constructor(private readonly uploadService: UploadService) { }

    async createCarService(carData: CreateCarDTO, userData: TokenData) {
        const user = await getUserFromUsername(userData.username);

        const newCar: CarToDB = new CarToDB(
            user.userId, carData.name, carData.color, carData.brand,
            carData.scale, carData.manufacturer, carData.condition, carData.description,
            carData.designer, carData.series, carData.country
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

        return createdCar.carId;
    }

    async listCarsService(username: string) {
        const user = await getUserFromUsername(username);

        const carsFromDB = await getCarsFromUserId(user.userId);

        let listedCars: CarInfo[] = [];

        for (const car of carsFromDB) {
            const carPicturesFromDB = await getPicturesFromCar(car.carId);

            const carPictures = carPicturesFromDB.map(picture => picture.url);

            listedCars.push(new CarInfo(
                car.carId, car.name, car.color, car.brand,
                car.scale, car.manufacturer, car.condition || "", car.description,
                car.designer, car.series, carPictures, car.country
            ));
        }

        return listedCars;
    }

    async getCarService(carId: number) {
        const carFromDB = await getCarByIdWithOwner(carId);

        const carPicturesFromDB = await getPicturesFromCar(carFromDB.carId);

        const carPicturesURLs = carPicturesFromDB.map(picture => picture.url);

        const car: CarInfoWithOwner = new CarInfoWithOwner(
            carFromDB.carId, carFromDB.name, carFromDB.color, carFromDB.brand,
            carFromDB.scale, carFromDB.manufacturer, carFromDB.condition || "", carFromDB.ownerUsername,
            carFromDB.description, carFromDB.designer, carFromDB.series,
            carPicturesURLs, carFromDB.country
        );

        return car;
    }

    async updateCarService(carChanges: CarUpdateDTO, carId: number) {
        const carUpdated = await updateCar(carChanges, carId);

        if (!carUpdated) {
            throw ERROR_UPDATING_CAR;
        }

        const carPicturesFromDB = await getPicturesFromCar(carId);

        for (let idx = 0; idx < Math.min(carChanges.pictures!.length, carPicturesFromDB.length); ++idx) {
            if (carChanges.pictures![idx] == carPicturesFromDB[idx].url) continue;

            const pictureUpdated = await updateCarPicture(new CarPictureToDB(
                carChanges.pictures![idx],
                carId,
                idx
            ), carPicturesFromDB[idx].carPictureId);

            if (!pictureUpdated) {
                throw ERROR_UPDATING_CAR;
            }

            // URL not used anymore.
            await this.uploadService.deleteImage(getPublicIdFromURL(carPicturesFromDB[idx].url));
        }

        if (carChanges.pictures!.length > carPicturesFromDB.length) {
            for (let idx = carPicturesFromDB.length; idx < carChanges.pictures!.length; ++idx) {
                const newCarPicture = new CarPictureToDB(
                    carChanges.pictures![idx],
                    carId,
                    idx
                );

                const createdPicture = await createCarPicture(newCarPicture);

                if (!createdPicture) {
                    throw ERROR_UPDATING_CAR;
                }
            }
        } else if (carChanges.pictures!.length < carPicturesFromDB.length) {
            for (let idx = carChanges.pictures!.length; idx < carPicturesFromDB.length; ++idx) {
                const pictureDeleted = await deleteCarPicture(carPicturesFromDB[idx].carPictureId);

                if (pictureDeleted == null) {
                    throw ERROR_UPDATING_CAR;
                }

                await this.uploadService.deleteImage(getPublicIdFromURL(pictureDeleted.url));
            }
        }

        return true;
    }

    async deleteCarService(carId: number) {
        const groupedCarDeleted = await deleteGroupedCarsFromCarId(carId);

        const picturesDeleted = await deleteAllCarPictures(carId);

        const carDeleted = await deleteCar(carId);

        if (!carDeleted || (picturesDeleted == null) || !groupedCarDeleted) {
            throw ERROR_DELETING_CAR;
        }

        for(const picture of picturesDeleted) {
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

    async getFeaturedCarService() {
        const totalCars = await getTotalCarsCount();
        if (totalCars === 0) return null;

        // empieza el 1 de enero del 25
        const epoch = new Date('2025-01-01T00:00:00Z').getTime();
        const now = new Date().getTime();
        const daysSinceEpoch = Math.floor((now - epoch) / (1000 * 60 * 60 * 24));

        const offset = daysSinceEpoch % totalCars;
        const carFromDB = await getCarByOffset(offset);

        if (!carFromDB) return null;

        const carPicturesFromDB = await getPicturesFromCar(carFromDB.carId);
        const carPicturesURLs = carPicturesFromDB.map(picture => picture.url);

        return new CarInfoWithOwner(
            carFromDB.carId, carFromDB.name, carFromDB.color, carFromDB.brand,
            carFromDB.scale, carFromDB.manufacturer, carFromDB.condition || "", carFromDB.ownerUsername,
            carFromDB.description, carFromDB.designer, carFromDB.series,
            carPicturesURLs, carFromDB.country
        );
    }

    async updateCarGroupsService(carId: number, groupIds: number[]) {
        // Remove car from all current groups
        await deleteGroupedCarsFromCarId(carId);

        // Add car to new groups
        for (const groupId of groupIds) {
            await createGroupedCars({ groupId, carId });
        }

        return true;
    }

    async getCarGroupsService(carId: number) {
        const groups = await getGroupsFromCarId(carId);
        return groups.map(g => g.groupId);
    }
}