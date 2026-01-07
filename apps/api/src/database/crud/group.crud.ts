import { db } from '../index'
import { group, groupedCar, user, car } from 'src/database/schema'
import { eq, and } from 'drizzle-orm';
import { GroupToDB } from 'src/dto/group.dto';


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

export async function groupFromNameAndUserId(name: string, userId: number) {
    const groupObject = await db.select().from(group).where(and(eq(group.name, name), eq(group.userId, userId)));
    
    return groupObject[0];
}

export async function groupsFromCarId(carId: number) {
    const groups = await db.select({
        groupId: group.groupId,
        name: group.name,
        description: group.description,
        picture: group.picture
    }).from(groupedCar).where(eq(groupedCar.carId, carId)).innerJoin(group, eq(group.groupId, groupedCar.groupId));

    return groups;
}

export async function carsFromGroupId(groupId: number) {
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
    }).from(groupedCar).where(eq(groupedCar.groupId, groupId)).innerJoin(car,eq(groupedCar.carId, car.carId));

    return cars;
}