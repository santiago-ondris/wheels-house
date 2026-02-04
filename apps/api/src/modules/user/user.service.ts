import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDTO, UserToDB, LoginDTO, TokenData, UpdateUserProfileDTO, UpdatePasswordDTO, ResetPasswordDTO, ForgotPasswordDTO } from '../../dto/user.dto';
import { PublicProfileDTO, PublicCarDTO } from '../../dto/public-profile.dto';
import {
    createUser, getUserFromUsernameOrEmail, getPublicProfileByUsername, searchUsers, updateUserFromUserId, getUserFromUsername,
    updatePasswordFromUserId, deleteUserFromUsername,
    updateResetPasswordToken,
    getUserFromRequestTokenSelector,
    updatePasswordFromReset,
    deleteSearchHistoryFromUserId,
    getFounders,
    getFoundersCount,
    countUsers,
    deleteFeedEventsFromUserId,
    deleteUserGameAttemptsFromUserId
} from 'src/database/crud/user.crud';
import { deleteAllCarPictures, deleteCarsFromUserId, deleteFeedEventsFromCarId, getCarsFromUserId, getPicturesFromCar } from 'src/database/crud/car.crud';
import { deleteFeedEventsFromGroupId, deleteGroupedCarsFromCarId, deleteGroupedCarsFromGroupId, deleteGroupsFromUserId, getGroupsFromUserId } from 'src/database/crud/group.crud';
import * as FollowsRepository from '../social/follows/follows.repository';
import * as likesRepository from '../social/likes/likes.repository';
import { NotificationsRepository } from '../social/notifications/notifications.repository';
import { ERROR_CREATING_USER, ERROR_DELETING_USER, ERROR_SENDING_EMAIL, ERROR_UPDATING_USER, INEXISTENT_USER } from 'src/utils/user.utils';
import bcrypt from "bcrypt";
import { randomBytes } from 'crypto';
import { UploadService } from '../../services/upload.service';
import { getPublicIdFromURL } from 'src/utils/upload.utils';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../../services/email.service';

