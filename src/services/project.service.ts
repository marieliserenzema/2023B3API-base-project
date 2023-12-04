import { ForbiddenException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { CreateProjectDto } from '../dto/project.dto';
import { UserService } from './user.service';


@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        @Inject(UserService)
        private readonly userService: UserService,
    ) { }

    async findAllAdmin(): Promise<Project[]> {
        return this.projectRepository.find();
    }

    async findProjectByUserId(userId: string): Promise<Project[]> {
        const projects = await this.projectRepository.find({ where: { referringEmployeeId: userId } });

        if (!projects || projects.length === 0) {
            throw new NotFoundException(`No projects found for user with ID: ${userId}`);
        }

        return projects;
    }

    async findProjectById(id: string): Promise<Project> {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><findProjectByUserId');
        const project = await this.projectRepository.find({ where: { id: id } });

        if (!project || project.length === 0) {
            throw new NotFoundException(`No projects found with ID: ${id}`);
        }

        return project[0];
    }

    async findProjectByIdEmployee(id: string, userId : string): Promise<Project> {
        const project = this.findProjectById(id);

        if ((await project).referringEmployeeId !== userId) {
            throw new ForbiddenException('Access to this project is forbidden');
        }

        return project;
    }


    async createProject(createProjectDto: CreateProjectDto): Promise<any> {
        const project = new Project();
        project.name = createProjectDto.name;
        project.referringEmployeeId = createProjectDto.referringEmployeeId;
        const newProject = await this.projectRepository.save(project);
        const referringEmployee = await this.userService.findById(project.referringEmployeeId);
        if (!referringEmployee || referringEmployee.role == 'Employee') {
            throw new UnauthorizedException(`User '${referringEmployee.username}' not found`);
        }

        return {
            id: newProject.id,
            name: newProject.name,
            referringEmployeeId: newProject.referringEmployeeId,
            referringEmployee: referringEmployee
        }
    }
}