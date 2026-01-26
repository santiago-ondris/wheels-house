import { IsString, IsNotEmpty, IsOptional, IsArray, IsBoolean, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { CarInfoWoGroups } from './car.dto';

export class CreateGroupDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @Transform(({ value }) => value ?? '')
    @IsString()
    @IsOptional()
    description?: string | null = '';

    @Transform(({ value }) => value ?? [])
    @IsArray()
    @IsOptional()
    cars?: number[] | null = [];

    @Transform(({ value }) => value ?? '')
    @IsString()
    @IsOptional()
    picture?: string | null = '';

    @Transform(({ value }) => value ?? false)
    @IsBoolean()
    @IsOptional()
    featured?: boolean = false;

    @Transform(({ value }) => value ?? null)
    @IsInt()
    @IsOptional()
    order?: number | null = null;
}

export class GroupToDB {
    userId: number;
    name: string;
    description?: string | null = '';
    picture?: string | null = '';
    featured?: boolean = false;
    order?: number | null = null;

    constructor(userId: number, name: string, description: string | null = '',
        picture: string | null = '', featured: boolean = false, order: number | null = null
    ) {
        this.userId = userId, this.name = name;
        this.description = description, this.picture = picture;
        this.featured = featured, this.order = order;
    }
}

export class GroupInfoWoCar {
    groupId: number;
    name: string;
    totalCars: number;
    description?: string | null = '';
    picture?: string | null = '';
    featured?: boolean = false;
    order?: number | null = null;
    likesCount: number = 0;
    isLiked: boolean = false;

    constructor(groupId: number, name: string, totalCars: number,
        description: string | null = '', picture: string | null = '',
        featured: boolean | null = false, order: number | null = null,
        likesCount: number = 0, isLiked: boolean = false
    ) {
        this.groupId = groupId, this.name = name, this.totalCars = totalCars;
        this.description = description, this.picture = picture;
        this.featured = featured ?? false, this.order = order;
        this.likesCount = likesCount;
        this.isLiked = isLiked;
    }
}

export class GroupInfo extends GroupInfoWoCar {
    cars: CarInfoWoGroups[];

    constructor(groupId: number, name: string, totalCars: number, cars: CarInfoWoGroups[],
        description: string | null = '', picture: string | null = '',
        featured: boolean | null = false, order: number | null = null,
        likesCount: number = 0, isLiked: boolean = false
    ) {
        super(groupId, name, totalCars, description, picture, featured, order, likesCount, isLiked);
        this.cars = cars;
    }
}

export class UpdateGroupDTO extends CreateGroupDTO {

}
