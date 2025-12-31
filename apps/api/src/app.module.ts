import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './validators/authetication.validator';
import { CollectionController } from './controllers/collection.controller';
import { CollectionService } from './services/collection.service';


@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true, // This makes the config available everywhere without re-importing
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController, CollectionController],
  providers: [UserService, JwtStrategy, CollectionService],
})
export class AppModule {}
