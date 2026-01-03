import { Injectable } from '@nestjs/common';
import { TokenData } from '../dto/user.dto';
import { getUserFromUsername } from 'src/database/crud/user.crud';
import { CarInfo, CarToDB, CarUpdateDTO, CreateCarDTO } from 'src/dto/car.dto';
import { ERROR_CREATING_CAR, ERROR_DELETING_CAR, ERROR_UPDATING_CAR } from 'src/utils/car.utils';
import { createCar, deleteCarById, getCarById, getCarsFromUserId, updateCar } from 'src/database/crud/car.crud';

@Injectable()
export class CarService {
    async createCarService(carData: CreateCarDTO, userData: TokenData) {
        const user = await getUserFromUsername(userData.username);

        const newCar : CarToDB = new CarToDB(
            user.userId, carData.name, carData.color, carData.brand,
            carData.scale, carData.manufacturer, carData.description,
            carData.designer, carData.series, carData.picture
        );

        const created = await createCar(newCar);

        if(!created) {
            throw ERROR_CREATING_CAR;
        }

        return true;
    }

    async listCarsService(username: string) {
        const user = await getUserFromUsername(username);

        const listedCars : CarInfo[] = await getCarsFromUserId(user.userId);

        return listedCars;
    }

    async getCarService(carId: number) {
        const car : CarInfo = await getCarById(carId);

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