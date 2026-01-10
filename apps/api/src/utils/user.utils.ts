import { HttpException, HttpStatus  } from "@nestjs/common";
import bcrypt from "bcrypt";

export const isLower = (c: string) => c === c.toLowerCase() && c !== c.toUpperCase();
export const isUpper = (c: string) => c === c.toUpperCase() && c !== c.toLowerCase();

export const PASSWORE_RESET_TIME_LIMIT = 1800000 // half an hour.

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

export const INVALID_USERNAME = new HttpException(
    {
        status: HttpStatus.BAD_REQUEST,
        error: 'Username can not contain @.' 
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

export const INEXISTENT_USER = new HttpException(
    {
        status: HttpStatus.NOT_FOUND,
        error: 'Inexistent user.' 
    },
    HttpStatus.NOT_FOUND
);

export const INVALID_CREDENTIALS = new HttpException(
    {
        status: HttpStatus.UNAUTHORIZED,
        error: 'Invalid credentials.' 
    },
    HttpStatus.UNAUTHORIZED
);

export const USER_PICTURE_FORMAT_NOT_VALID = new HttpException(
    {
        status: HttpStatus.BAD_REQUEST,
        error: 'Picture format not valid.' 
    },
    HttpStatus.BAD_REQUEST
);

export const ERROR_UPDATING_USER = new HttpException(
    {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error while updating the user.' 
    },
    HttpStatus.INTERNAL_SERVER_ERROR
);

export const ERROR_DELETING_USER = new HttpException(
    {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error while deleting the user.' 
    },
    HttpStatus.INTERNAL_SERVER_ERROR
);

export const ERROR_SENDING_EMAIL = new HttpException(
    {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error while sending the email.' 
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

export async function verifyPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
}

export async function verifyTokenValidator(tokenValidator: string, hashedTokenValidator: string) {
    return await bcrypt.compare(tokenValidator, hashedTokenValidator);
}

export function validUserPicture(url: string): boolean {
    if(url.length == 0) return true;
    
    const cloudinaryRegex = /^https:\/\/res\.cloudinary\.com\/dyx7kjnjq\/image\/upload\/v\d+\/wheels-house\/cars\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/;
    
    return cloudinaryRegex.test(url);
}