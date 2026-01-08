import { Injectable } from '@nestjs/common';
import { TokenData } from '../dto/user.dto';
import { getUserFromUsernameOrEmail } from 'src/database/crud/user.crud';
import { getPicturesFromCar } from 'src/database/crud/car.crud';
import { CreateGroupDTO, GroupInfo, GroupInfoWoCar, GroupToDB, UpdateGroupDTO } from 'src/dto/group.dto';
import { createGroup, createGroupedCars, deleteGroupedCarFromGroupIdAndCarId, deleteGroupedCarsFromGroupId, deleteGroupFromId, getCarsFromGroupId, getGroupedCarsFromGroupId, getGroupFromId, getGroupsFromUserId, updateGroup } from 'src/database/crud/group.crud';
import { ERROR_CREATING_GROUP, ERROR_DELETING_GROUP, ERROR_UPDATING_GROUP } from 'src/utils/group.utils';
import { CarInfoWoGroups } from 'src/dto/car.dto';
import { groupedCar } from 'src/database/schema';

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

        if(groupData.cars!.length > 0 && createdGroupedCars == null) {
            throw ERROR_CREATING_GROUP;
        }
        
        return true;
    }

    async getGroupService(groupId: number) {
        const group = await getGroupFromId(groupId);

        const carsFromGroupDB = await getCarsFromGroupId(groupId);

        const carsFromGroup : CarInfoWoGroups[] = [];

        for (const car of carsFromGroupDB) {
            const carPicturesFromDB = await getPicturesFromCar(car.carId);
            
            const carPictures = carPicturesFromDB.map(picture => picture.url);

            carsFromGroup.push(new CarInfoWoGroups(
                car.carId, car.name, car.color, car.brand, car.scale, 
                car.manufacturer, car.description, car.designer, car.series, 
                carPictures, car.country
            ));
        }

        return new GroupInfo(
            group.groupId, group.name, carsFromGroup.length, carsFromGroup, 
            group.description, group.picture
        );
    }

    async listGroupsService(username: string) {
        const user = await getUserFromUsernameOrEmail(username);

        const groupsFromUserFromDB = await getGroupsFromUserId(user.userId);
 
        const groupsFromUser : GroupInfoWoCar[] = [];
        
        for(const group of groupsFromUserFromDB) {
            const totalCars = (await getCarsFromGroupId(group.groupId)).length;
            groupsFromUser.push(new GroupInfoWoCar(
                group.groupId, group.name, totalCars, group.description, 
                group.picture
            ));
        }

        return groupsFromUser;
    }

    async updateGroupService(groupId: number, groupChanges: UpdateGroupDTO) {
        const updatedGroup = await updateGroup(groupChanges, groupId);

        console.log("ACA");

        if(!updatedGroup) {
            throw ERROR_UPDATING_GROUP;
        }

        console.log("ARAFUE");


        const groupedCars = await getGroupedCarsFromGroupId(groupId);

        const setGroupedCars = new Set(groupedCars.map(car => car.carId));

        console.log(setGroupedCars);

        for(const carId of groupChanges.cars!) {
            if(setGroupedCars.has(carId)) {
                setGroupedCars.delete(carId);
            } else {
                const createdGroupedCar = await createGroupedCars({groupId: groupId, carId: carId});

                // console.log("ATRODEN", setGroupedCars.has({carId: carId}));

                if(createdGroupedCar == null) {
                    throw ERROR_UPDATING_GROUP;
                }
            }
        }

        for(const car of setGroupedCars) {
            const deletedGroupedCar = await deleteGroupedCarFromGroupIdAndCarId(groupId, car);

            if(!deletedGroupedCar) {
                throw ERROR_UPDATING_GROUP;
            }
        }

        return true;
    }

    async deleteGroupService(groupId: number) {
        const deletedGroup = await deleteGroupFromId(groupId);

        if(!deletedGroup) {
            throw ERROR_DELETING_GROUP;
        }

        const deletedGroupedCars = await deleteGroupedCarsFromGroupId(groupId);

        if(!deletedGroupedCars) {
            throw ERROR_DELETING_GROUP;
        }

        return true;
    }
}