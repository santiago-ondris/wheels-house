import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { RegisterDto, UserToDB } from '../dto/user.dto';
import { registerValidator } from '../validators/user.validator'
import { createUser } from 'src/database/crud/user.crud'
import { ERROR_CREATING_USER } from 'src/utils/user.utils';
import bcrypt from "bcrypt";

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}
    
    @Post('/register')
    async register(@Body() registerData: RegisterDto){
        await registerValidator(registerData);

        const hashedPassword  = await bcrypt.hash(registerData.password, 10);

        const newUser : UserToDB = new UserToDB(
            registerData.username, registerData.email, registerData.firstName,
            registerData.lastName, hashedPassword, registerData.picture
        );

        // TO DO: User verification.

        const created = await createUser(newUser); 

        if (!created) {
            throw ERROR_CREATING_USER;
        }

        return true;
    }
}
        