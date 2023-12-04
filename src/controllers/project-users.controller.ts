import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ProjectUsersService } from "../services/project-users.service";
import { ProjectUsers } from "../entities/project-users.entity";
import { Public } from "./user.controller";
import { UserRole } from "../entities/user.entity";
import { RolesGuard } from "../guards/role.guard";
import { CreateProjectUsersDto } from "../dto/project-users.dto";
import { AdminGuard } from "../guards/admin.guard";

@Controller('projects-users')
@UseGuards(RolesGuard)
export class ProjectUsersController {
    constructor(private readonly ProjectsUsersService: ProjectUsersService,) { }

    @Get()
    findAll(@Req() request): Promise<ProjectUsers[]> {
        if (request.user.role.includes(UserRole.Employee)) {
            const userId = request.user.userId;
            return this.ProjectsUsersService.findProjectUsersByUserId(userId);
        }
        return this.ProjectsUsersService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string, @Req() request):  Promise<ProjectUsers>  {
        if (request.user.role.includes(UserRole.Employee)) {
            const userId = request.user.userId;
            return this.ProjectsUsersService.findProjectUsersByIdEmployee(id,userId); 
        }
        return this.ProjectsUsersService.findProjectUsersById(id);
    }

    @UseGuards(AdminGuard)
    @Post()
    createProjectUsers(@Body() createProjectUsersDto: CreateProjectUsersDto) {
        return this.ProjectsUsersService.createProjectUser(createProjectUsersDto);
    }
}