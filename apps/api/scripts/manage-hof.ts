import 'dotenv/config';
import { db } from '../src/database/index';
import { user } from '../src/database/schema';
import { eq, sql } from 'drizzle-orm';

async function manageHoF() {
    const args = process.argv.slice(2);
    const userArg = args.find(a => a.startsWith('--user='))?.split('=')[1];
    const addFlag = args.find(a => a.startsWith('--add='))?.split('=')[1];
    const removeFlag = args.find(a => a.startsWith('--remove='))?.split('=')[1];
    const titleArg = args.find(a => a.startsWith('--title='))?.split('=')[1];
    const orderArg = args.find(a => a.startsWith('--order='))?.split('=')[1];

    if (!userArg) {
        console.log('Usage: ts-node manage-hof.ts --user=username [--add=flag] [--remove=flag] [--title="New Title"] [--order=1|2|3]');
        return;
    }

    const [targetUser] = await db.select().from(user).where(eq(user.username, userArg)).limit(1);
    if (!targetUser) {
        console.error(`User ${userArg} not found`);
        return;
    }

    const flags = (targetUser.hallOfFameFlags as any) || { isFounder: false, isContributor: false, isAmbassador: false, isLegend: false };
    let title = targetUser.hallOfFameTitle;
    let order = targetUser.hallOfFameOrder;

    if (addFlag) {
        if (addFlag === 'founder') flags.isFounder = true;
        if (addFlag === 'contributor') flags.isContributor = true;
        if (addFlag === 'ambassador') flags.isAmbassador = true;
        if (addFlag === 'legend') flags.isLegend = true;
    }

    if (removeFlag) {
        if (removeFlag === 'founder') flags.isFounder = false;
        if (removeFlag === 'contributor') flags.isContributor = false;
        if (removeFlag === 'ambassador') flags.isAmbassador = false;
        if (removeFlag === 'legend') flags.isLegend = false;
    }

    if (titleArg !== undefined) title = titleArg;
    if (orderArg !== undefined) order = orderArg === 'null' ? null : parseInt(orderArg);

    await db.update(user)
        .set({
            hallOfFameFlags: flags,
            hallOfFameTitle: title,
            hallOfFameOrder: order
        })
        .where(eq(user.userId, targetUser.userId));

    console.log(`Updated HoF for ${userArg}:`, { flags, title, order });
}

manageHoF().catch(err => {
    console.error(err);
    process.exit(1);
});
