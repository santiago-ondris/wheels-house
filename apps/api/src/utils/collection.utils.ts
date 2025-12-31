import { HttpException, HttpStatus } from "@nestjs/common";

export const ERROR_CREATING_COLLECTION = new HttpException(
    {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error while creating the collection.' 
    },
    HttpStatus.INTERNAL_SERVER_ERROR
);

export const COLLECTION_NAME_ALREADY_IN_USE = new HttpException(
    {
        status: HttpStatus.CONFLICT,
        error: 'Collection name already in use.' 
    },
    HttpStatus.CONFLICT
);