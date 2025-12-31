import { db } from '../index'
import { collection } from 'src/database/schema'
import { and, eq } from 'drizzle-orm';
import { CollectionToDB } from 'src/dto/collection.dto';

// Create

export async function createCollection(newCollection: CollectionToDB, userId: number) {
    try {
        await db.insert(collection).values({
            name: newCollection.name,
            description: newCollection.description,
            userId: userId,
            picture: newCollection.picture
        });
        return true;
    } catch {
        return false;
    }
}

// Read

export async function getCollectionFromNameAndUserId(collectionName: string, userId: number) {
    // Notice that the object is an array of length 1 (or 0).
    const collectionObject = await db.select().from(collection).where(and(
            eq(collection.name, collectionName),
            eq(collection.userId, userId),
        )
    );
    return collectionObject[0];
}