import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { RegisterDTO, LoginDTO } from '../dto/user.dto';
import { loginValidator, registerValidator } from '../validators/user.validator'

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) { }

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

    @Get('/profile/:username')
    async getPublicProfile(@Param('username') username: string) {
        return await this.userService.getPublicProfileService(username);
    }

    @Get('/search')
    async search(@Query('q') query: string) {
        return await this.userService.searchUsersService(query);
    }
}
