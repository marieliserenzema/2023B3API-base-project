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

    @Get()
    findAll(@Req() request): Promise<Project[]> {
        if (request.user.role.includes(UserRole.Employee)) {
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><findProjectByUserId');
            const userId = request.user.userId;
            return this.ProjectsService.findProjectByUserId(userId);
        }
        return this.ProjectsService.findAllAdmin();
    }

    @Get(':id')
    findById(@Param('id') id: string, @Req() request) {
        if (request.user.role.includes(UserRole.Employee)) {
            const userId = request.user.userId;
            return this.ProjectsService.findProjectByIdEmployee(id,userId);
        }
        return this.ProjectsService.findProjectById(id);
    }

    @UseGuards(AdminGuard)
    @Post()
    createProject(@Body() createProjectDto: CreateProjectDto) {
        console.log('createProject');
        return this.ProjectsService.createProject(createProjectDto);
    }

}