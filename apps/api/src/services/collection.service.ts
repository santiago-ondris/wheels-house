import { Injectable } from '@nestjs/common';
import { TokenData } from '../dto/user.dto';
import { CreateCollectionDTO } from 'src/dto/collection.dto';
import { getUserFromUsername } from 'src/database/crud/user.crud';
import { createCollection } from 'src/database/crud/collection.crud';
import { ERROR_CREATING_COLLECTION } from 'src/utils/collection.utils';

@Injectable()
export class CollectionService {
    async createCollectionService(collectionData: CreateCollectionDTO, userData: TokenData) {
        const user = await getUserFromUsername(userData.username);

        if(!createCollection(collectionData, user.userId)) {
            throw ERROR_CREATING_COLLECTION;
        }

        return true;
    }
}