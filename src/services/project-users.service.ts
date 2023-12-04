import { ForbiddenException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectUsers } from '../entities/project-users.entity';
import { CreateProjectUsersDto } from '../dto/project-users.dto';
import { UserService } from './user.service';
import { ProjectService } from './project.service';


@Injectable()
export class ProjectUsersService {
    constructor(
        @InjectRepository(ProjectUsers)
        private readonly projectRepository: Repository<ProjectUsers>,
        @Inject(UserService)
        private readonly userService: UserService,
        @Inject(ProjectService)
        private readonly projectService: ProjectService,
    ) { }


    findAll(): Promise<ProjectUsers[]> {
       return this.projectRepository.find();
    }

    async findProjectUsersByUserId(userId: string): Promise<ProjectUsers[]> {
        const projects = await this.projectRepository.find({ where: { userId: userId } });

        if (!projects || projects.length === 0) {
            throw new NotFoundException(`No projects found for user with ID: ${userId}`);
        }
        return projects;
    }


    async findProjectUsersById(id: string): Promise<ProjectUsers> {
        const project = await this.projectRepository.find({ where: { id: id } });

        if (!project || project.length === 0) {
            throw new NotFoundException(`No projects found with ID: ${id}`);
        }
        return project[0];
    }

    async findProjectUsersByIdEmployee(id: string, userId : string): Promise<ProjectUsers> {
        const project = this.findProjectUsersById(id);

        if ((await project).userId !== userId) {
            throw new ForbiddenException('Access to this project is forbidden');
        }

        return project;
    }

    
    async createProjectUser(createProjectUsersDto: CreateProjectUsersDto): Promise<any> {

        const user = await this.userService.findById(createProjectUsersDto.userId);
        if (!user) {
            throw new UnauthorizedException(`User '${createProjectUsersDto.userId}' not found`);
        }

        const project = await this.projectService.findProjectById(createProjectUsersDto.projectId);
        if (!project) {
            throw new UnauthorizedException(`Project '${createProjectUsersDto.projectId}' not found`);
        }
        const projectUsers = new ProjectUsers();
        projectUsers.projectId = project.id;
        projectUsers.userId = user.id;
        projectUsers.startDate = createProjectUsersDto.startDate;
        projectUsers.endDate = createProjectUsersDto.endDate;
        const newProjectUsers = await this.projectRepository.save(project);
        return newProjectUsers;
    }
}