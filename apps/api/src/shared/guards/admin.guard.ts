import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { db } from '../../database';
import { user } from '../../database/schema/user.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class AdminGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const requestUser = request.user; // Populated by JwtAuthGuard

        if (!requestUser || !requestUser.userId) {
            return false;
        }

        const start = Date.now();
        const userInDb = await db.query.user.findFirst({
            where: eq(user.userId, requestUser.userId),
            columns: {
                isAdmin: true,
            },
        });        // Simple perf logging if needed, but keeping it clean

        if (!userInDb || !userInDb.isAdmin) {
            throw new ForbiddenException('Admin access required');
        }

        return true;
    }
}
