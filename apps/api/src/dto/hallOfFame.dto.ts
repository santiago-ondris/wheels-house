export interface HallOfFameFlags {
    isFounder: boolean;
    isContributor: boolean;
    isAmbassador: boolean;
    isLegend: boolean;
}

export class HallOfFameMemberDTO {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
    picture: string | null;
    hallOfFameTitle: string | null;
    hallOfFameFlags: HallOfFameFlags;
    carCount: number;
    totalLikes: number;
    showcaseCarImage: string | null;
    showcaseCarName: string | null;
    hallOfFameOrder: number | null;

    constructor(
        userId: number,
        username: string,
        firstName: string,
        lastName: string,
        picture: string | null,
        hallOfFameTitle: string | null,
        hallOfFameFlags: HallOfFameFlags,
        carCount: number,
        totalLikes: number,
        showcaseCarImage: string | null,
        showcaseCarName: string | null,
        hallOfFameOrder: number | null = null
    ) {
        this.userId = userId;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.picture = picture;
        this.hallOfFameTitle = hallOfFameTitle;
        this.hallOfFameFlags = hallOfFameFlags;
        this.carCount = carCount;
        this.totalLikes = totalLikes;
        this.showcaseCarImage = showcaseCarImage;
        this.showcaseCarName = showcaseCarName;
        this.hallOfFameOrder = hallOfFameOrder;
    }
}
