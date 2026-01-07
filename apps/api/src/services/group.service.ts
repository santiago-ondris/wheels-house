import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDTO, UserToDB, LoginDTO, LoginResponse, TokenData } from '../dto/user.dto';
import { PublicProfileDTO, PublicCarDTO } from '../dto/public-profile.dto';
import { createUser, getUserFromUsernameOrEmail, getPublicProfileByUsername } from 'src/database/crud/user.crud';
import { getCarsFromUserId, getPicturesFromCar } from 'src/database/crud/car.crud';
import { ERROR_CREATING_USER } from 'src/utils/user.utils';
import { CreateGroupDTO, GroupInfo, GroupToDB } from 'src/dto/group.dto';
import { createGroup, createGroupedCars, getCarsFromGroupId, getGroupById } from 'src/database/crud/group.crud';
import { ERROR_CREATING_GROUP } from 'src/utils/group.utils';
import { CarInfoWoGroups } from 'src/dto/car.dto';

@Injectable()
export class GroupService {
    async createGroupService(groupData: CreateGroupDTO, userData: TokenData) {
        const user = await getUserFromUsernameOrEmail(userData.username);

        const newGroup = new GroupToDB (
            user.userId, groupData.name, groupData.description,
            groupData.picture
        );

        const createdGroup = await createGroup(newGroup);

        if(createdGroup == null) {
            throw ERROR_CREATING_GROUP;
        }

        const newGroupedCars = groupData.cars!.map(carId => {
            return {
                carId: carId,
                groupId: createdGroup.groupId
            };
        });

        const createdGroupedCars = await createGroupedCars(newGroupedCars);

        if(createdGroupedCars == null) {
            throw ERROR_CREATING_GROUP;
        }
    }

    async getGroupService(groupId: number) {
        const group = await getGroupById(groupId);

        const carsFromGroupDB = await getCarsFromGroupId(groupId);

        const carsFromGroup : CarInfoWoGroups[] = [];

        carsFromGroupDB.forEach(async car => {
            const carPicturesFromDB = await getPicturesFromCar(car.carId);
            
            const carPictures = carPicturesFromDB.map(picture => picture.url);

            carsFromGroup.push(new CarInfoWoGroups(
                car.carId, car.name, car.color, car.brand, car.scale, 
                car.manufacturer, car.description, car.designer, car.series, 
                carPictures, car.country
            ));
        });

        return new GroupInfo(
            group.groupId, group.name, carsFromGroup.length, carsFromGroup, 
            group.description, group.picture
        );
    }
}