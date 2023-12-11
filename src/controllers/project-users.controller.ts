import { Body, Controller, Get, Param, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ProjectUsersService } from "../services/project-users.service";
import { ProjectUsers } from "../entities/project-users.entity";
import { UserRole } from "../entities/user.entity";
import { RolesGuard } from "../guards/role.guard";
import { CreateProjectUsersDto } from "../dto/project-users.dto";
import { Project } from "../entities/project.entity";

@Controller('project-users')
@UseGuards(RolesGuard)
export class ProjectUsersController {
    constructor(private readonly ProjectsUsersService: ProjectUsersService,) { }

    @Get()
    findAll(@Req() request): Promise<Project[]>{
        if (request.user.role.includes(UserRole.Employee)) {
            const userId = request.user.userId;
            const projects = this.ProjectsUsersService.findProjectByUserId(userId);
            return projects;
        }
        return this.ProjectsUsersService.findAllProject();
    }

    @Get(':id')
    findById(@Param('id') id: string, @Req() request) {
        if (request.user.role.includes(UserRole.Employee)) {
            const userId = request.user.userId;
            return this.ProjectsUsersService.findProjectUsersByIdEmployee(id,userId); 
        }
        return this.ProjectsUsersService.findProjectUsersById(id);
    }

    @Post()
    createProjectUsers(@Body() createProjectUsersDto: CreateProjectUsersDto, @Req() request) {
        if (request.user.role.includes(UserRole.Employee)) {
            throw new UnauthorizedException(`User '${request.user.userId}' not found`);
        }
        const role = request.user.role;
        return this.ProjectsUsersService.createProjectUser(createProjectUsersDto, role);
    }
}