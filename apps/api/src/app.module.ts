import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UserController } from './controllers/user.controller';
import { CarController } from './controllers/car.controller';
import { UserService } from './services/user.service';
import { CarService } from './services/car.service';
import { JwtStrategy } from './validators/auth.validator';


@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true, // This makes the config available everywhere without re-importing
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [UserController, CarController],
  providers: [JwtStrategy, UserService, CarService],
})
export class AppModule {}
