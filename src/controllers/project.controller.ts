import { Body, Controller, Get, Param, Post, Req, Res, SetMetadata, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { Project } from '../entities/project.entity';
import { CreateProjectDto } from '../dto/project.dto';
import { UserRole } from '../entities/user.entity';
import { RolesGuard } from '../guards/role.guard';
import { Public } from './user.controller';
import { AuthGuard } from '../guards/auth.guard';
import { Admin } from 'typeorm';
import { AdminGuard } from '../guards/admin.guard';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);

@Controller('projects')
export class ProjectController {
    constructor(private readonly ProjectsService: ProjectService,) { }



    @UseGuards(RolesGuard)
    @Roles(UserRole.Employee, UserRole.ProjectManager)
    @Get()
    async findAll(@Req() request): Promise<Project[]> {
        console.log('findAll');
        const userId = request.user.id;
        console.log('userId', userId)
        return this.ProjectsService.findProjectByUserId(userId);
    }

    @UseGuards(RolesGuard)
    @Roles(UserRole.Admin)
    @Get()
    async findAllAdmin(): Promise<Project[]> {
        console.log('findAllAdmin');
        return this.ProjectsService.findAllAdmin();
    }





    @Get(':id')
    findById(@Param() id: string) {
        //return this.ProjectsService.findById(id);
    }

    @UseGuards(AdminGuard)
    @Post()
    createProject(@Body() createProjectDto: CreateProjectDto) {
        console.log('createProject');
        return this.ProjectsService.createProject(createProjectDto);
    }

}