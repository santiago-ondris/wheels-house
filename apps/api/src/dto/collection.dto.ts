export class CreateCollectionDTO {
    name: string;
    description: string = "";
    picture: string = "";

    constructor(name: string, description: string = "", picture: string = "") {
        this.name = name;
        this.description = description;
        this.picture = picture; 
    }
}

export class CollectionToDB extends CreateCollectionDTO {
    constructor(name: string, description: string = "", picture: string = "") {
        super(name, description, picture);
    }
}