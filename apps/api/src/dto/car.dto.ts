import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
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
    description: string | null;

    @Transform(({ value }) => value ?? '')
    @IsString()
    @IsOptional()
    designer: string | null;

    @Transform(({ value }) => value ?? '')
    @IsString()
    @IsOptional()
    series: string | null;

    @Transform(({ value }) => value ?? '')
    @IsString()
    @IsOptional()
    picture: string | null;
}

export class CarToDB extends CreateCarDTO {
    userId: number;
    constructor(
        userId: number, name: string, color: string, brand: string, scale: string,
        manufacturer: string, description: string | null = "", designer: string | null = "",
        series: string | null = "", picture: string | null = ""
    ) {
        super();
        this.userId = userId, this.name = name, this.color = color;
        this.brand = brand, this.scale = scale, this.manufacturer = manufacturer;
        this.description = description, this.designer = designer, this.series = series;
        this.picture = picture;
    }
}

export class CarInfo extends CreateCarDTO {
    carId: number;
    constructor(
        carId: number, name: string, color: string, brand: string, scale: string,
        manufacturer: string, description: string | null = "", designer: string | null = "",
        series: string | null = "", picture: string | null = ""
    ) {
        super();
        this.carId = carId, this.name = name, this.color = color;
        this.brand = brand, this.scale = scale, this.manufacturer = manufacturer;
        this.description = description, this.designer = designer, this.series = series;
        this.picture = picture;
    }
}

export class CarUpdateDTO {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    color: string;

    @IsString()
    @IsOptional()
    brand: string;

    @IsString()
    @IsOptional()
    scale: string;

    @IsString()
    @IsOptional()
    manufacturer: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    @IsOptional()
    designer: string;

    @IsString()
    @IsOptional()
    series: string;

    @IsString()
    @IsOptional()
    picture: string;
}