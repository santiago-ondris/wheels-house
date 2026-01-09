import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCarDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    color: string;

    @IsString()
    @IsNotEmpty()
    brand: string;

    @IsString()
    @IsNotEmpty()
    scale: string;

    @IsString()
    @IsNotEmpty()
    manufacturer: string;

    @Transform(({ value }) => value ?? '')
    @IsString()
    @IsOptional()
    description: string | null = '';

    @Transform(({ value }) => value ?? '')
    @IsString()
    @IsOptional()
    designer: string | null = '';

    @Transform(({ value }) => value ?? '')
    @IsString()
    @IsOptional()
    series: string | null = '';

    @Transform(({ value }) => value ?? [])
    @IsArray()
    @IsOptional()
    pictures: string[] | null = [];

    @Transform(({ value }) => value ?? '')
    @IsString()
    @IsOptional()
    country: string | null = '';

    @IsString()
    @IsNotEmpty()
    condition: string;

    @IsArray()
    @IsOptional()
    groups: number[] | null = []; // Groups Ids.
}

export class CarToDB {
    userId: number;
    name: string;
    color: string;
    brand: string;
    scale: string;
    manufacturer: string;
    description: string | null;
    designer: string | null;
    series: string | null;
    country: string | null;
    condition: string;

    constructor(
        userId: number, name: string, color: string, brand: string, scale: string,
        manufacturer: string, condition: string, description: string | null = '', designer: string | null = '',
        series: string | null = '', country: string | null = ''
    ) {
        this.userId = userId, this.name = name, this.color = color;
        this.brand = brand, this.scale = scale, this.manufacturer = manufacturer;
        this.condition = condition;
        this.description = description, this.designer = designer, this.series = series;
        this.country = country;
    }
}

export class CarPictureToDB {
    url: string;
    carId: number;
    index: number;

    constructor(url: string, carId: number, index: number) {
        this.url = url, this.carId = carId, this.index = index;
    }
}

export class CarInfo extends CreateCarDTO {
    carId: number;
    condition: string;
    constructor(
        carId: number, name: string, color: string, brand: string, scale: string,
        manufacturer: string, condition: string, description: string | null = '', 
        designer: string | null = '', series: string | null = '', pictures: string[] | null = [], 
        country: string | null = ''
    ) {
        super();
        this.carId = carId, this.name = name, this.color = color;
        this.brand = brand, this.scale = scale, this.manufacturer = manufacturer;
        this.condition = condition;
        this.description = description, this.designer = designer, this.series = series;
        this.pictures = pictures, this.country = country;
    }
}

export class CarInfoWithOwner extends CarInfo {
    ownerUsername: string;
    constructor(
        carId: number, name: string, color: string, brand: string, scale: string,
        manufacturer: string, condition: string, ownerUsername: string, 
        description: string | null = '', designer: string | null = '', series: string | null = '',
        pictures: string[] | null = [], country: string | null = ''
    ) {
        super(carId, name, color, brand, scale, manufacturer, condition, description, designer, series, pictures, country);
        this.ownerUsername = ownerUsername;
    }
}

export class CarUpdateDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    color: string;

    @IsString()
    @IsNotEmpty()
    brand: string;

    @IsString()
    @IsNotEmpty()
    scale: string;

    @IsString()
    @IsNotEmpty()
    manufacturer: string;

    @IsString()
    @IsOptional()
    description: string | null = '';

    @IsString()
    @IsOptional()
    designer: string | null = '';

    @IsString()
    @IsOptional()
    series: string | null = '';

    @IsArray()
    @IsOptional()
    pictures: string[] | null = [];

    @IsString()
    @IsOptional()
    country: string | null = '';

    @IsString()
    @IsOptional()
    condition: string;

    @IsArray()
    @IsOptional()
    groups: number[] | null = [];
}


export class CarInfoWoGroups {
    carId: number;
    name: string;
    color: string;
    brand: string;
    scale: string;
    manufacturer: string;
    description?: string | null = '';
    designer?: string | null = '';
    series?: string | null = '';
    pictures?: string[] | null = [];
    country?: string | null = '';
    condition: string;

    constructor(
        carId: number, name: string, color: string, brand: string, scale: string,
        manufacturer: string, condition: string, description: string | null = '', 
        designer: string | null = '', series: string | null = '', pictures: string[] | null = [], 
        country: string | null = ''
    ) {
        this.carId = carId, this.name = name, this.color = color;
        this.brand = brand, this.scale = scale, this.manufacturer = manufacturer;
        this.condition = condition;
        this.description = description, this.designer = designer, this.series = series;
        this.pictures = pictures, this.country = country;
    }
}