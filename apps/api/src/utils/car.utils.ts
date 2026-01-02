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