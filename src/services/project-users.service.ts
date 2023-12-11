import { ConflictException, ForbiddenException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectUsers } from '../entities/project-users.entity';
import { CreateProjectUsersDto } from '../dto/project-users.dto';
import { UserService } from './user.service';
import { ProjectService } from './project.service';
import { Project } from '../entities/project.entity';
import { UserRole } from '../entities/user.entity';


@Injectable()
export class ProjectUsersService {
    constructor(
        @InjectRepository(ProjectUsers)
        private readonly projectUsersRepository: Repository<ProjectUsers>,
        @Inject(UserService)
        private readonly userService: UserService,
        @Inject(ProjectService)
        private readonly projectService: ProjectService,
    ) { }

    findAllProject(): Promise<Project[]> {
        return this.projectService.findAll();
    }

    findProjectByUserId(userId : string) : Promise<Project[]> {
        return this.projectService.findProjectByUserIdWithNoExeption(userId);
    }

    findAll(): Promise<ProjectUsers[]> {
       return this.projectUsersRepository.find();
    }

    async findProjectUsersByUserId(userId: string): Promise<ProjectUsers[]> {
        const projectUsers = await this.projectUsersRepository.find({ where: { userId: userId } });
        return projectUsers;
    }


    async findProjectUsersById(id: string){
        const projectUsers = await this.projectUsersRepository.find({ where: { id: id } });
        if (projectUsers.length === 0) {
            return [];
        }
        return projectUsers[0];
    }

    async findProjectUsersByIdEmployee(id: string, userId: string) {
      const projectUsers = await this.findProjectUsersById(id);
      if (!projectUsers) {
        return [];
      }

      if (Array.isArray(projectUsers) || projectUsers.userId !== userId) {
        return null;
      }
      return projectUsers;
    }

    
    async createProjectUser(createProjectUsersDto: CreateProjectUsersDto, role : UserRole): Promise<any> {

        const user = await this.userService.findById(createProjectUsersDto.userId);
        if (!user) {
            throw new UnauthorizedException(`User '${createProjectUsersDto.userId}' not found`);
        }

        const project = await this.projectService.findProjectById(createProjectUsersDto.projectId);
        if (!project) {
            throw new UnauthorizedException(`Project '${createProjectUsersDto.projectId}' not found`);
        }

        const referringEmployee = await this.userService.findById(project.referringEmployeeId);

        if (await this.hasUserProjectDuringDateRange(user.id, createProjectUsersDto.startDate, createProjectUsersDto.endDate)) {
            throw new ConflictException(`User '${user.id}' has a project during this date range`);
        }

        const projectUsers = new ProjectUsers();
        projectUsers.projectId = project.id;
        projectUsers.userId = user.id;
        projectUsers.startDate = createProjectUsersDto.startDate;
        projectUsers.endDate = createProjectUsersDto.endDate;

        if (role.includes(UserRole.ProjectManager)) {
          return this.projectUsersRepository.save(projectUsers);
        }

        const projectUsersDetails = {
          id : projectUsers.projectId,
          startDate : projectUsers.startDate,
          endDate : projectUsers.endDate,
          userId : projectUsers.userId,
          user : {
            id : user.id,
            username : user.username,
            email : user.email,
            role : user.role,
          },
          projectId : projectUsers.projectId,
          project : {
            id : project.id,
            name : project.name,
            referringEmployeeId : project.referringEmployeeId,
            referringEmployee : {
              id : referringEmployee.id,
              username : referringEmployee.username,
              email : referringEmployee.email,
              role : referringEmployee.role,
            }, 
          }
        }
        return projectUsersDetails;
      }


    getDateRange(startDate: Date, endDate: Date): Date[] {
        const dateRange: Date[] = [];
        let currentDate = new Date(startDate);
      
        while (currentDate <= endDate) {
          dateRange.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      
        return dateRange;
    }

    isDateInRange(date: Date, dateRange: Date[]): boolean {
        return dateRange.some((d: Date) => {
          return (
            d.getFullYear() === date.getFullYear() &&
            d.getMonth() === date.getMonth() &&
            d.getDate() === date.getDate()
          );
        });
    }

    async hasUserProjectDuringDateRange(userId: string, start: Date, end: Date): Promise<boolean> {
        const userProjects = await this.findProjectUsersByUserId(userId); 
      
        const dateRange = this.getDateRange(start, end);
      
        for (const project of userProjects) {
          const projectStartDate = new Date(project.startDate);
          const projectEndDate = new Date(project.endDate);
      
          const projectDateRange = this.getDateRange(projectStartDate, projectEndDate);
      
          if (this.isDateInRange(start, projectDateRange) || this.isDateInRange(end, projectDateRange)) {
            return true;
          }
      
          if (this.isDateInRange(projectStartDate, dateRange) || this.isDateInRange(projectEndDate, dateRange)) {
            return true; 
          }
        }
      
        return false; 
    }
}