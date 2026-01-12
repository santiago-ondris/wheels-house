import { BadRequestException } from "@nestjs/common";
import { getCarById, getCarIdsFromUserIdWithFilter } from "src/database/crud/car.crud";
import { getGroupFromId } from "src/database/crud/group.crud";
import { getUserFromUsername } from "src/database/crud/user.crud";
import { CarUpdateDTO, CreateCarDTO } from "src/dto/car.dto";
import { BulkAddToGroupDTO } from "src/dto/collection-query.dto";
import { TokenData } from "src/dto/user.dto";
import { CAR_ALREADY_OWNED, CAR_DO_NOT_BELONG_TO_USER, CAR_PICTURE_FORMAT_NOT_VALID, INEXISTENT_CAR, MAX_CARS_PICTURES_LIMIT, validCarPicture, WISHED_CAR_CAN_NOT_BE_IN_GROUP } from "src/utils/car.utils";
import { GROUP_DO_NOT_BELONG_TO_USER, INEXISTENT_GROUP } from "src/utils/group.utils";
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

    if (carData.wished && carData.groups!.length > 0) {
        throw WISHED_CAR_CAN_NOT_BE_IN_GROUP;
    }
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

    if (carChanges.wished && carChanges.groups!.length > 0) {
        throw WISHED_CAR_CAN_NOT_BE_IN_GROUP;
    }

    for (const groupId of carChanges.groups!) {
        const group = await getGroupFromId(groupId);
    
        if(group.userId != user.userId) {
            throw GROUP_DO_NOT_BELONG_TO_USER;
        }
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

    if (car.wished && groupsId.length > 0) {
        throw WISHED_CAR_CAN_NOT_BE_IN_GROUP;
    }
}

export async function bulkAddToGroupValidator(userData: TokenData, bulkAddData: BulkAddToGroupDTO) {
    const user = await getUserFromUsername(userData.username);
    
    let targetCarIds: number[] = [];

    if (bulkAddData.carIds && bulkAddData.carIds.length > 0) {
        // Use provided IDs directly
        targetCarIds = bulkAddData.carIds;
    } else if (bulkAddData.filterQuery) {
        // Get IDs from filter (Option A)
        targetCarIds = await getCarIdsFromUserIdWithFilter(user.userId, bulkAddData.filterQuery);
    }

    for(const carId of targetCarIds) {
        const car = await getCarById(carId);

        if (car.userId != user.userId) {
            throw CAR_DO_NOT_BELONG_TO_USER;
        }

        if (car.wished) {
            throw WISHED_CAR_CAN_NOT_BE_IN_GROUP;
        }
    }

    const group = await getGroupFromId(bulkAddData.groupId);

    if (group == null) {
        throw INEXISTENT_GROUP;
    }

    if (group.userId != user.userId) {
        throw GROUP_DO_NOT_BELONG_TO_USER;
    }
}


export async function wishedCarToCollectionValidator(userData: TokenData, carId: number, carChanges: CarUpdateDTO) {
    const car = await getCarById(carId);
    
    if (car == null) {
        throw INEXISTENT_CAR;
    }

    if (!car.wished) {
        throw CAR_ALREADY_OWNED;
    }

    const user = await getUserFromUsername(userData.username);

    if (car.userId != user.userId) {
        throw CAR_DO_NOT_BELONG_TO_USER;
    }

    if (carChanges.pictures!.length > 10) {
        throw MAX_CARS_PICTURES_LIMIT;
    }

    carChanges.pictures!.forEach(url => {
        if(!validCarPicture(url)) {
            throw CAR_PICTURE_FORMAT_NOT_VALID;
        }
    });

    if (carChanges.wished) {
        throw new BadRequestException('car should be set to not wished anymore.');
    }

    for (const groupId of carChanges.groups!) {
        const group = await getGroupFromId(groupId);
    
        if (group.userId != user.userId) {
            throw GROUP_DO_NOT_BELONG_TO_USER;
        }
    }
}

export async function getWishlistValidator(username: string) {
    const user = await getUserFromUsername(username);

    if (user == null) {
        throw INEXISTENT_USER;
    }
}