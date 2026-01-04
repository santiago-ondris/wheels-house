import { Injectable } from '@nestjs/common';
import { TokenData } from '../dto/user.dto';
import { getUserFromUsername } from 'src/database/crud/user.crud';
import { CarInfo, CarPictureToDB, CarToDB, CarUpdateDTO, CreateCarDTO } from 'src/dto/car.dto';
import { ERROR_CREATING_CAR, ERROR_DELETING_CAR, ERROR_UPDATING_CAR } from 'src/utils/car.utils';
import { createCar, deleteCarById, getCarById, getCarsFromUserId, updateCar, createCarPicture, getPicturesFromCar } from 'src/database/crud/car.crud';

@Injectable()
export class CarService {
    async createCarService(carData: CreateCarDTO, userData: TokenData) {
        const user = await getUserFromUsername(userData.username);

        const newCar : CarToDB = new CarToDB(
            user.userId, carData.name, carData.color, carData.brand,
            carData.scale, carData.manufacturer, carData.description,
            carData.designer, carData.series, carData.country
        );

        const createdCar = await createCar(newCar);

        if(!createdCar) {
            throw ERROR_CREATING_CAR;
        }

        for(let idx = 0; idx < carData.pictures!.length; ++idx){
            const newCarPicture = new CarPictureToDB(
                carData.pictures![idx],
                createdCar.carId,
                idx
            );

            const createdPicture = await createCarPicture(newCarPicture);

            if(!createdPicture) {
                throw ERROR_CREATING_CAR;
            }
        }

        return true;
    }

    async listCarsService(username: string) {
        const user = await getUserFromUsername(username);

        const carsFromDB = await getCarsFromUserId(user.userId);

        let listedCars: CarInfo[] = [];

        carsFromDB.forEach(async (car) => {
            const carPicturesFromDB = await getPicturesFromCar(car.carId);

            let carPicturesURLs : string[] = [];
            carPicturesFromDB.forEach(picture => {
                carPicturesURLs.push(picture.url);
            });

            listedCars.push(new CarInfo(
                car.carId, car.name, car.color, car.brand,
                car.scale, car.manufacturer, car.description, 
                car.designer, car.series, carPicturesURLs, car.country
            ));
        });

        return listedCars;
    }

    async getCarService(carId: number) {
        const carFromDB = await getCarById(carId);

        const carPicturesFromDB = await getPicturesFromCar(carFromDB.carId);

        let carPicturesURLs : string[] = [];
        carPicturesFromDB.forEach(picture => {
            carPicturesURLs.push(picture.url);
        });

        const car : CarInfo = new CarInfo(
            carFromDB.carId, carFromDB.name, carFromDB.color, carFromDB.brand,
            carFromDB.scale, carFromDB.manufacturer, carFromDB.description, 
            carFromDB.designer, carFromDB.series, carPicturesURLs, carFromDB.country
        );

        return car;
    }

    async updateCarService(carChanges: CarUpdateDTO, carId: number) {
        const updated = await updateCar(carChanges, carId);

        if (!updated) {
            throw ERROR_UPDATING_CAR;
        }

        return true;
    }

    async deleteCarService(carId: number) {
        const deleted = deleteCarById(carId);

        if(!deleted) {
            throw ERROR_DELETING_CAR;
        }

        return true;
    }
}