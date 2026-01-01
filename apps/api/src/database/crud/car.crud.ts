import { CarToDB } from "src/dto/car.dto";
import { db } from "../index";
import { car } from "../schema";
import { eq } from 'drizzle-orm';

// Create

export async function createCar(newCar: CarToDB) {
    try {
        await db.insert(car).values(newCar);
        return true;
    } catch {
        return false;
    }
}

// Read

export async function getCarsFromUserId(userId: number) {
    return await db.select().from(car).where(eq(car.userId, userId));
}