import { Body, Controller, Get, Param, Post, Req, Res, SetMetadata, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProjectService } from '../services/project.service';
import { Project } from '../entities/project.entity';
import { CreateProjectDto } from '../dto/project.dto';
import { UserRole } from '../entities/user.entity';
import { AdminGuard } from '../guards/admin.guard';
import { RolesGuard } from '../guards/role.guard';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);


@Controller('projects')
@UseGuards(RolesGuard)
export class ProjectController {
    constructor(private readonly ProjectsService: ProjectService,) { }

    @Get()
    findAll(@Req() request): Promise<Project[]> {
        if (request.user.role.includes(UserRole.Employee)) {
            const userId = request.user.userId;
            return this.ProjectsService.findProjectByUserId(userId);
        }
        return this.ProjectsService.findAll();
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
        return this.ProjectsService.createProject(createProjectDto);
    }

}