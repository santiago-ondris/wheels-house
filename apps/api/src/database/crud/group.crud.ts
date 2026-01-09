import { db } from '../index'
import { group, groupedCar, user, car } from 'src/database/schema'
import { eq, and, sql, asc, count, desc } from 'drizzle-orm';
import { GroupToDB, UpdateGroupDTO } from 'src/dto/group.dto';


// Create

export async function createGroup(newGroup: GroupToDB) {
    try {
        const createdGroup = await db.insert(group).values(newGroup).returning();
        return createdGroup[0];
    } catch {
        return null;
    }
}

export async function createGroupedCars(newCars) {
    try {
        const createdCars = await db.insert(groupedCar).values(newCars).returning();
        return createdCars;
    } catch {
        return null;
    }
}

// Read

export async function getGroupFromId(groupId: number) {
    const groupObject = await db.select().from(group).where(eq(group.groupId, groupId));

    return groupObject[0];
}

export async function getGroupsFromUserId(userId: number) {
    return await db.select({
        groupId: group.groupId,
        name: group.name,
        description: group.description,
        picture: group.picture,
        featured: group.featured,
        order: group.order,
    }).from(group).where(eq(group.userId, userId)).orderBy(desc(group.featured), desc(group.groupId));
}

export async function getFeaturedGroupsFromUserId(userId: number) {
    return await db.select({
        groupId: group.groupId,
        name: group.name,
        description: group.description,
        picture: group.picture,
        featured: group.featured,
        order: group.order,
    }).from(group).where(and(eq(group.userId, userId), eq(group.featured, true))).orderBy(desc(group.groupId));
}

export async function countFeaturedGroupsFromUserId(userId: number) {
    const result = await db.select({ count: count() }).from(group).where(and(eq(group.userId, userId), eq(group.featured, true)));
    return result[0]?.count ?? 0;
}

export async function getGroupFromNameAndUserId(name: string, userId: number) {
    const groupObject = await db.select().from(group).where(and(eq(group.name, name), eq(group.userId, userId)));

    return groupObject[0];
}

export async function getGroupsFromCarId(carId: number) {
    const groups = await db.select({
        groupId: group.groupId,
        name: group.name,
        description: group.description,
        picture: group.picture,
        featured: group.featured,
        order: group.order,
    }).from(groupedCar).where(eq(groupedCar.carId, carId)).innerJoin(group, eq(group.groupId, groupedCar.groupId));

    return groups;
}

export async function getCarsFromGroupId(groupId: number) {
    const cars = await db.select({
        carId: car.carId,
        name: car.name,
        color: car.color,
        brand: car.brand,
        scale: car.scale,
        manufacturer: car.manufacturer,
        description: car.description,
        designer: car.designer,
        series: car.series,
        country: car.country,
        condition: car.condition,
    }).from(groupedCar).where(eq(groupedCar.groupId, groupId)).innerJoin(car, eq(groupedCar.carId, car.carId));

    return cars;
}

export async function getGroupedCarsFromGroupId(groupId: number) {
    const groupedCars = await db.select({ carId: groupedCar.carId }).from(groupedCar).where(eq(groupedCar.groupId, groupId));

    return groupedCars;
}

// Update

export async function updateGroup(groupChanges: UpdateGroupDTO, groupId: number) {
    try {
        await db.update(group).set({
            name: groupChanges.name,
            description: groupChanges.description!,
            picture: groupChanges.picture!,
            featured: groupChanges.featured,
            order: groupChanges.order,
        }).where(eq(group.groupId, groupId));
        return true;
    } catch {
        return false;
    }
}

// Delete

export async function deleteGroupFromId(groupId: number) {
    try {
        const deletedGroup = await db.delete(group).where(eq(group.groupId, groupId)).returning();
        return deletedGroup[0];
    } catch {
        return null;
    }
}

export async function deleteGroupedCarsFromGroupId(groupId: number) {
    try {
        await db.delete(groupedCar).where(eq(groupedCar.groupId, groupId));
        return true;
    } catch {
        return false;
    }
}

export async function deleteGroupedCarFromGroupIdAndCarId(groupId: number, carId: number) {
    try {
        await db.delete(groupedCar).where(and(eq(groupedCar.groupId, groupId), eq(groupedCar.carId, carId)));
        return true;
    } catch {
        return false;
    }
}

export async function deleteGroupedCarsFromCarId(carId: number) {
    try {
        await db.delete(groupedCar).where(eq(groupedCar.carId, carId));
        return true;
    } catch {
        return false;
    }
}