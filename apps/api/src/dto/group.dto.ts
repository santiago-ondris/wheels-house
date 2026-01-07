import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
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
}

export class GroupToDB {
    userId: number;
    name: string;
    description?: string | null = '';
    picture?: string | null = '';

    constructor(userId: number, name: string, description: string | null = '', 
        picture: string | null = ''
    ) {
        this.userId = userId, this.name = name;
        this.description = description, this.picture = picture;
    }
}

export class GroupInfoWoCar {
    groupId: number;
    name: string;
    totalCars: number;
    description?: string | null = '';
    picture?: string | null = '';

    constructor(groupId: number, name: string, totalCars: number, 
        description: string | null = '', picture: string | null = ''
    ) {
        this.groupId = groupId, this.name = name, this.totalCars = totalCars;
        this.description = description, this.picture = picture;
    }
}

export class GroupInfo extends GroupInfoWoCar {
    cars: CarInfoWoGroups[];

    constructor(groupId: number, name: string, totalCars: number, cars: CarInfoWoGroups[], 
        description: string | null = '', picture: string | null = ''
    ) {
        super(groupId, name, totalCars, description, picture);
        this.cars = cars;
    }
}