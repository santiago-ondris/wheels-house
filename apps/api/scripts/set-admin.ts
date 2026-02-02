import 'dotenv/config';
import { db } from '../src/database/index';
import { user } from '../src/database/schema';
import { eq } from 'drizzle-orm';

async function setAdmin() {
    const args = process.argv.slice(2);
    const userArg = args.find(a => a.startsWith('--user='))?.split('=')[1];
    const revoke = args.includes('--revoke');

    if (!userArg) {
        console.log('Usage: npx ts-node scripts/set-admin.ts --user=username [--revoke]');
        return;
    }

    const [targetUser] = await db.select().from(user).where(eq(user.username, userArg)).limit(1);

    if (!targetUser) {
        console.error(`User ${userArg} not found`);
        return;
    }

    const isAdmin = !revoke;

    await db.update(user)
        .set({ isAdmin })
        .where(eq(user.userId, targetUser.userId));

    console.log(`User ${userArg} is now ${isAdmin ? 'ADMIN' : 'NOT ADMIN'}`);
    process.exit(0);
}

setAdmin().catch(err => {
    console.error(err);
    process.exit(1);
});
