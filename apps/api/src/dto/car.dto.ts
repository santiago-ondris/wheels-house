import { IsString, IsNotEmpty, IsOptional, IsArray, IsBoolean } from 'class-validator';
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

    @IsBoolean()
    @IsOptional()
    wished: boolean = false;

    @IsArray()
    @IsOptional()
    groups: number[] | null = []; // Groups Ids.

    @IsString()
    @IsOptional()
    rarity: string | null = '';

    @IsString()
    @IsOptional()
    quality: string | null = '';

    @IsString()
    @IsOptional()
    variety: string | null = '';

    @IsString()
    @IsOptional()
    finish: string | null = '';
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
    wished: boolean = false;
    rarity: string | null;
    quality: string | null;
    variety: string | null;
    finish: string | null;

    constructor(
        userId: number, name: string, color: string, brand: string, scale: string,
        manufacturer: string, condition: string, wished: boolean = false, description: string | null = '', designer: string | null = '',
        series: string | null = '', country: string | null = '', rarity: string | null = '', quality: string | null = '', variety: string | null = '', finish: string | null = ''
    ) {
        this.userId = userId, this.name = name, this.color = color;
        this.brand = brand, this.scale = scale, this.manufacturer = manufacturer;
        this.condition = condition, this.wished = wished;
        this.description = description, this.designer = designer, this.series = series;
        this.country = country;
        this.rarity = rarity;
        this.quality = quality;
        this.variety = variety;
        this.finish = finish;
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
        manufacturer: string, condition: string, wished: boolean = false, description: string | null = '',
        designer: string | null = '', series: string | null = '', pictures: string[] | null = [],
        country: string | null = '', rarity: string | null = '', quality: string | null = '', variety: string | null = '', finish: string | null = ''
    ) {
        super();
        this.carId = carId, this.name = name, this.color = color;
        this.brand = brand, this.scale = scale, this.manufacturer = manufacturer;
        this.condition = condition, this.wished = wished;
        this.description = description, this.designer = designer, this.series = series;
        this.pictures = pictures, this.country = country;
        this.rarity = rarity;
        this.quality = quality;
        this.variety = variety;
        this.finish = finish;
    }
}

export class CarInfoWithOwner extends CarInfo {
    ownerUsername: string;
    constructor(
        carId: number, name: string, color: string, brand: string, scale: string,
        manufacturer: string, condition: string, wished: boolean = false, ownerUsername: string,
        description: string | null = '', designer: string | null = '', series: string | null = '',
        pictures: string[] | null = [], country: string | null = '', rarity: string | null = '', quality: string | null = '', variety: string | null = '', finish: string | null = ''
    ) {
        super(carId, name, color, brand, scale, manufacturer, condition, wished, description, designer, series, pictures, country, rarity, quality, variety, finish);
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
    @IsNotEmpty()
    condition: string;

    @IsBoolean()
    @IsOptional()
    wished: boolean = false;

    @IsArray()
    @IsOptional()
    groups: number[] | null = [];

    @IsString()
    @IsOptional()
    rarity: string | null = '';

    @IsString()
    @IsOptional()
    quality: string | null = '';

    @IsString()
    @IsOptional()
    variety: string | null = '';

    @IsString()
    @IsOptional()
    finish: string | null = '';
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
    rarity: string | null = '';
    quality: string | null = '';
    variety: string | null = '';
    finish: string | null = '';

    constructor(
        carId: number, name: string, color: string, brand: string, scale: string,
        manufacturer: string, condition: string, description: string | null = '',
        designer: string | null = '', series: string | null = '', pictures: string[] | null = [],
        country: string | null = '', rarity: string | null = '', quality: string | null = '', variety: string | null = '', finish: string | null = ''
    ) {
        this.carId = carId, this.name = name, this.color = color;
        this.brand = brand, this.scale = scale, this.manufacturer = manufacturer;
        this.condition = condition;
        this.description = description, this.designer = designer, this.series = series;
        this.pictures = pictures, this.country = country;
        this.rarity = rarity;
        this.quality = quality;
        this.variety = variety;
        this.finish = finish;
    }
}