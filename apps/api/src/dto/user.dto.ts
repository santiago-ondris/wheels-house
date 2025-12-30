export class BaseUser {
    username: string;
    email: string;
    picture: string;
    firstName: string;
    lastName: string;

    constructor(username: string, email: string, firstName: string, lastName: string, picture: string = ""){
        this.username = username;
        this.email = email;
        this.picture = picture;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}

export class RegisterDto extends BaseUser {
    password: string;
    constructor(username: string, email: string, firstName: string, lastName: string, password: string, 
                picture: string = ""){
        super(username, email, firstName, lastName, picture);
        this.password = password;
    }
}

export class UserToDB extends BaseUser {
    hashedPassword: string;
    constructor(username: string, email: string, firstName: string, lastName: string, 
                hashedPassword: string, picture: string = ""){
        super(username, email, firstName, lastName, picture);
        this.hashedPassword = hashedPassword;
    }
}