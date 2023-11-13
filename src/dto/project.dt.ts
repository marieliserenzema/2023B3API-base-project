import { IsString, MinLength } from "class-validator";

export class CreateProjectDto {
    @IsString()
    @MinLength(3, { message: 'Le nom du project doit contenir au moins 3 caractères' })
    name: string;

    @IsString()
    referringEmployeeId: string;
}