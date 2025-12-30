import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { RegisterDTO, UserToDB, LoginDTO, LoginResponse } from '../dto/user.dto';
import { loginValidator, registerValidator } from '../validators/user.validator'
import { createUser, getUserFromEmailOrUsername } from 'src/database/crud/user.crud'
import { ERROR_CREATING_USER } from 'src/utils/user.utils';
import bcrypt from "bcrypt";

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}
    
    @Post('/register')
    async register(@Body() registerData: RegisterDTO) {
        await registerValidator(registerData);

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

    @Post('/login')
    async login(@Body() loginData: LoginDTO) {
        await loginValidator(loginData);

        const user = await getUserFromEmailOrUsername(loginData.email, loginData.username);

        const accessToken: string = await this.userService.generateToken(
            { // add parameters to include more info in the token.
                username: user.username,
            }
        );

        return new LoginResponse(
            accessToken
        );
    }
}
        