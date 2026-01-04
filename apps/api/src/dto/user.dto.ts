import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class BaseUser {
    @IsNotEmpty()
    @IsString()
    username: string;
    
    @IsNotEmpty()
    @IsString()
    email: string;
    
    @Transform(({ value }) => value ?? '')
    @IsString()
    @IsOptional()
    picture: string = '';

    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    constructor(username: string, email: string, firstName: string, lastName: string, picture: string = "") {
        this.username = username;
        this.email = email;
        this.picture = picture;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}

export class RegisterDTO extends BaseUser {
    @IsNotEmpty()
    @IsString()
    password: string;

    constructor(username: string, email: string, firstName: string, lastName: string, 
                password: string, picture: string = "") {
        super(username, email, firstName, lastName, picture);
        this.password = password;
    }
}

export class UserToDB extends BaseUser {
    hashedPassword: string;

    constructor(username: string, email: string, firstName: string, lastName: string, 
                hashedPassword: string, picture: string = "") {
        super(username, email, firstName, lastName, picture);
        this.hashedPassword = hashedPassword;
    }
}

export class LoginDTO {
    @IsNotEmpty()
    @IsString()
    usernameOrEmail: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    constructor(usernameOrEmail: string, password: string) {
        this.usernameOrEmail = usernameOrEmail;
        this.password = password;
    }
}

export class LoginResponse {
    authorization: string;

    constructor(authorization: string) {
        this.authorization = authorization;
    }
}

export class TokenData {
    username: string;

    constructor(username: string) {
        this.username = username;
    }
}