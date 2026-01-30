import { Injectable, NotFoundException } from '@nestjs/common';
import { getCarsForStats, getTotalPhotosCount, getGlobalStatsCounts } from '../database/crud/stats.crud';
import { getPublicProfileByUsername, getFounders, getHoFMembers, getFeaturedHoFMembersManual } from '../database/crud/user.crud';
import { UserStatsDTO, DistributionItem, GlobalStatsDTO } from '../dto/stats.dto';
import { HallOfFameMemberDTO } from '../dto/hallOfFame.dto';
import { db } from '../database/index';
import { car, carPicture, carLike } from '../database/schema';
import { eq, sql, and, desc } from 'drizzle-orm';

@Injectable()
export class StatsService {
    private globalStatsCache: { data: GlobalStatsDTO; expiry: number } | null = null;
    private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

    async getGlobalStats(): Promise<GlobalStatsDTO> {
        const now = Date.now();
        if (this.globalStatsCache && now < this.globalStatsCache.expiry) {
            return this.globalStatsCache.data;
        }

        const counts = await getGlobalStatsCounts();
        const stats = new GlobalStatsDTO(counts.totalUsers, counts.totalCars, counts.totalPhotos);

        this.globalStatsCache = {
            data: stats,
            expiry: now + this.CACHE_TTL
        };

        return stats;
    }

    async getHoFMembersByCategory(category: string): Promise<HallOfFameMemberDTO[]> {
        let rawMembers;
        if (category === 'founders') {
            rawMembers = await getFounders(100);
        } else {
            const flagMap: Record<string, string> = {
                'contributors': 'isContributor',
                'ambassadors': 'isAmbassador',
                'legends': 'isLegend'
            };
            const flag = flagMap[category];
            if (!flag) return [];
            rawMembers = await getHoFMembers(flag);
        }

        const membersWithShowcase = await Promise.all(rawMembers.map(async (m: any) => {
            const [likesResult] = await db
                .select({ count: sql<number>`cast(count(*) as int)` })
                .from(carLike)
                .innerJoin(car, eq(car.carId, carLike.carId))
                .where(eq(car.userId, m.userId));

            // Fetch a showcase car (the one with most likes)
            const [showcaseCar] = await db
                .select({
                    name: car.name,
                    image: carPicture.url
                })
                .from(car)
                .leftJoin(carPicture, eq(car.carId, carPicture.carId))
                .where(and(eq(car.userId, m.userId), eq(car.wished, false)))
                .orderBy(desc(car.likesCount))
                .limit(1);

            return new HallOfFameMemberDTO(
                m.userId,
                m.username,
                m.firstName,
                m.lastName,
                m.picture,
                m.hallOfFameTitle || (category === 'founders' ? "Founding Member" : ""),
                m.hallOfFameFlags || { isFounder: category === 'founders', isContributor: false, isAmbassador: false, isLegend: false },
                m.carCount,
                likesResult?.count || 0,
                showcaseCar?.image || null,
                showcaseCar?.name || null
            );
        }));

        return membersWithShowcase;
    }

    async getFeaturedHoFMembers(): Promise<HallOfFameMemberDTO[]> {
        const rawMembers = await getFeaturedHoFMembersManual();
        
        const featuredWithShowcase = await Promise.all(rawMembers.map(async (m: any) => {
            const [likesResult] = await db
                .select({ count: sql<number>`cast(count(*) as int)` })
                .from(carLike)
                .innerJoin(car, eq(car.carId, carLike.carId))
                .where(eq(car.userId, m.userId));

            const [showcaseCar] = await db
                .select({
                    name: car.name,
                    image: carPicture.url
                })
                .from(car)
                .innerJoin(carPicture, eq(car.carId, carPicture.carId))
                .where(and(eq(car.userId, m.userId), eq(car.wished, false)))
                .orderBy(desc(car.likesCount))
                .limit(1);

            return new HallOfFameMemberDTO(
                m.userId,
                m.username,
                m.firstName,
                m.lastName,
                m.picture,
                m.hallOfFameTitle,
                m.hallOfFameFlags,
                m.carCount,
                likesResult?.count || 0,
                showcaseCar?.image || null,
                showcaseCar?.name || null,
                m.hallOfFameOrder
            );
        }));

        return featuredWithShowcase;
    }

    async getUserStats(username: string): Promise<UserStatsDTO> {
        const userData = await getPublicProfileByUsername(username);

        if (!userData) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const cars = await getCarsForStats(userData.userId);

        if (cars.length === 0) {
            return new UserStatsDTO(0, 0, null, 0, [], [], [], [], [], []);
        }

        const totalCars = cars.length;
        const brandCounts: Record<string, number> = {};
        const manufacturerCounts: Record<string, number> = {};
        const scaleCounts: Record<string, number> = {};
        const colorCounts: Record<string, number> = {};
        const conditionCounts: Record<string, number> = {};
        const countryCounts: Record<string, number> = {};
        const totalPhotos = await getTotalPhotosCount(userData.userId);

        cars.forEach(car => {
            brandCounts[car.brand] = (brandCounts[car.brand] || 0) + 1;
            manufacturerCounts[car.manufacturer] = (manufacturerCounts[car.manufacturer] || 0) + 1;
            scaleCounts[car.scale] = (scaleCounts[car.scale] || 0) + 1;
            colorCounts[car.color] = (colorCounts[car.color] || 0) + 1;
            if (car.condition) {
                conditionCounts[car.condition] = (conditionCounts[car.condition] || 0) + 1;
            }
            if (car.country) {
                countryCounts[car.country] = (countryCounts[car.country] || 0) + 1;
            }
        });

        const distinctBrands = Object.keys(brandCounts).length;

        let favoriteNationality: string | null = null;
        let maxCountryCount = 0;
        for (const [country, count] of Object.entries(countryCounts)) {
            if (count > maxCountryCount) {
                maxCountryCount = count;
                favoriteNationality = country;
            }
        }

        const getSortedDistribution = (counts: Record<string, number>): DistributionItem[] => {
            return Object.entries(counts)
                .map(([name, count]) => new DistributionItem(name, count))
                .sort((a, b) => b.count - a.count);
        };

        return new UserStatsDTO(
            totalCars,
            distinctBrands,
            favoriteNationality,
            totalPhotos,
            getSortedDistribution(brandCounts),
            getSortedDistribution(manufacturerCounts),
            getSortedDistribution(scaleCounts),
            getSortedDistribution(colorCounts),
            getSortedDistribution(conditionCounts),
            getSortedDistribution(countryCounts)
        );
    }
}
