import { getCarById } from "src/database/crud/car.crud";
import { getUserFromUsername } from "src/database/crud/user.crud";
import { CarUpdateDTO, CreateCarDTO } from "src/dto/car.dto";
import { TokenData } from "src/dto/user.dto";
import { CAR_DO_NOT_BELONG_TO_USER, INEXISTENT_CAR } from "src/utils/car.utils";
import { INEXISTENT_USER } from "src/utils/user.utils";

export async function createCarValidator(carData: CreateCarDTO, userData: TokenData) {
    // did not define a uniqueness constraint yet.
}

// Validator from endpoint listCars, list cars from user 'username'. 
// requestUserData has the data from the user asking for the list.
export async function listCarsValidator(requestUserData: TokenData, username: string) {
    const user = await getUserFromUsername(username);

    if(user == null){
        throw INEXISTENT_USER;
    }
}

export async function getCarValidator(requestUserData: TokenData, carId: number) {
    const car = await getCarById(carId);

    if(car == null) {
        throw INEXISTENT_CAR;
    }
}

export async function updateCarValidator(requestUserData: TokenData, carChanges: CarUpdateDTO, carId: number) {
    const user = await getUserFromUsername(requestUserData.username);

    const car = await getCarById(carId);

    if(car == null) {
        throw INEXISTENT_CAR;
    }

    if(car.userId != user.userId) {
        throw CAR_DO_NOT_BELONG_TO_USER;
    }
}

export async function deleteCarValidator(requestUserData: TokenData, carId: number) {
    const user = await getUserFromUsername(requestUserData.username);

    const car = await getCarById(carId);

    if(car == null) {
        throw INEXISTENT_CAR;
    }

    if(car.userId != user.userId) {
        throw CAR_DO_NOT_BELONG_TO_USER;
    }
}