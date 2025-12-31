import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDTO, UserToDB, LoginDTO, LoginResponse } from '../dto/user.dto';
import { createUser, getUserFromUsernameOrEmail } from 'src/database/crud/user.crud'
import { ERROR_CREATING_USER } from 'src/utils/user.utils';
import bcrypt from "bcrypt";

@Injectable()
export class UserService {
    constructor(private readonly jwtService: JwtService) {}

    async registerService(registerData: RegisterDTO) {
        const hashedPassword  = await bcrypt.hash(registerData.password, 10);

        const newUser : UserToDB = new UserToDB(
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
}