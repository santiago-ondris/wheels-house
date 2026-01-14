import { CarPictureToDB, CarToDB, CarUpdateDTO } from "src/dto/car.dto";
import { CollectionQueryDTO } from "src/dto/collection-query.dto";
import { db } from "../index";
import { car, carPicture, user, groupedCar } from "../schema";
import { count, eq, or, and, ilike, asc, desc, sql, SQL, inArray, notInArray } from 'drizzle-orm';

// Create

export async function createCar(newCar: CarToDB) {
    try {
        const createdCar = await db.insert(car).values(newCar).returning();
        return createdCar[0] ?? null;
    } catch {
        return null;
    }
}

export async function createCarPicture(newCarPicture: CarPictureToDB) {
    try {
        const createdPicture = await db.insert(carPicture).values(newCarPicture).returning();
        return createdPicture[0] ?? null;
    } catch {
        return null;
    }
}

// Read

export async function getCarById(carId: number) {
    const carObject = await db.select().from(car).where(eq(car.carId, carId));
    return carObject[0];
}

export async function getCarByIdWithOwner(carId: number) {
    const result = await db
        .select({
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
            wished: car.wished,
            ownerUsername: user.username,
        })
        .from(car)
        .innerJoin(user, eq(car.userId, user.userId))
        .where(eq(car.carId, carId));

    return result[0];
}

export async function getCarsFromUserId(userId: number) {
    return await db.select().from(car).where(and(eq(car.userId, userId), eq(car.wished, false)));
}

export async function getWishedCarsFromUserId(userId: number) {
    return await db.select().from(car).where(and(eq(car.userId, userId), eq(car.wished, true)));
}

// TODO ver si realmente hace falta
export async function getCarsByNameAndUser(userId: number) {
    return await db.select({ name: car.name }).from(car).where(and(eq(car.userId, userId), eq(car.wished, false)));
}

//functions for featured car

export async function getTotalCarsCount() {
    const result = await db.select({ value: count() }).from(car).where(eq(car.wished, false));
    return result[0].value;
}

export async function getUniqueCarValues(userId: number) {
    const result = await db
        .select({
            name: car.name,
            series: car.series,
            designer: car.designer,
        })
        .from(car)
        .where(and(eq(car.userId, userId), eq(car.wished, false)));

    return result;
}

export async function getCarByOffset(offset: number) {
    const result = await db
        .select({
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
            wished: car.wished,
            ownerUsername: user.username,
        })
        .from(car)
        .innerJoin(user, eq(car.userId, user.userId))
        .where(eq(car.wished, false))
        .limit(1)
        .offset(offset);

    return result[0] ?? null;
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
        const deletedPicture = await db.delete(carPicture).where(eq(carPicture.carPictureId, carPictureId)).returning();
        return deletedPicture[0] ?? null;
    } catch {
        return null;
    }
}

export async function deleteAllCarPictures(carId: number) {
    try {
        const deletedPictures = await db.delete(carPicture).where(eq(carPicture.carId, carId)).returning();
        return deletedPictures;
    } catch {
        return null;
    }
}

export async function deleteCarsFromUserId(userId: number) {
    try {
        const deletedCars = await db.delete(car).where(eq(car.userId, userId)).returning();
        return deletedCars;
    } catch {
        return null;
    }
}

