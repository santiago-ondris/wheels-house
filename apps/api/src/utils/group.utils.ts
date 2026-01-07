import { HttpException, HttpStatus  } from "@nestjs/common";

export const NAME_MAX_LENGTH = 15;
export const DESCRIPTION_MAX_LENGTH = 128;


export const GROUP_PICTURE_FORMAT_NOT_VALID = new HttpException(
    {
        status: HttpStatus.BAD_REQUEST,
        error: 'Picture format not valid.' 
    },
    HttpStatus.BAD_REQUEST
);

export const NAME_TOO_LONG = new HttpException(
    {
        status: HttpStatus.BAD_REQUEST,
        error: `Group name can not have more than ${NAME_MAX_LENGTH}, characters.`
    },
    HttpStatus.BAD_REQUEST
);

export const GROUP_NAME_IN_USE = new HttpException(
    {
        status: HttpStatus.BAD_REQUEST,
        error: 'You already have a group with this name.' 
    },
    HttpStatus.BAD_REQUEST
);

export const DESCRIPTION_TOO_LONG = new HttpException(
    {
        status: HttpStatus.BAD_REQUEST,
        error: `Group description can not have more than ${DESCRIPTION_MAX_LENGTH} characters.`
    },
    HttpStatus.BAD_REQUEST
);

export const ERROR_CREATING_GROUP = new HttpException(
    {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error while creating the group.' 
    },
    HttpStatus.INTERNAL_SERVER_ERROR
);

export const INEXISTENT_GROUP = new HttpException(
    {
        status: HttpStatus.NOT_FOUND,
        error: 'Inexistent group.' 
    },
    HttpStatus.NOT_FOUND
);

export function validGroupPicture(url: string): boolean {
    if(url == '') return true;
    const cloudinaryRegex = /^https:\/\/res\.cloudinary\.com\/dyx7kjnjq\/image\/upload\/v\d+\/wheels-house\/cars\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/;
    
    return cloudinaryRegex.test(url);
}