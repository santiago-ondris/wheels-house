import { Injectable } from '@nestjs/common';
import { db } from '../../database';
import { car } from '../../database/schema/car.schema';
import { group } from '../../database/schema/group.schema';
import { eq } from 'drizzle-orm';
import { TokenData } from '../../dto/user.dto';

@Injectable()
export class AdminService {
    async hideCar(carId: number, reason: string, adminUser: TokenData) {
        await db.update(car)
            .set({
                hidden: true,
                hiddenReason: reason,
                hiddenAt: new Date(),
                hiddenBy: adminUser.userId,
            })
            .where(eq(car.carId, carId));

        return { success: true };
    }

    async hideGroup(groupId: number, reason: string, adminUser: TokenData) {
        await db.update(group)
            .set({
                hidden: true,
                hiddenReason: reason,
                hiddenAt: new Date(),
                hiddenBy: adminUser.userId,
            })
            .where(eq(group.groupId, groupId));

        return { success: true };
    }
}
