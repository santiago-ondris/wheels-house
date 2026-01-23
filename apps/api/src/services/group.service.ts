import { Injectable } from '@nestjs/common';
import { TokenData } from '../dto/user.dto';
import { getUserFromUsername } from 'src/database/crud/user.crud';
import { getPicturesFromCar } from 'src/database/crud/car.crud';
import { CreateGroupDTO, GroupInfo, GroupInfoWoCar, GroupToDB, UpdateGroupDTO } from 'src/dto/group.dto';
import { createGroup, createGroupedCars, deleteGroupedCarFromGroupIdAndCarId, deleteGroupedCarsFromGroupId, deleteGroupFromId, getCarsFromGroupId, getGroupedCarsFromGroupId, getGroupFromId, getGroupFromNameAndUserId, getGroupsFromUserId, getFeaturedGroupsFromUserId, countFeaturedGroupsFromUserId, updateGroup } from 'src/database/crud/group.crud';
import { ERROR_CREATING_GROUP, ERROR_DELETING_GROUP, ERROR_UPDATING_GROUP, INEXISTENT_GROUP, MAX_FEATURED_GROUPS, MAX_FEATURED_GROUPS_REACHED } from 'src/utils/group.utils';
import { CarInfoWoGroups } from 'src/dto/car.dto';
import { UploadService } from './upload.service';
import { getPublicIdFromURL } from 'src/utils/upload.utils';
import { EventsService } from '../modules/social/events/events.service';

@Injectable()
export class GroupService {
    constructor(
        private readonly uploadService: UploadService,
        private readonly eventsService: EventsService
    ) { }

    async createGroupService(groupData: CreateGroupDTO, userData: TokenData) {
        const user = await getUserFromUsername(userData.username);

        if (groupData.featured) {
            const featuredCount = await countFeaturedGroupsFromUserId(user.userId);
            if (featuredCount >= MAX_FEATURED_GROUPS) {
                throw MAX_FEATURED_GROUPS_REACHED;
            }
        }

        const createdGroup = await createGroup(new GroupToDB(
            user.userId, groupData.name, groupData.description,
            groupData.picture, groupData.featured, groupData.order
        ));

        if (createdGroup == null) throw ERROR_CREATING_GROUP;

        const newGroupedCars = groupData.cars!.map(carId => ({
            carId: carId,
            groupId: createdGroup.groupId
        }));

        await createGroupedCars(newGroupedCars);

        this.eventsService.emitGroupCreated({
            userId: user.userId,
            groupId: createdGroup.groupId,
            groupName: createdGroup.name,
            groupImage: groupData.picture || undefined,
            carCount: groupData.cars!.length
        });

        return true;
    }

    async getGroupService(groupId: number) {
        const group = await getGroupFromId(groupId);
        const carsFromGroupDB = await getCarsFromGroupId(groupId);
        const carsFromGroup: CarInfoWoGroups[] = [];

        for (const car of carsFromGroupDB) {
            const carPicturesFromDB = await getPicturesFromCar(car.carId);
            carsFromGroup.push(new CarInfoWoGroups(
                car.carId, car.name, car.color, car.brand, car.scale,
                car.manufacturer, car.condition || "", car.description, car.designer, car.series,
                carPicturesFromDB.map(p => p.url), car.country
            ));
        }

        return new GroupInfo(
            group.groupId, group.name, carsFromGroup.length, carsFromGroup,
            group.description, group.picture, group.featured, group.order
        );
    }

