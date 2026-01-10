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

    constructor(
        totalCars: number,
        distinctBrands: number,
        favoriteNationality: string | null,
        totalPhotos: number,
        brandDistribution: DistributionItem[],
        manufacturerDistribution: DistributionItem[],
        scaleDistribution: DistributionItem[],
        colorDistribution: DistributionItem[],
        conditionDistribution: DistributionItem[]
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
    }
}
