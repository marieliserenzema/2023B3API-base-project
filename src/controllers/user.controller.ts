import { Controller, Get, Body, Post, Request, UsePipes, ValidationPipe, Res, Param, UseGuards, } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { Response } from 'express';
import { SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);


@Controller('users')
export class UserController {
    constructor(private readonly usersService: UserService,) { }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get('me')
    async getProfile(@Request() req, @Res() res: Response) {
        const user = await this.usersService.findById(req.user.userId);
        if (user) {
            return res.status(200).json(user);
        }
        return res.status(401).json({ message: 'Unauthorized' });
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @Public()
    @Post('auth/sign-up')
    @UsePipes(new ValidationPipe({ transform: true }))
    signUp(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto);
    }

    @Public()
    @Post('auth/login')
    @UsePipes(new ValidationPipe())
    login(@Body() loginUserDto: LoginUserDto) {
        return this.usersService.validateUser(loginUserDto);
    }
}