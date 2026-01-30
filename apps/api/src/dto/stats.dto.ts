export class DistributionItem {
    name: string;
    count: number;

    constructor(name: string, count: number) {
        this.name = name;
        this.count = count;
    }
}

export class UserStatsDTO {
    totalCars: number;
    distinctBrands: number;
    favoriteNationality: string | null;
    totalPhotos: number;

    brandDistribution: DistributionItem[];
    manufacturerDistribution: DistributionItem[];
    scaleDistribution: DistributionItem[];
    colorDistribution: DistributionItem[];
    conditionDistribution: DistributionItem[];
    countryDistribution: DistributionItem[];

    constructor(
        totalCars: number,
        distinctBrands: number,
        favoriteNationality: string | null,
        totalPhotos: number,
        brandDistribution: DistributionItem[],
        manufacturerDistribution: DistributionItem[],
        scaleDistribution: DistributionItem[],
        colorDistribution: DistributionItem[],
        conditionDistribution: DistributionItem[],
        countryDistribution: DistributionItem[]
    ) {
        this.totalCars = totalCars;
        this.distinctBrands = distinctBrands;
        this.favoriteNationality = favoriteNationality;
        this.totalPhotos = totalPhotos;
        this.brandDistribution = brandDistribution;
        this.manufacturerDistribution = manufacturerDistribution;
        this.scaleDistribution = scaleDistribution;
        this.colorDistribution = colorDistribution;
        this.conditionDistribution = conditionDistribution;
        this.countryDistribution = countryDistribution;
    }
}

export class GlobalStatsDTO {
    totalUsers: number;
    totalCars: number;
    totalPhotos: number;

    constructor(totalUsers: number, totalCars: number, totalPhotos: number) {
        this.totalUsers = totalUsers;
        this.totalCars = totalCars;
        this.totalPhotos = totalPhotos;
    }
}
