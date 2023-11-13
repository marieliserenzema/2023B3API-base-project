import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "../entities/project.entity";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import { CreateProjectDto } from "../dto/project.dt";

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
        private jwtService: JwtService
    ) { }


    async findAll(): Promise<Project[]> {
        return this.projectRepository.find();
    }

    async findByUserId(userId: string): Promise<Project | undefined> {
        const project = await this.projectRepository.findOne({
            where: { referringEmployeeId: userId },
        });
        return project;
    }

    async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
        const project = new Project();
        project.name = createProjectDto.name;
        project.referringEmployeeId = createProjectDto.referringEmployeeId;
        const newProject = await this.projectRepository.save(project);
        return newProject;


    }
}