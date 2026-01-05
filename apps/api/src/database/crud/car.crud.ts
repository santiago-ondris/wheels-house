import { CarPictureToDB, CarToDB, CarUpdateDTO } from "src/dto/car.dto";
import { db } from "../index";
import { car, carPicture } from "../schema";
import { eq } from 'drizzle-orm';

// Create

export async function createCar(newCar: CarToDB) {
    try {
        const createdCar = await db.insert(car).values(newCar).returning();
        return createdCar[0];
    } catch {
        return null;
    }
}

export async function createCarPicture(newCarPicture: CarPictureToDB) {
    try {
        const createdPicture = await db.insert(carPicture).values(newCarPicture).returning();
        return createdPicture[0];
    } catch {
        return null;
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

export async function getPicturesFromCar(carId: number) {
    return await db.select().from(carPicture).where(eq(carPicture.carId, carId)).orderBy(carPicture.index);
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

export async function updateCarPicture(carPictureData: CarPictureToDB, carPictureId: number) {
    try {
        await db.update(carPicture).set(carPictureData).where(eq(carPicture.carPictureId, carPictureId));
        return true;
    } catch {
        return false;
    }
}

// Delete

export async function deleteCar(carId: number) {
    try {
        await db.delete(car).where(eq(car.carId, carId));
        return true;
    } catch {
        return false;
    }
}

export async function deleteCarPicture(carPictureId: number) {
    try {
        await db.delete(carPicture).where(eq(carPicture.carPictureId, carPictureId));
        return true;
    } catch {
        return false;
    }
}

export async function deleteAllCarPictures(carId: number) {
    try {
        await db.delete(carPicture).where(eq(car.carId, carId));
        return true;
    } catch {
        return false;
    }
}