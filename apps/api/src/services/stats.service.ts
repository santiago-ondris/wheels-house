import { Injectable, NotFoundException } from '@nestjs/common';
import { getCarsForStats, getTotalPhotosCount } from '../database/crud/stats.crud';
import { getPublicProfileByUsername } from '../database/crud/user.crud';
import { UserStatsDTO, DistributionItem } from '../dto/stats.dto';

@Injectable()
export class StatsService {
    async getUserStats(username: string): Promise<UserStatsDTO> {
        const userData = await getPublicProfileByUsername(username);

        if (!userData) {
            throw new NotFoundException('Usuario no encontrado');
        }

        const cars = await getCarsForStats(userData.userId);

        if (cars.length === 0) {
            return new UserStatsDTO(0, 0, null, 0, [], [], [], [], []);
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
            getSortedDistribution(conditionCounts)
        );
    }
}
