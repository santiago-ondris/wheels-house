import { Injectable } from '@nestjs/common';
import { TokenData } from '../dto/user.dto';
import { getUserFromUsername } from 'src/database/crud/user.crud';
import { CarInfo, CarToDB, CreateCarDTO } from 'src/dto/car.dto';
import { ERROR_CREATING_CAR } from 'src/utils/car.utils';
import { createCar, getCarsFromUserId } from 'src/database/crud/car.crud';

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

    async listCars(username: string) {
        const user = await getUserFromUsername(username);

        const carsFromDB : CarToDB[] = await getCarsFromUserId(user.userId);

        let listedCars : CarInfo[] = [];

        carsFromDB.forEach(car => {
            listedCars.push(new CarInfo(
                car.name, car.color, car.brand, car.scale, 
                car.manufacturer, car.description, car.designer,
                car.series, car.picture
            ));
        });

        return listedCars; 
    }
}