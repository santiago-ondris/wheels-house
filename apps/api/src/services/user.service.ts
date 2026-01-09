import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDTO, UserToDB, LoginDTO, LoginResponse, TokenData, UpdateUserProfileDTO, UpdatePasswordDTO } from '../dto/user.dto';
import { PublicProfileDTO, PublicCarDTO } from '../dto/public-profile.dto';
import { createUser, getUserFromUsernameOrEmail, getPublicProfileByUsername, searchUsers, updateUserFromUserId, getUserFromUsername, 
    updatePasswordFromUserId, deleteUserFromUsername } from 'src/database/crud/user.crud';
import { deleteAllCarPictures, deleteCarsFromUserId, getCarsFromUserId, getPicturesFromCar } from 'src/database/crud/car.crud';
import { deleteGroupedCarsFromCarId, deleteGroupsFromUserId, getGroupsFromUserId } from 'src/database/crud/group.crud';
import { ERROR_CREATING_USER, ERROR_DELETING_USER, ERROR_UPDATING_USER, INEXISTENT_USER } from 'src/utils/user.utils';
import bcrypt from "bcrypt";
import { UploadService } from './upload.service';
import { getPublicIdFromURL } from 'src/utils/upload.utils';

@Injectable()
export class UserService {
    constructor(private readonly jwtService: JwtService, private readonly uploadService: UploadService) { }

    async registerService(registerData: RegisterDTO) {
        const hashedPassword = await bcrypt.hash(registerData.password, 10);

        const newUser: UserToDB = new UserToDB(
            registerData.username, registerData.email, registerData.firstName,
            registerData.lastName, hashedPassword, registerData.picture, registerData.biography
        );

        // TO DO: User verification.

        // Inserts user into the db.
        const created = await createUser(newUser);

        if (!created) {
            throw ERROR_CREATING_USER;
        }

        return true;
    }

    async loginService(loginData: LoginDTO) {
        const user = await getUserFromUsernameOrEmail(loginData.usernameOrEmail);

        // Add fields to store more data in the token.    
        const payload = {
            username: user.username,
        };

        const accessToken: string = await this.jwtService.signAsync(payload);

        return new LoginResponse(
            accessToken
        );
    }

    async getPublicProfileService(username: string): Promise<PublicProfileDTO> {
        const userData = await getPublicProfileByUsername(username);

        if (!userData) {
            throw INEXISTENT_USER;
        }

        // Fetch a los autos del usuario.
        const carsFromDB = await getCarsFromUserId(userData.userId);

        // Fetch a los grupos del usuario.
        const groupsFromDB = await getGroupsFromUserId(userData.userId);

        const cars: PublicCarDTO[] = [];
        for (const car of carsFromDB) {
            const carPicturesFromDB = await getPicturesFromCar(car.carId);
            const pictureUrls = carPicturesFromDB.map(p => p.url);

            cars.push(new PublicCarDTO(
                car.carId,
                car.name,
                car.color,
                car.brand,
                car.scale,
                car.manufacturer,
                car.description ?? undefined,
                car.designer ?? undefined,
                car.series ?? undefined,
                car.country ?? undefined,
                pictureUrls
            ));
        }

        return new PublicProfileDTO(
            userData.username,
            userData.firstName,
            userData.lastName,
            cars.length,
            groupsFromDB.length,
            cars,
            userData.picture ?? undefined,
            userData.createdDate ?? undefined,
            userData.biography ?? undefined
        );
    }

    async searchUsersService(query: string) {
        if (!query || query.length < 2) return [];

        const users = await searchUsers(query);
        const lowerQuery = query.toLowerCase();

        // Se ordena por relevancia.
        // 1. match exacto
        // 2. Empieza con
        // 3. Contiene
        return users.sort((a, b) => {
            const aUsername = a.username.toLowerCase();
            const bUsername = b.username.toLowerCase();

            // Match exacto
            if (aUsername === lowerQuery) return -1;
            if (bUsername === lowerQuery) return 1;

            // Empieza con
            const aStarts = aUsername.startsWith(lowerQuery);
            const bStarts = bUsername.startsWith(lowerQuery);
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;

            // Orden alfabético
            return aUsername.localeCompare(bUsername);
        }).slice(0, 10); // Return top 10
    }

    async updateUserService(userData: TokenData, userChanges: UpdateUserProfileDTO) {
        const user = await getUserFromUsernameOrEmail(userData.username);

        if(user.picture != null && user.picture != '' && user.picture != userChanges.picture) {
            await this.uploadService.deleteImage(getPublicIdFromURL(user.picture));
        }

        const updated = await updateUserFromUserId(user.userId, userChanges);
        
        if(!updated) {
            throw ERROR_UPDATING_USER;
        }

        return true;
    }

    async updatePasswordService(userData: TokenData, updatePasswordData: UpdatePasswordDTO) {
        const user = await getUserFromUsername(userData.username);

        const hashedPassword = await bcrypt.hash(updatePasswordData.newPassword, 10);

        const passwordUpdated = await updatePasswordFromUserId(user.userId, hashedPassword);

        if(!passwordUpdated) {
            throw ERROR_UPDATING_USER;
        }

        return true;
    }

    async deleteUserService(userData: TokenData) {
        const deletedUser = await deleteUserFromUsername(userData.username);

        if(deletedUser == null) {
            throw ERROR_DELETING_USER;
        }

        if(deletedUser.picture != null && deletedUser.picture != '') {
            await this.uploadService.deleteImage(getPublicIdFromURL(deletedUser.picture));
        }

        // Delete their cars.
        const deletedCars = await deleteCarsFromUserId(deletedUser.userId);

        if(deletedCars == null) {
            throw ERROR_DELETING_USER;
        }

        for(const car of deletedCars) {
            const deletedPictures = await deleteAllCarPictures(car.carId);

            if(deletedPictures == null) {
                throw ERROR_DELETING_USER;
            }

            for(const picture of deletedPictures) {
                await this.uploadService.deleteImage(getPublicIdFromURL(picture.url));
            }

            const deletedGroupedCars = await deleteGroupedCarsFromCarId(car.carId);
            
            if(!deletedGroupedCars) {
                throw ERROR_DELETING_USER;
            }
        }

        // Delete their groups.
        const deletedGroups = await deleteGroupsFromUserId(deletedUser.userId);

        if(deletedGroups == null) {
            throw ERROR_DELETING_USER;
        }

        for(const group of deletedGroups) {
            if(group.picture != null && group.picture != '') {
                await this.uploadService.deleteImage(getPublicIdFromURL(group.picture));
            }
        }

        return true;
    }
}