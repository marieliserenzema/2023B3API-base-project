import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { jwtConfig } from '../jwt/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../guards/auth.guard'
import { APP_GUARD, } from '@nestjs/core';


@Module({
    imports: [TypeOrmModule.forFeature([User]),
    JwtModule.register({
        global: true,
        secret: jwtConfig.secret,
        signOptions: { expiresIn: jwtConfig.expiresIn },
    },),],
    controllers: [UserController],
    providers: [UserService, CreateUserDto, LoginUserDto, {
        provide: APP_GUARD,
        useClass: AuthGuard,
    },],
    exports: [UserService]
})
export class UserModule { }