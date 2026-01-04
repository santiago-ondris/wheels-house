import { HttpException, HttpStatus  } from "@nestjs/common";

export const ERROR_CREATING_CAR = new HttpException(
    {
        status: HttpStatus.CONFLICT,
        error: 'Error while creating the car.' 
    },
    HttpStatus.CONFLICT
);

export const CAR_NAME_ALREADY_IN_USE = new HttpException(
    {
        status: HttpStatus.CONFLICT,
        error: 'Car name already in use.' 
    },
    HttpStatus.CONFLICT
);

export const INEXISTENT_CAR = new HttpException(
    {
        status: HttpStatus.NOT_FOUND,
        error: 'Inexistent car.' 
    },
    HttpStatus.NOT_FOUND
);

export const CAR_DO_NOT_BELONG_TO_USER = new HttpException(
    {
        status: HttpStatus.UNAUTHORIZED,
        error: 'Car do not belong to user.'
    },
    HttpStatus.UNAUTHORIZED
);

export const ERROR_UPDATING_CAR = new HttpException(
    {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error while updating the car.' 
    },
    HttpStatus.INTERNAL_SERVER_ERROR
);

export const ERROR_DELETING_CAR = new HttpException(
    {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error while deleting the car.' 
    },
    HttpStatus.INTERNAL_SERVER_ERROR
);

export const NO_FIELDS_UPDATED = new HttpException(
    {
        status: HttpStatus.BAD_REQUEST,
        error: 'No fields updated.' 
    },
    HttpStatus.BAD_REQUEST
);

export const MAX_CARS_PICTURES_LIMIT = new HttpException(
    {
        status: HttpStatus.BAD_REQUEST,
        error: 'You can not upload more than 10 pictures.' 
    },
    HttpStatus.BAD_REQUEST
);

export const CAR_PICTURE_FORMAT_NOT_VALID = new HttpException(
    {
        status: HttpStatus.BAD_REQUEST,
        error: 'Picture format not valid.' 
    },
    HttpStatus.BAD_REQUEST
);

export function validCarPicture(url: string): boolean {
    const cloudinaryRegex = /^https:\/\/res\.cloudinary\.com\/dyx7kjnjq\/image\/upload\/v\d+\/wheels-house\/cars\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/;
    
    return cloudinaryRegex.test(url);
  }