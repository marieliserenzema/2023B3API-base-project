import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import * as bcrypt from 'bcrypt';

enum UserRole {
    Employee = 'Employee',
    Admin = 'Admin',
    ProjectManager = 'ProjectManager'
}

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3, { message: 'Le username doit contenir au moins 3 caractères' })
    username!: string;

    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    password!: string;

    role?: UserRole;

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}

export class LoginUserDto {
    @IsString()
    @IsEmail({}, { message: 'Le format de l\'email est incorrect' })
    email!: string;

    @IsString()
    @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    password!: string;
}
