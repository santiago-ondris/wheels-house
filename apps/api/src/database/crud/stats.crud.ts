import { db } from "../index";
import { car, groupedCar, user } from "../schema";
import { eq, sql } from 'drizzle-orm';

export async function getCarsForStats(userId: number) {
    const result = await db
        .select({
            carId: car.carId,
            brand: car.brand,
            manufacturer: car.manufacturer,
            scale: car.scale,
            color: car.color,
            condition: car.condition,
            country: car.country,
            isInGroup: sql<boolean>`EXISTS (SELECT 1 FROM ${groupedCar} WHERE ${groupedCar.carId} = ${car.carId})`
        })
        .from(car)
        .where(eq(car.userId, userId));

    return result;
}
