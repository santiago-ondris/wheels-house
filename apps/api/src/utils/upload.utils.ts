import { validCarPicture } from "./car.utils";

export function getPublicIdFromURL(url: string): string {
    if (!url || url === '') return '';

    const regex = /(wheels-house\/[^\.]+)/;
    const match = url.match(regex);

    if (match && match[1]) {
        return match[1];
    }

    return '';
}