@Injectable()
export class UserService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly uploadService: UploadService,
        private readonly configService: ConfigService,
        private readonly emailService: EmailService,
        private readonly notificationsRepository: NotificationsRepository
    ) { }

    async registerService(registerData: RegisterDTO) {
        const hashedPassword = await bcrypt.hash(registerData.password, Number(this.configService.get<string>('HASH_SALT')!));

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

        // Check if user is among founders (first 100)
        try {
            const userCount = await countUsers();
            if (userCount <= 100) {
                await this.emailService.sendWelcomeEmail(registerData.email, registerData.username, userCount);
            }
        } catch (e) {
            console.error("[Register] Error sending welcome email:", e);
        }

        return true;
    }

    async loginService(loginData: LoginDTO) {
        const user = await getUserFromUsernameOrEmail(loginData.usernameOrEmail);

        // Verify password
        const isPasswordValid = await bcrypt.compare(loginData.password, user.hashedPassword);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        // Payload for access token (short-lived)
        const accessPayload = {
            username: user.username,
            userId: user.userId,
            tokenType: 'access',
        };

        // Payload for refresh token (long-lived)
        const refreshPayload = {
            username: user.username,
            userId: user.userId,
            tokenType: 'refresh',
        };

        const accessToken: string = await this.jwtService.signAsync(accessPayload, {
            expiresIn: '15m',
            secret: this.configService.get<string>('JWT_SECRET')
        });

        const refreshToken: string = await this.jwtService.signAsync(refreshPayload, {
            expiresIn: '14d',
            secret: this.configService.get<string>('JWT_REFRESH_SECRET')
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    async refreshTokenService(username: string) {
        const user = await getUserFromUsername(username);

        const accessPayload = {
            username,
            userId: user.userId,
            tokenType: 'access',
        };

        const refreshPayload = {
            username,
            userId: user.userId,
            tokenType: 'refresh',
        };

        const accessToken: string = await this.jwtService.signAsync(accessPayload, {
            expiresIn: '15m',
            secret: this.configService.get<string>('JWT_SECRET')
        });

        const refreshToken: string = await this.jwtService.signAsync(refreshPayload, {
            expiresIn: '14d',
            secret: this.configService.get<string>('JWT_REFRESH_SECRET')
        });

        return { accessToken, refreshToken };
    }

    async getPublicProfileService(username: string, currentUserId?: number): Promise<PublicProfileDTO> {
        const userData = await getPublicProfileByUsername(username);

        if (!userData) {
            throw INEXISTENT_USER;
        }

        // Fetch a los autos del usuario.
        const carsFromDB = await getCarsFromUserId(userData.userId);

        // Fetch a los grupos del usuario.
        const groupsFromDB = await getGroupsFromUserId(userData.userId);

        // Social stats
        let followersCount: number | undefined;
        let followingCount: number | undefined;
        let isFollowing = false;
        let isFollower = false;

        const isOwner = currentUserId === userData.userId;

        if (isOwner) {
            followersCount = await FollowsRepository.countFollowers(userData.userId);
            followingCount = await FollowsRepository.countFollowing(userData.userId);
        }

        if (currentUserId && !isOwner) {
            isFollowing = await FollowsRepository.isFollowing(currentUserId, userData.userId);
            isFollower = await FollowsRepository.isFollowing(userData.userId, currentUserId);
        }

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
            userData.userId,
            userData.username,
            userData.firstName,
            userData.lastName,
            cars.length,
            groupsFromDB.length,
            cars,
            followersCount,
            followingCount,
            userData.picture ?? undefined,
            userData.createdDate ?? undefined,
            userData.biography ?? undefined,
            userData.defaultSortPreference ?? 'id:desc',
            isFollowing,
            isFollower,
            userData.isAdmin ?? false,
            isOwner ? userData.email : undefined
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

    async getFoundersService() {
        return await getFounders();
    }

    async getFoundersCountService(): Promise<{ count: number }> {
        const count = await getFoundersCount();
        return { count };
    }

    async updateUserService(userData: TokenData, userChanges: UpdateUserProfileDTO) {
        const user = await getUserFromUsernameOrEmail(userData.username);

        if (user.picture != null && user.picture != '' && user.picture != userChanges.picture) {
            await this.uploadService.deleteImage(getPublicIdFromURL(user.picture));
        }

        const updated = await updateUserFromUserId(user.userId, userChanges);

        if (!updated) {
            throw ERROR_UPDATING_USER;
        }

        return true;
    }

    async updatePasswordService(userData: TokenData, updatePasswordData: UpdatePasswordDTO) {
        const user = await getUserFromUsername(userData.username);

        const hashedPassword = await bcrypt.hash(updatePasswordData.newPassword, Number(this.configService.get<string>('HASH_SALT')!));

        const passwordUpdated = await updatePasswordFromUserId(user.userId, hashedPassword);

        if (!passwordUpdated) {
            throw ERROR_UPDATING_USER;
        }

        return true;
    }

    async deleteUserService(userData: TokenData) {
        const user = await getUserFromUsername(userData.username);
        if (!user) {
            throw INEXISTENT_USER;
        }

        const cars = await getCarsFromUserId(user.userId);
        const groups = await getGroupsFromUserId(user.userId);

        const carPictures: string[] = [];
        for (const car of cars) {
            const pics = await getPicturesFromCar(car.carId);
            pics.forEach(p => carPictures.push(p.url));
        }

        for (const car of cars) {
            await likesRepository.deleteCarLikes(car.carId);
            await this.notificationsRepository.deleteByCarId(car.carId);
            await deleteFeedEventsFromCarId(car.carId);
            await deleteGroupedCarsFromCarId(car.carId);
            await deleteAllCarPictures(car.carId);
        }

        for (const group of groups) {
            await likesRepository.deleteGroupLikes(group.groupId);
            await this.notificationsRepository.deleteByGroupId(group.groupId);
            await deleteFeedEventsFromGroupId(group.groupId);
            await deleteGroupedCarsFromGroupId(group.groupId);
        }

        const deletedCars = await deleteCarsFromUserId(user.userId);
        if (deletedCars == null) {
            throw ERROR_DELETING_USER;
        }

        const deletedGroups = await deleteGroupsFromUserId(user.userId);
        if (deletedGroups == null) {
            throw ERROR_DELETING_USER;
        }

        const deletedSearchHistory = await deleteSearchHistoryFromUserId(user.userId);
        const deletedFeedEvents = await deleteFeedEventsFromUserId(user.userId);
        const deletedGameAttempts = await deleteUserGameAttemptsFromUserId(user.userId);

        // Social cleanup
        await likesRepository.deleteUserLikes(user.userId);
        await FollowsRepository.deleteUserFollows(user.userId);
        await this.notificationsRepository.deleteByUserId(user.userId);

        if (!deletedSearchHistory || !deletedFeedEvents || !deletedGameAttempts) {
            throw ERROR_DELETING_USER;
        }

        const deletedUser = await deleteUserFromUsername(userData.username);
        if (deletedUser == null) {
            throw ERROR_DELETING_USER;
        }
        // User picture
        if (deletedUser.picture != null && deletedUser.picture != '') {
            try {
                await this.uploadService.deleteImage(getPublicIdFromURL(deletedUser.picture));
            } catch (e) {
                console.error("Cloudinary: Error deleting user picture", e);
            }
        }

        for (const url of carPictures) {
            try {
                await this.uploadService.deleteImage(getPublicIdFromURL(url));
            } catch (e) {
                console.error("Cloudinary: Error deleting car picture", e);
            }
        }

        for (const group of groups) {
            if (group.picture != null && group.picture != '') {
                try {
                    await this.uploadService.deleteImage(getPublicIdFromURL(group.picture));
                } catch (e) {
                    console.error("Cloudinary: Error deleting group picture", e);
                }
            }
        }

        return true;
    }

    async forgotPasswordService(forgotPasswordData: ForgotPasswordDTO) {
        const user = await getUserFromUsernameOrEmail(forgotPasswordData.usernameOrEmail);

        if (!user) {
            throw INEXISTENT_USER;
        }

        // selector + validator.
        const resetToken = randomBytes(16).toString('hex');

        const selector = resetToken.slice(0, 16);

        const validator = resetToken.slice(16);

        const hashedValidator = await bcrypt.hash(validator, Number(this.configService.get<string>('HASH_SALT')!));

        const updatedResetToken = await updateResetPasswordToken(user.userId, selector, hashedValidator);

        if (!updatedResetToken) {
            throw ERROR_UPDATING_USER;
        }


        // Send email with url with token=selector.validator
        const domain = this.configService.get<string>('APP_DOMAIN')!;

        const url = `${domain}/reset-password?token=${selector + '.' + validator}`;

        await this.emailService.sendForgotPasswordEmail(user.email, user.username, url);

        return true;
    }

    async resetPasswordService(requestToken: string, resetPasswordData: ResetPasswordDTO) {
        const splitToken = requestToken.split('.');

        const selector = splitToken[0];

        const user = await getUserFromRequestTokenSelector(selector);

        const hashedPassword = await bcrypt.hash(resetPasswordData.newPassword, Number(this.configService.get<string>('HASH_SALT')!));

        const updatedPassword = await updatePasswordFromReset(user!.userId, hashedPassword);

        if (!updatedPassword) {
            throw ERROR_UPDATING_USER;
        }

        return true;
    }
}