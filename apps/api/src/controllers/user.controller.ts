import { Controller, Get, Post, Body, Put, Delete, Param, Query, UseGuards, Request } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { RegisterDTO, LoginDTO, UpdateUserProfileDTO, UpdatePasswordDTO, ResetPasswordDTO, ForgotPasswordDTO } from '../dto/user.dto';
import { loginValidator, registerValidator, forgotPasswordValidator, resetPasswordValidator, updatePasswordValidator, updateUserValidator } from '../validators/user.validator'
import { JwtAuthGuard } from 'src/validators/auth.validator';
import { ThrottlerGuard } from '@nestjs/throttler';

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

    @UseGuards(JwtAuthGuard)
    @Put('user/update-info')
    async updateUser(@Request() req, @Body() userChanges: UpdateUserProfileDTO) {
        await updateUserValidator(req.user, userChanges);

        return await this.userService.updateUserService(req.user, userChanges);
    }

    @UseGuards(JwtAuthGuard)
    @Put('user/update-password')
    async updatePassword(@Request() req, @Body() updatePasswordData: UpdatePasswordDTO) {
        await updatePasswordValidator(req.user, updatePasswordData);

        return await this.userService.updatePasswordService(req.user, updatePasswordData);
    }

    @UseGuards(ThrottlerGuard)
    @Post('user/forgot-password')
    async forgotPassword(@Body() forgotPasswordeData: ForgotPasswordDTO) {
        console.log(process.env.EMAIL_PASSWORD!);
        console.log(process.env.EMAIL_ADDRESS!);
        console.log(process.env.EMAIL_PROVIDER!);
        await forgotPasswordValidator(forgotPasswordeData);

        return await this.userService.forgotPasswordService(forgotPasswordeData);
    }

    @Post('user/reset-password/:requestToken')
    async resetPassword(@Param('requestToken') requestToken, @Body() resetPasswordData: ResetPasswordDTO) {
        await resetPasswordValidator(requestToken, resetPasswordData);

        return await this.userService.resetPasswordService(requestToken, resetPasswordData);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('user')
    async deleteUser(@Request() req) {
        return await this.userService.deleteUserService(req.user);
    }
}
