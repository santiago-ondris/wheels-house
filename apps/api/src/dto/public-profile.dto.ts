export class PublicCarDTO {
    carId: number;
    name: string;
    color: string;
    brand: string;
    scale: string;
    manufacturer: string;
    description?: string;
    designer?: string;
    series?: string;
    country?: string;
    pictures?: string[];

    constructor(
        carId: number,
        name: string,
        color: string,
        brand: string,
        scale: string,
        manufacturer: string,
        description?: string,
        designer?: string,
        series?: string,
        country?: string,
        pictures?: string[]
    ) {
        this.carId = carId;
        this.name = name;
        this.color = color;
        this.brand = brand;
        this.scale = scale;
        this.manufacturer = manufacturer;
        this.description = description;
        this.designer = designer;
        this.series = series;
        this.country = country;
        this.pictures = pictures;
    }
}

export class PublicProfileDTO {
    username: string;
    firstName: string;
    lastName: string;
    picture?: string;
    createdDate?: Date;
    totalCars: number;
    totalGroups: number;
    cars: PublicCarDTO[];

    constructor(
        username: string,
        firstName: string,
        lastName: string,
        totalCars: number,
        totalGroups: number,
        cars: PublicCarDTO[],
        picture?: string,
        createdDate?: Date
    ) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.picture = picture;
        this.createdDate = createdDate;
        this.totalCars = totalCars;
        this.totalGroups = totalGroups;
        this.cars = cars;
    }
}
