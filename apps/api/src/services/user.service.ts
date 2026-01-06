import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDTO, UserToDB, LoginDTO, LoginResponse } from '../dto/user.dto';
import { PublicProfileDTO, PublicCarDTO } from '../dto/public-profile.dto';
import { createUser, getUserFromUsernameOrEmail, getPublicProfileByUsername } from 'src/database/crud/user.crud';
import { getCarsFromUserId, getPicturesFromCar } from 'src/database/crud/car.crud';
import { ERROR_CREATING_USER } from 'src/utils/user.utils';
import bcrypt from "bcrypt";

@Injectable()
export class UserService {
    constructor(private readonly jwtService: JwtService) { }

    async registerService(registerData: RegisterDTO) {
        const hashedPassword = await bcrypt.hash(registerData.password, 10);

        const newUser: UserToDB = new UserToDB(
            registerData.username, registerData.email, registerData.firstName,
            registerData.lastName, hashedPassword, registerData.picture
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
            throw new NotFoundException('Usuario no encontrado');
        }

        // Fetch a los autos del usuario.
        const carsFromDB = await getCarsFromUserId(userData.userId);

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
            0, // totalGroups - por ahora hardcodeado pa
            cars,
            userData.picture ?? undefined,
            userData.createdDate ?? undefined
        );
    }
}