// Query paginada con filtros y ordenamiento
export async function getCarsFromUserIdPaginated(userId: number, query: CollectionQueryDTO) {
    const {
        page = 1,
        limit = 15,
        sortBy = 'id',
        sortOrder = 'desc',
        brands,
        colors,
        manufacturers,
        scales,
        conditions,
        countries,
        hasPicture,
        search
    } = query;

    const conditions_list: SQL[] = [eq(car.userId, userId), eq(car.wished, false)];

    // Filter by group if provided
    if (query.groupId) {
        // Subquery to get carIds in the group
        const carsInGroup = db
            .select({ carId: groupedCar.carId })
            .from(groupedCar)
            .where(eq(groupedCar.groupId, query.groupId));

        conditions_list.push(inArray(car.carId, carsInGroup));
    }

    // To filter by cars with picture.
    if (hasPicture && hasPicture.length == 1 && hasPicture[0] == 'Con imagen') {
        const carsWithPicture = db
        .select({ carId: car.carId})
        .from(car)
        .innerJoin(carPicture, eq(car.carId, carPicture.carId)). groupBy(car.carId);

        conditions_list.push(inArray(car.carId, carsWithPicture));        
    } else if(hasPicture && hasPicture.length == 1 && hasPicture[0] == 'Sin imagen') {
        const carsWithPicture = db
        .select({ carId: car.carId})
        .from(car)
        .innerJoin(carPicture, eq(car.carId, carPicture.carId)). groupBy(car.carId);

        conditions_list.push(notInArray(car.carId, carsWithPicture));
    }

    // Filtros con logica OR
    if (brands && brands.length > 0) {
        conditions_list.push(or(...brands.map(b => eq(car.brand, b)))!);
    }
    if (colors && colors.length > 0) {
        conditions_list.push(or(...colors.map(c => eq(car.color, c)))!);
    }
    if (manufacturers && manufacturers.length > 0) {
        conditions_list.push(or(...manufacturers.map(m => eq(car.manufacturer, m)))!);
    }
    if (scales && scales.length > 0) {
        conditions_list.push(or(...scales.map(s => eq(car.scale, s)))!);
    }
    if (conditions && conditions.length > 0) {
        conditions_list.push(or(...conditions.map(c => eq(car.condition, c)))!);
    }
    if (countries && countries.length > 0) {
        conditions_list.push(or(...countries.map(c => eq(car.country, c)))!);
    }

    // Busqueda de texto
    if (search && search.trim()) {
        const searchPattern = `%${search.trim()}%`;
        conditions_list.push(
            or(
                ilike(car.name, searchPattern),
                ilike(car.brand, searchPattern),
                ilike(car.series, searchPattern)
            )!
        );
    }

    const whereClause = and(...conditions_list);

    // Ordenamiento
    const sortColumn = {
        'id': car.carId,
        'name': car.name,
        'brand': car.brand,
        'country': car.country
    }[sortBy] || car.carId;

    const orderFn = sortOrder === 'asc' ? asc : desc;

    // Conteo total de items que coinciden con el filtro
    const countResult = await db
        .select({ value: count() })
        .from(car)
        .where(whereClause);
    const totalItems = countResult[0].value;

    // Paginacion   
    const offset = (page - 1) * limit;
    const items = await db
        .select({
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
            wished: car.wished,
        })
        .from(car)
        .where(whereClause)
        .orderBy(orderFn(sortColumn))
        .limit(limit)
        .offset(offset);

    return {
        items,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
            totalItems,
            limit
        }
    };
}

