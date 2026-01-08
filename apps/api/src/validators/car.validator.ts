import { getCarById } from "src/database/crud/car.crud";
import { getGroupFromId } from "src/database/crud/group.crud";
import { getUserFromUsername } from "src/database/crud/user.crud";
import { CarUpdateDTO, CreateCarDTO } from "src/dto/car.dto";
import { TokenData } from "src/dto/user.dto";
import { CAR_DO_NOT_BELONG_TO_USER, CAR_PICTURE_FORMAT_NOT_VALID, INEXISTENT_CAR, MAX_CARS_PICTURES_LIMIT, validCarPicture } from "src/utils/car.utils";
import { GROUP_DO_NOT_BELONG_TO_USER } from "src/utils/group.utils";
import { INEXISTENT_USER } from "src/utils/user.utils";

export async function createCarValidator(carData: CreateCarDTO, userData: TokenData) {
    // did not define a uniqueness constraint yet.

    if(carData.pictures!.length > 10) {
        throw MAX_CARS_PICTURES_LIMIT;
    }

    carData.pictures!.forEach(url => {
        if(!validCarPicture(url)) {
            throw CAR_PICTURE_FORMAT_NOT_VALID;
        }
    });
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

    if(carChanges.pictures!.length > 10) {
        throw MAX_CARS_PICTURES_LIMIT;
    }

    carChanges.pictures!.forEach(url => {
        if(!validCarPicture(url)) {
            throw CAR_PICTURE_FORMAT_NOT_VALID;
        }
    });
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

export async function updateCarGroupsValidator(userData: TokenData, carId: number, groupsId: number[]) {
    const user = await getUserFromUsername(userData.username);

    const car = await getCarById(carId);

    if(car == null) {
        throw INEXISTENT_CAR;
    }

    if(car.userId != user.userId) {
        throw CAR_DO_NOT_BELONG_TO_USER;
    }

    for(const groupId of groupsId) {
        const group = await getGroupFromId(groupId);
    
        if(group.userId != user.userId) {
            throw GROUP_DO_NOT_BELONG_TO_USER;
        }
    }
}