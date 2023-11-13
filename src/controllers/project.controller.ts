import { Body, Controller, Get, Post, SetMetadata, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { Project } from '../entities/project.entity';
import { CreateProjectDto } from '../dto/project.dt';
import { UserRole } from '../entities/user.entity';
import { RolesGuard } from '../guards/role.guards';
import { Public } from './user.controller';

@Controller('projects')
export class ProjectController {
    constructor(private readonly ProjectsService: ProjectService,) { }


    @Public()
    @UseGuards(RolesGuard)
    async findAll(): Promise<Project[]> {
        return this.ProjectsService.findAll();
    }

    @SetMetadata('roles', [UserRole.Admin])
    @UseGuards(RolesGuard)
    @Post()
    createProject(@Body() createProjectDto: CreateProjectDto) {
        return this.ProjectsService.createProject(createProjectDto);
    }

}