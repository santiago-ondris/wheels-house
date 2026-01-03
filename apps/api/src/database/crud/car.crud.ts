import { CarToDB, CarUpdateDTO } from "src/dto/car.dto";
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

export async function getCarById(carId: number) {
    // carObject is an array of length 1 (or 0).
    const carObject = await db.select().from(car).where(eq(car.carId, carId));

    return carObject[0];
}

export async function getCarsFromUserId(userId: number) {
    return await db.select().from(car).where(eq(car.userId, userId));
}

// Update

export async function updateCar(carChanges: CarUpdateDTO, carId: number) {
    try {
        await db.update(car).set(carChanges).where(eq(car.carId, carId));
        return true;
    } catch {
        return false;
    }
}

// Delete

export async function deleteCarById(carId: number) {
    try {
        await db.delete(car).where(eq(car.carId, carId));
        return true;
    } catch {
        return false;
    }
}