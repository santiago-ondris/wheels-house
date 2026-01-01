import { Injectable } from '@nestjs/common';
import { TokenData } from '../dto/user.dto';
import { getUserFromUsername } from 'src/database/crud/user.crud';
import { CarToDB, CreateCarDTO } from 'src/dto/car.dto';
import { ERROR_CREATING_CAR } from 'src/utils/car.utils';
import { createCar } from 'src/database/crud/car.crud';

@Injectable()
export class CarService {
    async createCarService(carData: CreateCarDTO, userData: TokenData) {
        const user = await getUserFromUsername(userData.username);

        const newCar : CarToDB = new CarToDB();

        const created = await createCar(newCar);

        if(!created) {
            throw ERROR_CREATING_CAR;
        }

        return true;
    }
}