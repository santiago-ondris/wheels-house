import { validCarPicture } from "./car.utils";

export function getPublicIdFromURL(url: string): string {
    if(!validCarPicture(url) || url == '') return '';

    const urlSplit = url.split('/');

    const publicId = urlSplit[urlSplit.length-1].split('.')[0];

    // The prefix could be part of .env for privacy. (possible fix).
    return 'wheels-house/cars/' + publicId;
}