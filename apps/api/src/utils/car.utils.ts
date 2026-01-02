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