import { Controller, Get, Post, Body, Put, Delete, Param, Query, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDTO, LoginDTO, UpdateUserProfileDTO, UpdatePasswordDTO, ResetPasswordDTO, ForgotPasswordDTO } from '../../dto/user.dto';
import { loginValidator, registerValidator, forgotPasswordValidator, resetPasswordValidator, updatePasswordValidator, updateUserValidator } from '../../validators/user.validator'
import { JwtAuthGuard, JwtRefreshGuard } from 'src/validators/auth.validator';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    @Post('/register')
    async register(@Body() registerData: RegisterDTO) {
        await registerValidator(registerData);

        return await this.userService.registerService(registerData);
    }

    @UseGuards(ThrottlerGuard)
    @Post('/login')
    async login(@Body() loginData: LoginDTO) {
        await loginValidator(loginData);

        return await this.userService.loginService(loginData);
    }

    @UseGuards(JwtRefreshGuard)
    @Post('/refresh')
    async refresh(@Request() req) {
        return await this.userService.refreshTokenService(req.user.username);
    }

    @Get('/profile/:username')
    async getPublicProfile(@Param('username') username: string, @Request() req) {
        let currentUserId: number | undefined;

        // Manually check for token to support optional auth without throwing
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.split(' ')[1];
                const decoded = this.jwtService.decode(token) as any;

                if (decoded && decoded.userId) {
                    currentUserId = decoded.userId;
                }
            } catch (e) {
                // Ignore invalid tokens for public profile view
            }
        }

        return await this.userService.getPublicProfileService(username, currentUserId);
    }

    @Get('/search')
    async search(@Query('q') query: string) {
        return await this.userService.searchUsersService(query);
    }

    @Get('/founders')
    async getFounders() {
        return await this.userService.getFoundersService();
    }

    @Get('/founders/count')
    async getFoundersCount() {
        return await this.userService.getFoundersCountService();
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
