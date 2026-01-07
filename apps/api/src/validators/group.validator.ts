import { getCarById } from "src/database/crud/car.crud";
import { groupFromNameAndUserId } from "src/database/crud/group.crud";
import { getUserFromUsername } from "src/database/crud/user.crud";
import { CreateGroupDTO } from "src/dto/group.dto";
import { TokenData } from "src/dto/user.dto";
import { CAR_DO_NOT_BELONG_TO_USER, INEXISTENT_CAR } from "src/utils/car.utils";
import { DESCRIPTION_MAX_LENGTH, DESCRIPTION_TOO_LONG, GROUP_NAME_IN_USE, GROUP_PICTURE_FORMAT_NOT_VALID, 
    NAME_MAX_LENGTH, NAME_TOO_LONG, validGroupPicture } from "src/utils/group.utils";
import { INEXISTENT_USER } from "src/utils/user.utils";

export async function createGroupValidator(groupData: CreateGroupDTO, userData: TokenData) {
    const user = await getUserFromUsername(userData.username);

    if(!user) {
        throw INEXISTENT_USER;
    }

    const group = groupFromNameAndUserId(groupData.name, user.userId);

    if(group != null) {
        throw GROUP_NAME_IN_USE;
    }

    if(groupData.name.length > NAME_MAX_LENGTH) {
        throw NAME_TOO_LONG;
    }

    if(groupData.description!.length > DESCRIPTION_MAX_LENGTH) {
        throw DESCRIPTION_TOO_LONG;
    }

    if(!validGroupPicture(groupData.picture!)) {
        throw GROUP_PICTURE_FORMAT_NOT_VALID;
    }

    groupData.cars!.forEach(async (car) => {
        const carFromDB = await getCarById(car);

        if(carFromDB == null) {
            throw INEXISTENT_CAR;
        }
        
        if(carFromDB.userId != user.userId) {
            throw CAR_DO_NOT_BELONG_TO_USER;
        }
    });
}

