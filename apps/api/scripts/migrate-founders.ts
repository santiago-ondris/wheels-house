import 'dotenv/config';
import { db } from '../src/database/index';
import { user, car } from '../src/database/schema';
import { eq, sql, asc } from 'drizzle-orm';

/**
 * One-time migration script to assign founderNumber to existing users
 * who already have at least 1 car in their collection (not wishlist).
 * 
 * This assigns founder numbers based on userId order (first registered = founder #1)
 * 
 * Usage: npx ts-node scripts/migrate-founders.ts
 */
async function migrateFounders() {
    console.log('[Migrate] Starting founder migration...');
    
    // Get users who have at least 1 real car (not wishlist), ordered by userId
    const carCountSubquery = db
        .select({
            userId: car.userId,
            carCount: sql<number>`count(*)`.as('carCount')
        })
        .from(car)
        .where(eq(car.wished, false))
        .groupBy(car.userId)
        .as('carCounts');

    const eligibleUsers = await db
        .select({
            userId: user.userId,
            username: user.username,
            founderNumber: user.founderNumber,
            carCount: carCountSubquery.carCount
        })
        .from(user)
        .innerJoin(carCountSubquery, eq(user.userId, carCountSubquery.userId))
        .orderBy(asc(user.userId))
        .limit(100);

    console.log(`[Migrate] Found ${eligibleUsers.length} eligible users with at least 1 car`);

    let assigned = 0;
    let skipped = 0;

    for (let i = 0; i < eligibleUsers.length; i++) {
        const u = eligibleUsers[i];
        const founderNumber = i + 1;

        if (u.founderNumber !== null) {
            console.log(`[Migrate] Skipping ${u.username} - already has founder #${u.founderNumber}`);
            skipped++;
            continue;
        }

        // Update user with founder number and flag
        const existingFlags = await db
            .select({ hallOfFameFlags: user.hallOfFameFlags })
            .from(user)
            .where(eq(user.userId, u.userId));
        
        const updatedFlags = { 
            ...(existingFlags[0]?.hallOfFameFlags as any || { isFounder: false, isContributor: false, isAmbassador: false, isLegend: false }), 
            isFounder: true 
        };

        await db.update(user)
            .set({ 
                founderNumber,
                hallOfFameFlags: updatedFlags
            })
            .where(eq(user.userId, u.userId));

        console.log(`[Migrate] Assigned founder #${founderNumber} to ${u.username} (userId: ${u.userId}, cars: ${u.carCount})`);
        assigned++;
    }

    console.log(`\n[Migrate] Migration complete!`);
    console.log(`  Assigned: ${assigned}`);
    console.log(`  Skipped (already had number): ${skipped}`);
    console.log(`  Total founders: ${assigned + skipped}`);
}

migrateFounders()
    .then(() => process.exit(0))
    .catch(err => {
        console.error('[Migrate] Error:', err);
        process.exit(1);
    });
