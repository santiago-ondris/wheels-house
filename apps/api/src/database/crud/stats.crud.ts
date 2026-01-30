import { db } from "../index";
import { car, carPicture, user } from "../schema";
import { eq, sql, and } from 'drizzle-orm';

export async function getCarsForStats(userId: number) {
    const result = await db
        .select({
            carId: car.carId,
            brand: car.brand,
            manufacturer: car.manufacturer,
            scale: car.scale,
            color: car.color,
            condition: car.condition,
            country: car.country
        })
        .from(car)
        .where(and(eq(car.userId, userId), eq(car.wished, false)));

    return result;
}

export async function getTotalPhotosCount(userId: number) {
    const result = await db
        .select({
            count: sql<number>`cast(count(${carPicture.carPictureId}) as int)`
        })
        .from(carPicture)
        .innerJoin(car, eq(car.carId, carPicture.carId))
        .where(and(eq(car.userId, userId), eq(car.wished, false)));

    return result[0]?.count || 0;
}

export async function getGlobalStatsCounts() {
    const [userCount] = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(user);
    const [carCount] = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(car).where(eq(car.wished, false));
    const [photoCount] = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(carPicture);

    return {
        totalUsers: userCount?.count || 0,
        totalCars: carCount?.count || 0,
        totalPhotos: photoCount?.count || 0
    };
}
