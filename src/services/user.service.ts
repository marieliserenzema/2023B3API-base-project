import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { JwtService } from '@nestjs/jwt';




@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private jwtService: JwtService
    ) { }


    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findById(id: string): Promise<User | undefined> {
        const user = await this.userRepository.findOne({
            where: { id: id },
        });

        if (!user) {
            throw new NotFoundException(`User with ID '' not found`);
        }

        return user;
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

        const user = new User();
        user.email = createUserDto.email;
        user.password = hashedPassword;
        user.username = createUserDto.username;
        if (createUserDto.role) {
            user.role = createUserDto.role;
        }

        const newUser = await this.userRepository.save(user);

        return this.userRepository.findOneBy({
            id: newUser.id
        });

    }

    async validateUser(loginUserDto: LoginUserDto): Promise<any> {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.email = :email', { email: loginUserDto.email })
            .getOne();
        if (!user) {
            throw new UnauthorizedException('Email does not exist.');
        }

        if (await bcrypt.compare(loginUserDto.password, user.password) == false) {
            throw new UnauthorizedException('Password is not valid.');
        }

        const payload = { userId: user.id, username: user.username, role: user.role };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}