export async function getCarIdsFromUserIdWithFilter(userId: number, query: CollectionQueryDTO) {
    const { brands, colors, manufacturers, scales, conditions, countries, hasPicture, search } = query;

    const conditions_list: SQL[] = [eq(car.userId, userId), eq(car.wished, false)];

    if (brands && brands.length > 0) {
        conditions_list.push(or(...brands.map(b => eq(car.brand, b)))!);
    }
    if (colors && colors.length > 0) {
        conditions_list.push(or(...colors.map(c => eq(car.color, c)))!);
    }
    if (manufacturers && manufacturers.length > 0) {
        conditions_list.push(or(...manufacturers.map(m => eq(car.manufacturer, m)))!);
    }
    if (scales && scales.length > 0) {
        conditions_list.push(or(...scales.map(s => eq(car.scale, s)))!);
    }
    if (conditions && conditions.length > 0) {
        conditions_list.push(or(...conditions.map(c => eq(car.condition, c)))!);
    }
    if (countries && countries.length > 0) {
        conditions_list.push(or(...countries.map(c => eq(car.country, c)))!);
    }

    // To filter by cars with picture.
    if (hasPicture && hasPicture.length == 1 && hasPicture[0] == 'Con imagen') {
        const carsWithPicture = db
        .select({ carId: car.carId})
        .from(car)
        .innerJoin(carPicture, eq(car.carId, carPicture.carId)). groupBy(car.carId);

        conditions_list.push(inArray(car.carId, carsWithPicture));        
    } else if(hasPicture && hasPicture.length == 1 && hasPicture[0] == 'Sin imagen') {
        const carsWithPicture = db
        .select({ carId: car.carId})
        .from(car)
        .innerJoin(carPicture, eq(car.carId, carPicture.carId)). groupBy(car.carId);

        conditions_list.push(notInArray(car.carId, carsWithPicture));
    }

    if (search && search.trim()) {
        const searchPattern = `%${search.trim()}%`;
        conditions_list.push(
            or(
                ilike(car.name, searchPattern),
                ilike(car.brand, searchPattern),
                ilike(car.series, searchPattern)
            )!
        );
    }

    const result = await db
        .select({ carId: car.carId })
        .from(car)
        .where(and(...conditions_list));

    return result.map(r => r.carId);
}

export async function getFilterOptionsForUser(userId: number, groupId: number | undefined) {
    const cars = !groupId ? (
        // If groudId is undefined
        await db.select({
            brand: car.brand,
            color: car.color,
            manufacturer: car.manufacturer,
            scale: car.scale,
            condition: car.condition,
            country: car.country,
        }).from(car).where(and(eq(car.userId, userId), eq(car.wished, false)))
    ) : (
        // If groupId is defined
        await db.select({
            brand: car.brand,
            color: car.color,
            manufacturer: car.manufacturer,
            scale: car.scale,
            condition: car.condition,
            country: car.country,
        }).from(car).innerJoin(groupedCar, eq(groupedCar.carId, car.carId)).where(and(
            eq(car.userId, userId), eq(car.wished, false), eq(groupedCar.groupId, groupId)))
    );

    const countBy = <T extends string | null>(items: T[]): { name: string; count: number }[] => {
        const map = new Map<string, number>();
        items.forEach(item => {
            if (item) {
                map.set(item, (map.get(item) || 0) + 1);
            }
        });
        return Array.from(map.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    };

    // To count cars with pictures.
    const carsWithPicture = !groupId ? (
        // If groudId is undefined
        await db.select({
            carId: car.carId,
        }).from(car).where(and(eq(car.userId, userId), eq(car.wished, false)))
        .innerJoin(carPicture, eq(carPicture.carId, car.carId)).groupBy(car.carId)
    ) : (
        // If groupId is defined
        await db.select({
            carId: car.carId,
        }).from(car).innerJoin(groupedCar, eq(groupedCar.carId, car.carId)).where(and(
            eq(car.userId, userId), eq(car.wished, false), eq(groupedCar.groupId, groupId)))
        .innerJoin(carPicture, eq(carPicture.carId, car.carId)).groupBy(car.carId)
    );

    let hasPicture : { name: string; count: number }[] = []; 

    if (carsWithPicture.length > 0) {
        hasPicture.push({
            name: "Con imagen",
            count: carsWithPicture.length
        });
    }

    if(cars.length - carsWithPicture.length > 0) {
        hasPicture.push({
            name: "Sin imagen",
            count: cars.length - carsWithPicture.length
        });
    }

    return {
        brands: countBy(cars.map(c => c.brand)),
        colors: countBy(cars.map(c => c.color)),
        manufacturers: countBy(cars.map(c => c.manufacturer)),
        scales: countBy(cars.map(c => c.scale)),
        conditions: countBy(cars.map(c => c.condition)),
        countries: countBy(cars.map(c => c.country)),
        hasPicture
    };
}