import { HttpException, HttpStatus  } from "@nestjs/common";

export const isLower = (c: string) => c === c.toLowerCase() && c !== c.toUpperCase();
export const isUpper = (c: string) => c === c.toUpperCase() && c !== c.toLowerCase();

export const INVALID_PASSWORD_EXCEPTION = new HttpException(
    {
        status: HttpStatus.BAD_REQUEST,
        error: 'Password must contain at most 8 characters and at least one lowercase character and one uppercase character.'
    },
    HttpStatus.BAD_REQUEST
);

export const INVALID_EMAIL_ADDRESS = new HttpException(
    {
        status: HttpStatus.BAD_REQUEST,
        error: 'Email address not valid.' 
    },
    HttpStatus.BAD_REQUEST
);

export const USERNAME_ALREADY_IN_USE = new HttpException(
    {
        status: HttpStatus.CONFLICT,
        error: 'Username already in use.' 
    },
    HttpStatus.CONFLICT
);

export const EMAIL_ALREADY_IN_USE = new HttpException(
    {
        status: HttpStatus.CONFLICT,
        error: 'Email already in use.' 
    },
    HttpStatus.CONFLICT
);

export const ERROR_CREATING_USER = new HttpException(
    {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error while creating the user.' 
    },
    HttpStatus.INTERNAL_SERVER_ERROR
);


export function isValidEmail(email: string): boolean {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

export function validatePassword(password: string): boolean { 
    if(password.length < 8 || password.length > 50) return false;
    let hasUpper: boolean = false, hasLower: boolean = false;

    for (let idx = 0; idx < password.length; idx++) {
        hasLower = hasLower || isLower(password[idx]);
        hasUpper = hasUpper || isUpper(password[idx]);
    }

    return hasLower && hasUpper;
}