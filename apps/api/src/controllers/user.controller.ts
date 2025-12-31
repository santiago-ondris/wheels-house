import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { RegisterDTO, LoginDTO } from '../dto/user.dto';
import { loginValidator, registerValidator } from '../validators/user.validator'

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) {}
    
    @Post('/register')
    async register(@Body() registerData: RegisterDTO) {
        await registerValidator(registerData);
        
        return await this.userService.registerService(registerData);
    }

    @Post('/login')
    async login(@Body() loginData: LoginDTO) {
        await loginValidator(loginData);

        return await this.userService.loginService(loginData);
    }
}
        