    async getGroupByNameService(username: string, groupName: string) {
        const user = await getUserFromUsername(username);
        if (!user) throw INEXISTENT_GROUP;

        const group = await getGroupFromNameAndUserId(groupName, user.userId);
        if (!group) throw INEXISTENT_GROUP;

        const carsFromGroupDB = await getCarsFromGroupId(group.groupId);
        const carsFromGroup: CarInfoWoGroups[] = [];

        for (const car of carsFromGroupDB) {
            const carPicturesFromDB = await getPicturesFromCar(car.carId);
            carsFromGroup.push(new CarInfoWoGroups(
                car.carId, car.name, car.color, car.brand, car.scale,
                car.manufacturer, car.condition || "", car.description, car.designer, car.series,
                carPicturesFromDB.map(p => p.url), car.country
            ));
        }

        return new GroupInfo(
            group.groupId, group.name, carsFromGroup.length, carsFromGroup,
            group.description, group.picture, group.featured, group.order
        );
    }

    async listGroupsService(username: string) {
        const user = await getUserFromUsername(username);
        const groupsFromUserFromDB = await getGroupsFromUserId(user.userId);
        const groupsFromUser: GroupInfoWoCar[] = [];

        for (const group of groupsFromUserFromDB) {
            const totalCars = (await getCarsFromGroupId(group.groupId)).length;
            groupsFromUser.push(new GroupInfoWoCar(
                group.groupId, group.name, totalCars, group.description,
                group.picture, group.featured, group.order
            ));
        }
        return groupsFromUser;
    }

    async listFeaturedGroupsService(username: string) {
        const user = await getUserFromUsername(username);
        const featuredGroupsFromDB = await getFeaturedGroupsFromUserId(user.userId);
        const featuredGroups: GroupInfoWoCar[] = [];

        for (const group of featuredGroupsFromDB) {
            const totalCars = (await getCarsFromGroupId(group.groupId)).length;
            featuredGroups.push(new GroupInfoWoCar(
                group.groupId, group.name, totalCars, group.description,
                group.picture, group.featured, group.order
            ));
        }
        return featuredGroups;
    }

    async updateGroupService(groupId: number, groupChanges: UpdateGroupDTO) {
        const currentGroup = await getGroupFromId(groupId);
        if (groupChanges.featured && !currentGroup.featured) {
            const featuredCount = await countFeaturedGroupsFromUserId(currentGroup.userId);
            if (featuredCount >= MAX_FEATURED_GROUPS) throw MAX_FEATURED_GROUPS_REACHED;
        }

        const updatedGroup = await updateGroup(groupChanges, groupId);
        if (!updatedGroup) throw ERROR_UPDATING_GROUP;

        if (groupChanges.picture && groupChanges.picture != currentGroup.picture) {
            await this.uploadService.deleteImage(getPublicIdFromURL(currentGroup.picture!));
        }

        const groupedCars = await getGroupedCarsFromGroupId(groupId);
        const setGroupedCars = new Set(groupedCars.map(car => car.carId));

        for (const carId of groupChanges.cars!) {
            if (setGroupedCars.has(carId)) {
                setGroupedCars.delete(carId);
            } else {
                if (!(await createGroupedCars({ groupId, carId }))) {
                    throw ERROR_UPDATING_GROUP;
                }
            }
        }

        for (const carId of setGroupedCars) {
            if (!(await deleteGroupedCarFromGroupIdAndCarId(groupId, carId))) {
                throw ERROR_UPDATING_GROUP;
            }
        }

        if (groupChanges.cars && groupChanges.cars.length >= 5) {
            this.eventsService.emitGroupCreated({
                userId: currentGroup.userId,
                groupId,
                groupName: groupChanges.name || currentGroup.name,
                groupImage: groupChanges.picture || currentGroup.picture || undefined,
                carCount: groupChanges.cars.length
            });
        }

        return true;
    }

    async deleteGroupService(groupId: number) {
        if (!(await deleteGroupedCarsFromGroupId(groupId))) {
            throw ERROR_DELETING_GROUP;
        }

        const deletedGroup = await deleteGroupFromId(groupId);
        if (deletedGroup == null) throw ERROR_DELETING_GROUP;

        if (deletedGroup.picture) {
            await this.uploadService.deleteImage(getPublicIdFromURL(deletedGroup.picture!));
        }
        return true;
    }
}