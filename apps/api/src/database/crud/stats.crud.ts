import { db } from "../index";
import { car, carPicture } from "../schema";
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
