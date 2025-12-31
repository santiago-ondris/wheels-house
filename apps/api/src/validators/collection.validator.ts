import { getCollectionFromNameAndUserId } from "src/database/crud/collection.crud";
import { getUserFromUsername } from "src/database/crud/user.crud";
import { CreateCollectionDTO } from "src/dto/collection.dto";
import { TokenData } from "src/dto/user.dto";
import { COLLECTION_NAME_ALREADY_IN_USE } from "src/utils/collection.utils";

export async function createCollectionValidator(collectionData: CreateCollectionDTO, userData: TokenData) {
    const user = await getUserFromUsername(userData.username);

    const collectionFromNameAndUser = await getCollectionFromNameAndUserId(collectionData.name, user.userId);

    if(collectionFromNameAndUser != null) {
        throw COLLECTION_NAME_ALREADY_IN_USE;
    }
}