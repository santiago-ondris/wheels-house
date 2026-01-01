import { getUserFromUsername } from "src/database/crud/user.crud";
import { CreateCarDTO } from "src/dto/car.dto";
import { TokenData } from "src/dto/user.dto";
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