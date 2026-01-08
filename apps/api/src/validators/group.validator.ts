import { getCarById } from "src/database/crud/car.crud";
import { getGroupFromId, getGroupFromNameAndUserId } from "src/database/crud/group.crud";
import { getUserFromUsername } from "src/database/crud/user.crud";
import { CreateGroupDTO, UpdateGroupDTO } from "src/dto/group.dto";
import { TokenData } from "src/dto/user.dto";
import { CAR_DO_NOT_BELONG_TO_USER, INEXISTENT_CAR } from "src/utils/car.utils";
import { DESCRIPTION_MAX_LENGTH, DESCRIPTION_TOO_LONG, DUPLICATED_CAR, GROUP_DO_NOT_BELONG_TO_USER, GROUP_NAME_IN_USE, GROUP_PICTURE_FORMAT_NOT_VALID, 
    INEXISTENT_GROUP, 
    NAME_MAX_LENGTH, NAME_TOO_LONG, validGroupPicture } from "src/utils/group.utils";
import { INEXISTENT_USER } from "src/utils/user.utils";

export async function createGroupValidator(groupData: CreateGroupDTO, userData: TokenData) {
    const user = await getUserFromUsername(userData.username);

    if(!user) {
        throw INEXISTENT_USER;
    }

    const group = await getGroupFromNameAndUserId(groupData.name, user.userId);

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

    const withoutDuplicate = [...new Set(groupData.cars!)];

    console.log(groupData.cars!, " anddd ", withoutDuplicate);

    if(withoutDuplicate.length != groupData.cars!.length) {
        throw DUPLICATED_CAR;
    }

    for(const car of groupData.cars!) {
        const carFromDB = await getCarById(car);

        if(carFromDB == null) {
            throw INEXISTENT_CAR;
        }
        
        if(carFromDB.userId != user.userId) {
            throw CAR_DO_NOT_BELONG_TO_USER;
        }
    }
}

export async function getGroupValidator(groupId: number) {
    const group = await getGroupFromId(groupId);

    if(group == null) {
        throw INEXISTENT_GROUP;
    }
}

export async function listGroupsValidator(username: string) {
    const user = await getUserFromUsername(username);

    if(user == null) {
        throw INEXISTENT_USER;
    }
}

export async function updateGroupValidator(userData: TokenData, groupId: number, groupChanges: UpdateGroupDTO) {
    const user = await getUserFromUsername(userData.username);

    const group = await getGroupFromId(groupId);

    if(group == null) {
        throw INEXISTENT_GROUP;
    }

    const groupWithName = await getGroupFromNameAndUserId(groupChanges.name, user.userId);

    if(groupWithName != null && group.name != groupChanges.name) {
        throw GROUP_NAME_IN_USE;
    }

    if(groupChanges.name.length > NAME_MAX_LENGTH) {
        throw NAME_TOO_LONG;
    }

    if(groupChanges.description!.length > DESCRIPTION_MAX_LENGTH) {
        throw DESCRIPTION_TOO_LONG;
    }

    if(!validGroupPicture(groupChanges.picture!)) {
        throw GROUP_PICTURE_FORMAT_NOT_VALID;
    }

    const withoutDuplicate = [...new Set(groupChanges.cars!)];

    console.log(groupChanges.cars!, " anddd ", withoutDuplicate);

    if(withoutDuplicate.length != groupChanges.cars!.length) {
        throw DUPLICATED_CAR;
    }

    for(const car of groupChanges.cars!) {
        const carFromDB = await getCarById(car);

        if(carFromDB == null) {
            throw INEXISTENT_CAR;
        }
        
        if(carFromDB.userId != user.userId) {
            throw CAR_DO_NOT_BELONG_TO_USER;
        }
    }
}


export async function deleteGroupValidator(userData: TokenData, groupId: number) {
    const user = await getUserFromUsername(userData.username);

    const group = await getGroupFromId(groupId);

    if(group == null) {
        throw INEXISTENT_GROUP;
    }

    if(group.userId != user.userId) {
        throw GROUP_DO_NOT_BELONG_TO_USER;
    }
}